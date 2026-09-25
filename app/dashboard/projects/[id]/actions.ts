"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { extractWebsiteSignals } from "@/lib/ai/extract";
import { getAIProvider, isMockAIMode } from "@/lib/ai/provider";
import type {
  ArticleOutlineResult,
  SeoBriefResult,
  TopicClusterResult,
  WebsiteAnalysisResult,
} from "@/lib/ai/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

type ProjectRow = {
  id: string;
  name: string;
  website_url: string;
};

type OpportunityRow = {
  id: string;
  title: string;
  description: string;
};

function fail(projectId: string, message: string): never {
  redirect(`/dashboard/projects/${projectId}?error=${encodeURIComponent(message)}`);
}

function messageFrom(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

async function loadProject(projectId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/login");

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, name, website_url")
    .eq("id", projectId)
    .single();

  if (projectError || !project) fail(projectId, "Project not found.");
  return { supabase, project: project as ProjectRow };
}

async function loadOpportunity(
  supabase: ServerClient,
  projectId: string,
  opportunityId: string,
) {
  if (!opportunityId) fail(projectId, "No opportunity was selected.");

  const { data: opportunity, error } = await supabase
    .from("content_opportunities")
    .select("id, title, description")
    .eq("id", opportunityId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (error || !opportunity) fail(projectId, "The selected opportunity was not found.");
  return opportunity as OpportunityRow;
}

async function buildContext(
  supabase: ServerClient,
  project: ProjectRow,
  opportunity: OpportunityRow,
) {
  const { data: analysis } = await supabase
    .from("website_analyses")
    .select("company_summary, target_audience")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    websiteUrl: project.website_url,
    opportunityTitle: String(opportunity.title),
    opportunityDescription: String(opportunity.description ?? ""),
    companySummary: String(analysis?.company_summary ?? ""),
    targetAudience: String(analysis?.target_audience ?? ""),
  };
}

function revalidateWorkflow(projectId: string) {
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/seo");
}

export async function analyzeWebsite(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const { supabase, project } = await loadProject(projectId);

  // Do not create duplicate analyses when a complete analysis already exists.
  // A previous run may have saved the analysis but failed before saving the
  // opportunities, so only the presence of opportunities makes this a no-op.
  const { data: existingOpportunities, error: existingOpportunityError } = await supabase
    .from("content_opportunities")
    .select("id")
    .eq("project_id", projectId)
    .limit(1);

  if (existingOpportunityError) {
    fail(projectId, `Could not check existing opportunities: ${existingOpportunityError.message}`);
  }
  if ((existingOpportunities ?? []).length > 0) {
    revalidateWorkflow(projectId);
    redirect(`/dashboard/projects/${projectId}`);
  }

  let result: WebsiteAnalysisResult;
  try {
    // Use the same bounded extractor as the mock provider so the prompt is
    // grounded in the page title, description, headings, and key terms.
    const signals = await extractWebsiteSignals(project.website_url);
    const websiteText = signals.textLength
      ? `${signals.title}. ${signals.metaDescription}. Headings: ${signals.headings.join("; ")}. Key terms: ${signals.topTerms.join(", ")}`
      : null;

    result = await getAIProvider().analyzeWebsite({
      websiteUrl: project.website_url,
      websiteText,
    });
  } catch (error) {
    console.error("[analyzeWebsite] AI generation failed", error);
    fail(projectId, messageFrom(error, "We couldn't analyze this website right now. Try again."));
  }

  const { data: analysis, error: analysisError } = await supabase
    .from("website_analyses")
    .insert({
      project_id: projectId,
      company_summary: result.companySummary,
      product_category: result.productCategory,
      target_audience: result.targetAudience,
      positioning: result.positioning,
      raw_data: {
        website_url: project.website_url,
        provider: isMockAIMode() ? "mock" : "bedrock",
      },
    })
    .select("id")
    .single();

  if (analysisError || !analysis) {
    console.error("[analyzeWebsite] analysis insert failed", analysisError);
    fail(projectId, `Could not save the analysis: ${analysisError?.message ?? "unknown database error"}`);
  }

  const opportunityRows = result.opportunities.map((opportunity) => ({
    project_id: projectId,
    analysis_id: analysis.id,
    title: opportunity.title,
    description: opportunity.description,
    reason: opportunity.reason,
    opportunity_score: opportunity.opportunityScore,
    difficulty: opportunity.difficulty,
    search_intent: opportunity.searchIntent,
    funnel_stage: opportunity.funnelStage,
  }));

  const { error: opportunityError } = await supabase
    .from("content_opportunities")
    .insert(opportunityRows);

  if (opportunityError) {
    // Do not leave an apparently successful analysis behind when its required
    // workflow output could not be saved.
    await supabase.from("website_analyses").delete().eq("id", analysis.id);
    console.error("[analyzeWebsite] opportunity insert failed", opportunityError);
    fail(projectId, `Could not save content opportunities: ${opportunityError.message}`);
  }

  revalidateWorkflow(projectId);
  redirect(`/dashboard/projects/${projectId}`);
}

export async function generateCluster(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const { supabase, project } = await loadProject(projectId);
  const opportunity = await loadOpportunity(supabase, projectId, opportunityId);

  const { data: existing, error: existingError } = await supabase
    .from("topic_clusters")
    .select("id")
    .eq("project_id", projectId)
    .limit(1);

  if (existingError) fail(projectId, `Could not check existing clusters: ${existingError.message}`);
  if ((existing ?? []).length > 0) {
    revalidateWorkflow(projectId);
    redirect(`/dashboard/projects/${projectId}`);
  }

  let result: TopicClusterResult;
  try {
    result = await getAIProvider().generateCluster(
      await buildContext(supabase, project, opportunity),
    );
  } catch (error) {
    console.error("[generateCluster] AI generation failed", error);
    fail(projectId, messageFrom(error, "We couldn't generate the topic cluster right now. Try again."));
  }

  // These are the columns that exist on topic_clusters. In particular, do not
  // send opportunity_score, difficulty, or funnel_stage here: those belong to
  // content_opportunities and cause PostgREST to reject the insert.
  const { error: insertError } = await supabase.from("topic_clusters").insert({
    project_id: projectId,
    opportunity_id: opportunityId,
    pillar_topic: result.pillarTopic,
    supporting_topics: result.supportingTopics,
    internal_linking_suggestions: result.internalLinkingSuggestions,
    search_intent: result.searchIntent,
    priority: result.priority,
  });

  if (insertError) {
    console.error("[generateCluster] database insert failed", insertError);
    fail(projectId, `Could not save the topic cluster: ${insertError.message}`);
  }

  revalidateWorkflow(projectId);
  redirect(`/dashboard/projects/${projectId}`);
}

export async function generateBrief(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const { supabase, project } = await loadProject(projectId);
  const opportunity = await loadOpportunity(supabase, projectId, opportunityId);

  const { data: existing, error: existingError } = await supabase
    .from("seo_briefs")
    .select("id")
    .eq("project_id", projectId)
    .limit(1);

  if (existingError) fail(projectId, `Could not check existing briefs: ${existingError.message}`);
  if ((existing ?? []).length > 0) {
    revalidateWorkflow(projectId);
    redirect(`/dashboard/projects/${projectId}`);
  }

  let result: SeoBriefResult;
  try {
    result = await getAIProvider().generateBrief(
      await buildContext(supabase, project, opportunity),
    );
  } catch (error) {
    console.error("[generateBrief] AI generation failed", error);
    fail(projectId, messageFrom(error, "We couldn't generate the SEO brief right now. Try again."));
  }

  const { error: insertError } = await supabase.from("seo_briefs").insert({
    project_id: projectId,
    opportunity_id: opportunityId,
    primary_keyword: result.primaryKeyword,
    search_intent: result.searchIntent,
    target_audience: result.targetAudience,
    suggested_headings: result.suggestedHeadings,
    questions_to_answer: result.questionsToAnswer,
    entities_to_mention: result.entitiesToMention,
    competitor_insights: result.competitorInsights,
  });

  if (insertError) {
    console.error("[generateBrief] database insert failed", insertError);
    fail(projectId, `Could not save the SEO brief: ${insertError.message}`);
  }

  revalidateWorkflow(projectId);
  redirect(`/dashboard/projects/${projectId}`);
}

export async function generateOutline(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const { supabase, project } = await loadProject(projectId);
  const opportunity = await loadOpportunity(supabase, projectId, opportunityId);

  const { data: existing, error: existingError } = await supabase
    .from("article_outlines")
    .select("id")
    .eq("project_id", projectId)
    .limit(1);

  if (existingError) fail(projectId, `Could not check existing outlines: ${existingError.message}`);
  if ((existing ?? []).length > 0) {
    revalidateWorkflow(projectId);
    redirect(`/dashboard/projects/${projectId}`);
  }

  const { data: brief, error: briefError } = await supabase
    .from("seo_briefs")
    .select("primary_keyword, suggested_headings, questions_to_answer")
    .eq("project_id", projectId)
    .eq("opportunity_id", opportunityId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (briefError) fail(projectId, `Could not load the SEO brief: ${briefError.message}`);
  if (!brief) fail(projectId, "Generate the SEO brief before creating an outline.");

  const context = await buildContext(supabase, project, opportunity);
  const briefContext = `\nSEO brief keyword: ${brief.primary_keyword}. Suggested headings: ${(brief.suggested_headings as string[] | null)?.join(", ") ?? "none"}. Questions: ${(brief.questions_to_answer as string[] | null)?.join(", ") ?? "none"}.`;

  let result: ArticleOutlineResult;
  try {
    result = await getAIProvider().generateOutline({
      ...context,
      opportunityDescription: `${context.opportunityDescription}${briefContext}`,
    });
  } catch (error) {
    console.error("[generateOutline] AI generation failed", error);
    fail(projectId, messageFrom(error, "We couldn't generate the article outline right now. Try again."));
  }

  // article_outlines.title is NOT NULL in the database schema. The previous
  // action omitted it, so the outline step could never be saved.
  const { error: insertError } = await supabase.from("article_outlines").insert({
    project_id: projectId,
    opportunity_id: opportunityId,
    title: result.title,
    h1: result.h1,
    sections: result.sections,
  });

  if (insertError) {
    console.error("[generateOutline] database insert failed", insertError);
    fail(projectId, `Could not save the article outline: ${insertError.message}`);
  }

  revalidateWorkflow(projectId);
  revalidatePath(`/dashboard/projects/${projectId}/editor`);
  revalidatePath("/dashboard/content");
  redirect(`/dashboard/projects/${projectId}`);
}

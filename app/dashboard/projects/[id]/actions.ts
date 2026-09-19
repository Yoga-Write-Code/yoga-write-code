"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { invokeBedrock } from "@/lib/ai/bedrock";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function analyzeWebsite(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const supabase = await createSupabaseServerClient();

  console.log("[Analyze] Starting analysis for project:", projectId);

  try {
    // Get project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      console.error("[Analyze] Project not found:", projectId);
      redirect("/dashboard?error=" + encodeURIComponent("Project not found."));
    }

    const url = project.website_url;
    console.log("[Analyze] Analyzing URL:", url);

    // Call AI with clear instructions
    const prompt = `You are an expert content strategist. Analyze this website: ${url}

Return ONLY valid JSON in this exact format (no markdown, no explanations):
{
  "company_summary": "Brief description",
  "product_category": "Category",
  "target_audience": "Who they serve",
  "positioning": "How they differentiate",
  "content_opportunities": [
    {
      "title": "Specific topic title",
      "description": "What this covers",
      "reason": "Why this matters",
      "opportunity_score": 85,
      "search_intent": "informational",
      "funnel_stage": "top",
      "difficulty": "medium"
    }
  ]
}

Generate exactly 3 specific content opportunities.`;

    const result = await invokeBedrock(prompt, 3000);
    console.log("[Analyze] AI response received, length:", result.length);

    // Parse JSON - handle markdown formatting
    let parsed: unknown;
    try {
      const cleanResult = result
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .replace(/^\s*[\r\n]/gm, "")
        .trim();

      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON object found in response");
      }

      parsed = JSON.parse(jsonMatch[0]);
      console.log("[Analyze] JSON parsed successfully");
    } catch (parseError) {
      console.error("[Analyze] JSON parse error:", parseError);
      console.error("[Analyze] Raw response:", result.substring(0, 1000));
      redirect(
        `/dashboard/projects/${projectId}?error=` +
          encodeURIComponent("AI returned invalid JSON. Try again.")
      );
    }

    // Type guard for parsed data
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("content_opportunities" in parsed) ||
      !Array.isArray((parsed as Record<string, unknown>).content_opportunities)
    ) {
      console.error("[Analyze] Invalid parsed data structure:", parsed);
      redirect(
        `/dashboard/projects/${projectId}?error=` +
          encodeURIComponent("AI didn't generate opportunities. Try again.")
      );
    }

    const typedParsed = parsed as Record<string, unknown>;
    const opportunities = typedParsed.content_opportunities as Array<Record<string, unknown>>;

    console.log("[Analyze] Found", opportunities.length, "opportunities");

    // 1. Save analysis
    const { data: analysis, error: analysisError } = await supabase
      .from("website_analyses")
      .insert({
        project_id: projectId,
        company_summary: String(typedParsed.company_summary ?? ""),
        product_category: String(typedParsed.product_category ?? ""),
        target_audience: String(typedParsed.target_audience ?? ""),
        positioning: String(typedParsed.positioning ?? ""),
      })
      .select("id")
      .single();

    if (analysisError) {
      console.error("[Analyze] Failed to save analysis:", analysisError);
      redirect(
        `/dashboard/projects/${projectId}?error=` +
          encodeURIComponent("Failed to save analysis: " + analysisError.message)
      );
    }

    console.log("[Analyze] Analysis saved with ID:", analysis.id);

    // 2. Save opportunities
    const opportunitiesData = opportunities.map((opp: Record<string, unknown>, index: number) => ({
      project_id: projectId,
      analysis_id: analysis.id,
      title: String(opp.title ?? `Opportunity ${index + 1}`),
      description: String(opp.description ?? ""),
      reason: String(opp.reason ?? ""),
      opportunity_score: Number(opp.opportunity_score) || 50,
      search_intent: String(opp.search_intent ?? "informational"),
      funnel_stage: String(opp.funnel_stage ?? "top"),
      difficulty: String(opp.difficulty ?? "medium"),
    }));

    console.log(
      "[Analyze] Inserting opportunities:",
      opportunitiesData.map((o) => o.title)
    );

    const { error: oppError, data: savedData } = await supabase
      .from("content_opportunities")
      .insert(opportunitiesData)
      .select();

    if (oppError) {
      console.error("[Analyze] Failed to save opportunities:", oppError);
      redirect(
        `/dashboard/projects/${projectId}?error=` +
          encodeURIComponent("Failed to save opportunities: " + oppError.message)
      );
    }

    console.log("[Analyze] Successfully saved", savedData?.length ?? 0, "opportunities");

    // Revalidate the page to refresh data
    revalidatePath(`/dashboard/projects/${projectId}`);
    
    // Redirect with timestamp to force fresh load
    redirect(`/dashboard/projects/${projectId}?refresh=${Date.now()}`);
    
  } catch (error) {
    console.error("[Analyze] CRITICAL ERROR:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent(message));
  }
}

export async function generateCluster(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    const { data: opportunity, error: oppError } = await supabase
      .from("content_opportunities")
      .select("title, description")
      .eq("id", opportunityId)
      .single();

    if (oppError || !opportunity) {
      redirect("/dashboard?error=" + encodeURIComponent("Opportunity not found."));
    }

    const prompt = `Create a topic cluster for: ${opportunity.title}

Return ONLY JSON:
{
  "pillar_topic": "Main topic",
  "supporting_topics": ["Topic 1", "Topic 2", "Topic 3"],
  "internal_linking_suggestions": ["Suggestion 1", "Suggestion 2"]
}`;

    const result = await invokeBedrock(prompt, 2048);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : result) as Record<string, unknown>;

    await supabase.from("topic_clusters").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      pillar_topic: String(parsed.pillar_topic ?? ""),
      supporting_topics: Array.isArray(parsed.supporting_topics)
        ? parsed.supporting_topics
        : [],
      internal_linking_suggestions: Array.isArray(parsed.internal_linking_suggestions)
        ? parsed.internal_linking_suggestions
        : [],
    });

    revalidatePath(`/dashboard/projects/${projectId}`);
    redirect(`/dashboard/projects/${projectId}?refresh=${Date.now()}`);
  } catch (error) {
    console.error("[Generate Cluster Error]", error);
    redirect(
      `/dashboard/projects/${projectId}?error=` +
        encodeURIComponent("Cluster generation failed.")
    );
  }
}

export async function generateBrief(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    const { data: opportunity, error: oppError } = await supabase
      .from("content_opportunities")
      .select("title, description")
      .eq("id", opportunityId)
      .single();

    if (oppError || !opportunity) {
      redirect("/dashboard?error=" + encodeURIComponent("Opportunity not found."));
    }

    const prompt = `Create an SEO brief for: ${opportunity.title}

Return ONLY JSON:
{
  "primary_keyword": "main keyword",
  "search_intent": "What searcher wants",
  "target_audience": "Who should read this",
  "suggested_headings": ["H2 1", "H2 2", "H2 3"],
  "questions_to_answer": ["Question 1", "Question 2"],
  "entities_to_mention": ["Entity 1", "Entity 2"],
  "competitor_insights": "How to differentiate"
}`;

    const result = await invokeBedrock(prompt, 2048);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : result) as Record<string, unknown>;

    await supabase.from("seo_briefs").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      primary_keyword: String(parsed.primary_keyword ?? ""),
      search_intent: String(parsed.search_intent ?? ""),
      target_audience: String(parsed.target_audience ?? ""),
      suggested_headings: Array.isArray(parsed.suggested_headings)
        ? parsed.suggested_headings
        : [],
      questions_to_answer: Array.isArray(parsed.questions_to_answer)
        ? parsed.questions_to_answer
        : [],
      entities_to_mention: Array.isArray(parsed.entities_to_mention)
        ? parsed.entities_to_mention
        : [],
      competitor_insights: String(parsed.competitor_insights ?? ""),
    });

    revalidatePath(`/dashboard/projects/${projectId}`);
    redirect(`/dashboard/projects/${projectId}?refresh=${Date.now()}`);
  } catch (error) {
    console.error("[Generate Brief Error]", error);
    redirect(
      `/dashboard/projects/${projectId}?error=` +
        encodeURIComponent("Brief generation failed.")
    );
  }
}

export async function generateOutline(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    const { data: brief } = await supabase
      .from("seo_briefs")
      .select("primary_keyword, suggested_headings, questions_to_answer")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const prompt = `Create an editorial outline.

Keyword: ${brief?.primary_keyword ?? "topic"}
Headings: ${Array.isArray(brief?.suggested_headings) ? brief.suggested_headings.join(", ") : "none"}
Questions: ${Array.isArray(brief?.questions_to_answer) ? brief.questions_to_answer.join(", ") : "none"}

Return ONLY JSON:
{
  "h1": "Article title",
  "sections": [
    {
      "heading": "H2 heading",
      "purpose": "What this section does",
      "points": ["Point 1", "Point 2"]
    }
  ]
}`;

    const result = await invokeBedrock(prompt, 2048);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : result) as Record<string, unknown>;

    await supabase.from("article_outlines").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      h1: String(parsed.h1 ?? ""),
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
    });

    revalidatePath(`/dashboard/projects/${projectId}`);
    redirect(`/dashboard/projects/${projectId}?refresh=${Date.now()}`);
  } catch (error) {
    console.error("[Generate Outline Error]", error);
    redirect(
      `/dashboard/projects/${projectId}?error=` +
        encodeURIComponent("Outline generation failed.")
    );
  }
}
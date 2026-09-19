"use server";

import { redirect } from "next/navigation";
import { invokeBedrock } from "@/lib/ai/bedrock";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function analyzeWebsite(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      throw new Error("Project not found");
    }

    const url = project.website_url;

    const prompt = `You are an expert content strategist. Analyze this website: ${url}

Return ONLY valid JSON in this exact format:
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

    let parsed: unknown;
    try {
      const cleanResult = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON object found");
      }
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("AI returned invalid JSON");
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("content_opportunities" in parsed) ||
      !Array.isArray((parsed as Record<string, unknown>).content_opportunities)
    ) {
      throw new Error("AI didn't generate opportunities");
    }

    const typedParsed = parsed as Record<string, unknown>;
    const opportunities = typedParsed.content_opportunities as Array<Record<string, unknown>>;

    // Save analysis
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
      throw new Error("Failed to save analysis");
    }

    // Save opportunities
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

    const { error: oppError } = await supabase
      .from("content_opportunities")
      .insert(opportunitiesData);

    if (oppError) {
      throw new Error("Failed to save opportunities");
    }

    // Simple redirect - NO revalidatePath
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    redirect(`/dashboard/projects/${projectId}?error=${encodeURIComponent(message)}`);
  }

  // Redirect to same page to trigger refresh
  redirect(`/dashboard/projects/${projectId}`);
}

export async function generateCluster(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    if (!opportunityId) {
      throw new Error("Opportunity ID is required");
    }

    const { data: opportunity, error: oppError } = await supabase
      .from("content_opportunities")
      .select("title, description")
      .eq("id", opportunityId)
      .single();

    if (oppError || !opportunity) {
      throw new Error("Opportunity not found");
    }

    const prompt = `Create a topic cluster for: ${opportunity.title}

Return ONLY JSON:
{
  "pillar_topic": "Main comprehensive topic",
  "supporting_topics": ["Topic 1", "Topic 2", "Topic 3"],
  "internal_linking_suggestions": ["Suggestion 1", "Suggestion 2"]
}`;

    const result = await invokeBedrock(prompt, 2048);

    let parsed: unknown;
    try {
      const cleanResult = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleanResult);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("AI returned invalid JSON");
    }

    const typedParsed = parsed as Record<string, unknown>;

    await supabase.from("topic_clusters").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      pillar_topic: String(typedParsed.pillar_topic ?? ""),
      supporting_topics: Array.isArray(typedParsed.supporting_topics)
        ? typedParsed.supporting_topics
        : [],
      internal_linking_suggestions: Array.isArray(typedParsed.internal_linking_suggestions)
        ? typedParsed.internal_linking_suggestions
        : [],
    });

    // Simple redirect - NO revalidatePath
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cluster generation failed";
    redirect(`/dashboard/projects/${projectId}?error=${encodeURIComponent(message)}`);
  }

  redirect(`/dashboard/projects/${projectId}`);
}

export async function generateBrief(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    if (!opportunityId) {
      throw new Error("Opportunity ID is required");
    }

    const { data: opportunity, error: oppError } = await supabase
      .from("content_opportunities")
      .select("title, description")
      .eq("id", opportunityId)
      .single();

    if (oppError || !opportunity) {
      throw new Error("Opportunity not found");
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

    let parsed: unknown;
    try {
      const cleanResult = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleanResult);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("AI returned invalid JSON");
    }

    const typedParsed = parsed as Record<string, unknown>;

    await supabase.from("seo_briefs").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      primary_keyword: String(typedParsed.primary_keyword ?? ""),
      search_intent: String(typedParsed.search_intent ?? ""),
      target_audience: String(typedParsed.target_audience ?? ""),
      suggested_headings: Array.isArray(typedParsed.suggested_headings)
        ? typedParsed.suggested_headings
        : [],
      questions_to_answer: Array.isArray(typedParsed.questions_to_answer)
        ? typedParsed.questions_to_answer
        : [],
      entities_to_mention: Array.isArray(typedParsed.entities_to_mention)
        ? typedParsed.entities_to_mention
        : [],
      competitor_insights: String(typedParsed.competitor_insights ?? ""),
    });

    // Simple redirect - NO revalidatePath
  } catch (error) {
    const message = error instanceof Error ? error.message : "Brief generation failed";
    redirect(`/dashboard/projects/${projectId}?error=${encodeURIComponent(message)}`);
  }

  redirect(`/dashboard/projects/${projectId}`);
}

export async function generateOutline(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    if (!opportunityId) {
      throw new Error("Opportunity ID is required");
    }

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

    let parsed: unknown;
    try {
      const cleanResult = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleanResult);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("AI returned invalid JSON");
    }

    const typedParsed = parsed as Record<string, unknown>;

    await supabase.from("article_outlines").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      h1: String(typedParsed.h1 ?? ""),
      sections: Array.isArray(typedParsed.sections) ? typedParsed.sections : [],
    });

    // Simple redirect - NO revalidatePath
  } catch (error) {
    const message = error instanceof Error ? error.message : "Outline generation failed";
    redirect(`/dashboard/projects/${projectId}?error=${encodeURIComponent(message)}`);
  }

  redirect(`/dashboard/projects/${projectId}`);
}
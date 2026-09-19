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
      throw new Error("Invalid JSON from AI");
    }

    const data = parsed as Record<string, unknown>;
    const opportunities = Array.isArray(data.content_opportunities) ? data.content_opportunities : [];

    if (opportunities.length === 0) {
      throw new Error("No opportunities generated");
    }

    const { data: analysis, error: analysisError } = await supabase
      .from("website_analyses")
      .insert({
        project_id: projectId,
        company_summary: String(data.company_summary ?? ""),
        product_category: String(data.product_category ?? ""),
        target_audience: String(data.target_audience ?? ""),
        positioning: String(data.positioning ?? ""),
      })
      .select("id")
      .single();

    if (analysisError) {
      console.error("Analysis error:", analysisError);
      throw new Error("Failed to save analysis");
    }

    const oppsToInsert = opportunities.map((opp: Record<string, unknown>, i: number) => ({
      project_id: projectId,
      analysis_id: analysis.id,
      title: String(opp.title ?? `Opportunity ${i + 1}`),
      description: String(opp.description ?? ""),
      reason: String(opp.reason ?? ""),
      opportunity_score: Number(opp.opportunity_score) || 50,
      search_intent: String(opp.search_intent ?? "informational"),
      funnel_stage: String(opp.funnel_stage ?? "top"),
      difficulty: String(opp.difficulty ?? "medium"),
    }));

    const { error: oppError } = await supabase
      .from("content_opportunities")
      .insert(oppsToInsert);

    if (oppError) {
      console.error("Opportunities error:", oppError);
      throw new Error("Failed to save opportunities");
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    redirect(`/dashboard/projects/${projectId}?error=${encodeURIComponent(message)}`);
  }

  redirect(`/dashboard/projects/${projectId}`);
}

export async function generateCluster(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    if (!opportunityId) throw new Error("No opportunity ID");

    const { data: opp } = await supabase
      .from("content_opportunities")
      .select("title")
      .eq("id", opportunityId)
      .single();

    if (!opp) throw new Error("Opportunity not found");

    const prompt = `Create topic cluster for: ${opp.title}

Return ONLY JSON:
{
  "pillar_topic": "Main topic",
  "supporting_topics": ["Topic 1", "Topic 2", "Topic 3"],
  "internal_linking_suggestions": ["Link 1", "Link 2"]
}`;

    const result = await invokeBedrock(prompt, 2048);
    let parsed: unknown;
    try {
      const cleanResult = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleanResult);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Invalid JSON from AI");
    }

    const data = parsed as Record<string, unknown>;

    await supabase.from("topic_clusters").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      pillar_topic: String(data.pillar_topic ?? ""),
      supporting_topics: Array.isArray(data.supporting_topics) ? data.supporting_topics : [],
      internal_linking_suggestions: Array.isArray(data.internal_linking_suggestions)
        ? data.internal_linking_suggestions
        : [],
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Cluster failed";
    redirect(`/dashboard/projects/${projectId}?error=${encodeURIComponent(message)}`);
  }

  redirect(`/dashboard/projects/${projectId}`);
}

export async function generateBrief(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    if (!opportunityId) throw new Error("No opportunity ID");

    const { data: opp } = await supabase
      .from("content_opportunities")
      .select("title")
      .eq("id", opportunityId)
      .single();

    if (!opp) throw new Error("Opportunity not found");

    const prompt = `Create SEO brief for: ${opp.title}

Return ONLY JSON:
{
  "primary_keyword": "keyword",
  "search_intent": "intent",
  "target_audience": "audience",
  "suggested_headings": ["H1", "H2"],
  "questions_to_answer": ["Q1", "Q2"],
  "entities_to_mention": ["E1", "E2"],
  "competitor_insights": "insights"
}`;

    const result = await invokeBedrock(prompt, 2048);
    let parsed: unknown;
    try {
      const cleanResult = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleanResult);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Invalid JSON");
    }

    const data = parsed as Record<string, unknown>;

    await supabase.from("seo_briefs").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      primary_keyword: String(data.primary_keyword ?? ""),
      search_intent: String(data.search_intent ?? ""),
      target_audience: String(data.target_audience ?? ""),
      suggested_headings: Array.isArray(data.suggested_headings) ? data.suggested_headings : [],
      questions_to_answer: Array.isArray(data.questions_to_answer) ? data.questions_to_answer : [],
      entities_to_mention: Array.isArray(data.entities_to_mention) ? data.entities_to_mention : [],
      competitor_insights: String(data.competitor_insights ?? ""),
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Brief failed";
    redirect(`/dashboard/projects/${projectId}?error=${encodeURIComponent(message)}`);
  }

  redirect(`/dashboard/projects/${projectId}`);
}

export async function generateOutline(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    if (!opportunityId) throw new Error("No opportunity ID");

    const { data: brief } = await supabase
      .from("seo_briefs")
      .select("primary_keyword, suggested_headings, questions_to_answer")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const prompt = `Create outline.

Keyword: ${brief?.primary_keyword ?? "topic"}
Headings: ${Array.isArray(brief?.suggested_headings) ? brief.suggested_headings.join(", ") : "none"}

Return ONLY JSON:
{
  "h1": "Title",
  "sections": [
    {
      "heading": "H2",
      "purpose": "Purpose",
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
      throw new Error("Invalid JSON");
    }

    const data = parsed as Record<string, unknown>;

    await supabase.from("article_outlines").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      h1: String(data.h1 ?? ""),
      sections: Array.isArray(data.sections) ? data.sections : [],
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Outline failed";
    redirect(`/dashboard/projects/${projectId}?error=${encodeURIComponent(message)}`);
  }

  redirect(`/dashboard/projects/${projectId}`);
}
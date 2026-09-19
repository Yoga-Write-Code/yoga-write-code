"use server";

import { redirect } from "next/navigation";
import { invokeBedrock } from "@/lib/ai/bedrock";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function analyzeWebsite(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    const { data: project } = await supabase.from("projects").select("*").eq("id", projectId).single();
    if (!project) throw new Error("Project not found");

    const prompt = `Analyze: ${project.website_url}. Return JSON with company_summary, product_category, target_audience, positioning, and content_opportunities array with 3 items.`;
    const result = await invokeBedrock(prompt, 3000);
    
    let parsed: unknown;
    try {
      const cleanResult = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleanResult);
    } catch (e) {
      throw new Error("Invalid JSON from AI");
    }

    const data = parsed as Record<string, unknown>;
    const opportunities = Array.isArray(data.content_opportunities) ? data.content_opportunities : [];

    const { data: analysis, error: analysisError } = await supabase.from("website_analyses").insert({
      project_id: projectId,
      company_summary: String(data.company_summary ?? ""),
      product_category: String(data.product_category ?? ""),
      target_audience: String(data.target_audience ?? ""),
      positioning: String(data.positioning ?? ""),
    }).select("id").single();

    if (analysisError || !analysis) {
      console.error("Failed to save analysis:", analysisError);
      throw new Error("Failed to save analysis");
    }

    await supabase.from("content_opportunities").insert(
      opportunities.map((opp: Record<string, unknown>, i: number) => ({
        project_id: projectId,
        analysis_id: analysis.id,
        title: String(opp.title ?? `Opportunity ${i + 1}`),
        description: String(opp.description ?? ""),
        reason: String(opp.reason ?? ""),
        opportunity_score: Number(opp.opportunity_score) || 50,
        search_intent: String(opp.search_intent ?? "informational"),
        funnel_stage: String(opp.funnel_stage ?? "top"),
        difficulty: String(opp.difficulty ?? "medium"),
      }))
    );

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

  console.log("🔍 CLUSTER DEBUG: projectId=", projectId, "opportunityId=", opportunityId);

  try {
    if (!opportunityId) {
      console.error("❌ ERROR: No opportunityId provided!");
      throw new Error("No opportunity ID provided");
    }

    const { data: opp, error: oppError } = await supabase
      .from("content_opportunities")
      .select("title, description")
      .eq("id", opportunityId)
      .single();

    if (oppError || !opp) {
      console.error("❌ ERROR: Could not find opportunity:", oppError);
      throw new Error("Opportunity not found");
    }

    console.log("✅ Found opportunity:", opp.title);

    const prompt = `Create a topic cluster for: "${opp.title}"

Description: ${opp.description || "No description"}

Return ONLY JSON:
{
  "pillar_topic": "Main comprehensive topic that covers everything",
  "supporting_topics": ["Supporting topic 1", "Supporting topic 2", "Supporting topic 3", "Supporting topic 4", "Supporting topic 5"],
  "internal_linking_suggestions": ["Link suggestion 1", "Link suggestion 2"]
}`;

    console.log(" Calling AI...");
    const result = await invokeBedrock(prompt, 2048);
    console.log("📝 AI Response (first 100 chars):", result.substring(0, 100));

    let parsed: unknown;
    try {
      const cleanResult = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleanResult);
      console.log("✅ JSON parsed successfully");
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      console.error("Raw response:", result);
      throw new Error("AI returned invalid JSON");
    }

    const data = parsed as Record<string, unknown>;

    console.log("💾 Saving cluster to database...");
    const { error: insertError } = await supabase.from("topic_clusters").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      pillar_topic: String(data.pillar_topic ?? ""),
      supporting_topics: Array.isArray(data.supporting_topics) ? data.supporting_topics : [],
      internal_linking_suggestions: Array.isArray(data.internal_linking_suggestions)
        ? data.internal_linking_suggestions
        : [],
    });

    if (insertError) {
      console.error("❌ Database insert error:", insertError);
      throw new Error("Failed to save cluster: " + insertError.message);
    }

    console.log("✅ Cluster saved successfully!");

  } catch (error) {
    const message = error instanceof Error ? error.message : "Cluster generation failed";
    console.error("💥 CLUSTER ERROR:", message);
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
    const { data: opp } = await supabase.from("content_opportunities").select("title").eq("id", opportunityId).single();
    if (!opp) throw new Error("Opportunity not found");

    const prompt = `Create SEO brief for: ${opp.title}. Return JSON with primary_keyword, search_intent, target_audience, suggested_headings (array), questions_to_answer (array), entities_to_mention (array), competitor_insights.`;
    const result = await invokeBedrock(prompt, 2048);
    let parsed: unknown;
    try {
      const cleanResult = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleanResult);
    } catch (e) {
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
    const { data: brief } = await supabase.from("seo_briefs").select("*").eq("project_id", projectId).order("created_at", { ascending: false }).limit(1).maybeSingle();

    const prompt = `Create outline for: ${brief?.primary_keyword || "topic"}. Return JSON with h1 and sections array (each with heading, purpose, points array).`;
    const result = await invokeBedrock(prompt, 2048);
    let parsed: unknown;
    try {
      const cleanResult = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleanResult);
    } catch (e) {
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
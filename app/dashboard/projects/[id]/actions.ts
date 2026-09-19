"use server";

import { redirect } from "next/navigation";
import { invokeBedrock } from "@/lib/ai/bedrock";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function analyzeWebsite(formData: FormData) {
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
    let parsed;
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

    // Validate response structure
    if (!parsed.content_opportunities || !Array.isArray(parsed.content_opportunities)) {
      console.error("[Analyze] No content_opportunities in response:", parsed);
      redirect(
        `/dashboard/projects/${projectId}?error=` +
          encodeURIComponent("AI didn't generate opportunities. Try again.")
      );
    }

    console.log(
      "[Analyze] Found",
      parsed.content_opportunities.length,
      "opportunities"
    );

    // 1. Save analysis
    const { data: analysis, error: analysisError } = await supabase
      .from("website_analyses")
      .insert({
        project_id: projectId,
        company_summary: parsed.company_summary || "",
        product_category: parsed.product_category || "",
        target_audience: parsed.target_audience || "",
        positioning: parsed.positioning || "",
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
    const opportunities = parsed.content_opportunities.map((opp: any, index: number) => ({
      project_id: projectId,
      analysis_id: analysis.id,
      title: opp.title || `Opportunity ${index + 1}`,
      description: opp.description || "",
      reason: opp.reason || "",
      opportunity_score: Number(opp.opportunity_score) || 50,
      search_intent: opp.search_intent || "informational",
      funnel_stage: opp.funnel_stage || "top",
      difficulty: opp.difficulty || "medium",
    }));

    console.log("[Analyze] Inserting opportunities:", opportunities.map((o) => o.title));

    const { error: oppError, data: savedData } = await supabase
      .from("content_opportunities")
      .insert(opportunities)
      .select();

    if (oppError) {
      console.error("[Analyze] Failed to save opportunities:", oppError);
      redirect(
        `/dashboard/projects/${projectId}?error=` +
          encodeURIComponent("Failed to save opportunities: " + oppError.message)
      );
    }

    console.log("[Analyze] Successfully saved", savedData?.length || 0, "opportunities");

    redirect(`/dashboard/projects/${projectId}`);
  } catch (error) {
    console.error("[Analyze] CRITICAL ERROR:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    redirect(
      `/dashboard/projects/${projectId}?error=` + encodeURIComponent(message)
    );
  }
}

export async function generateCluster(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    const { data: opportunity } = await supabase
      .from("content_opportunities")
      .select("title, description")
      .eq("id", opportunityId)
      .single();

    if (!opportunity) {
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
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : result);

    await supabase.from("topic_clusters").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      pillar_topic: parsed.pillar_topic || "",
      supporting_topics: parsed.supporting_topics || [],
      internal_linking_suggestions: parsed.internal_linking_suggestions || [],
    });

    redirect(`/dashboard/projects/${projectId}`);
  } catch (error) {
    console.error("[Generate Cluster Error]", error);
    redirect(
      `/dashboard/projects/${projectId}?error=` +
        encodeURIComponent("Cluster generation failed.")
    );
  }
}

export async function generateBrief(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    const { data: opportunity } = await supabase
      .from("content_opportunities")
      .select("title, description")
      .eq("id", opportunityId)
      .single();

    if (!opportunity) {
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
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : result);

    await supabase.from("seo_briefs").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      primary_keyword: parsed.primary_keyword || "",
      search_intent: parsed.search_intent || "",
      target_audience: parsed.target_audience || "",
      suggested_headings: parsed.suggested_headings || [],
      questions_to_answer: parsed.questions_to_answer || [],
      entities_to_mention: parsed.entities_to_mention || [],
      competitor_insights: parsed.competitor_insights || "",
    });

    redirect(`/dashboard/projects/${projectId}`);
  } catch (error) {
    console.error("[Generate Brief Error]", error);
    redirect(
      `/dashboard/projects/${projectId}?error=` +
        encodeURIComponent("Brief generation failed.")
    );
  }
}

export async function generateOutline(formData: FormData) {
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
Headings: ${brief?.suggested_headings?.join(", ") ?? "none"}
Questions: ${brief?.questions_to_answer?.join(", ") ?? "none"}

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
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : result);

    await supabase.from("article_outlines").insert({
      project_id: projectId,
      opportunity_id: opportunityId,
      h1: parsed.h1 || "",
      sections: parsed.sections || [],
    });

    redirect(`/dashboard/projects/${projectId}`);
  } catch (error) {
    console.error("[Generate Outline Error]", error);
    redirect(
      `/dashboard/projects/${projectId}?error=` +
        encodeURIComponent("Outline generation failed.")
    );
  }
}
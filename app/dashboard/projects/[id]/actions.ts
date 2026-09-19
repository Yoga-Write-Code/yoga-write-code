"use server";

import { redirect } from "next/navigation";
import { invokeBedrock } from "@/lib/ai/bedrock";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function analyzeWebsite(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const supabase = await createSupabaseServerClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();
    
  if (!project) {
    redirect("/dashboard?error=" + encodeURIComponent("Project not found."));
  }

  const url = project.website_url;

  const prompt = `You are an expert SaaS content strategist. Analyze this website and provide insights.

Website URL: ${url}

Provide your analysis in this EXACT JSON format (no markdown, no code blocks, just pure JSON):
{
  "company_summary": "Brief description of what this company does",
  "product_category": "Their product category",
  "target_audience": "Who they serve",
  "positioning": "How they differentiate",
  "content_opportunities": [
    {
      "title": "Content topic title",
      "description": "What this covers",
      "reason": "Why this matters",
      "opportunity_score": 85,
      "search_intent": "informational",
      "funnel_stage": "top",
      "difficulty": "medium"
    }
  ]
}

Generate exactly 3 to 5 real, specific content opportunities based on their actual business. Return ONLY the JSON object, nothing else.`;

  try {
    console.log("[Analyze] Starting analysis for project:", projectId);
    const result = await invokeBedrock(prompt, 3000);
    console.log("[Analyze] AI Response (first 500 chars):", result.substring(0, 500));
    
    let parsed;
    try {
      // Remove markdown code blocks if the AI adds them
      const cleanResult = result
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/\n/g, " ")
        .trim();
      
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(cleanResult);
      }
      
      console.log("[Analyze] Parsed JSON:", JSON.stringify(parsed, null, 2));
    } catch (parseError) {
      console.error("[Analyze] JSON Parse Error:", parseError);
      console.error("[Analyze] Raw AI response:", result);
      redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent("AI returned invalid JSON. Please try again."));
    }

    // 1. Insert analysis
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
      console.error("[Analyze] Analysis Insert Error:", analysisError);
      redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent("Failed to save analysis."));
    }

    console.log("[Analyze] Analysis saved with ID:", analysis.id);

    // 2. Insert opportunities
    if (!parsed.content_opportunities || !Array.isArray(parsed.content_opportunities)) {
      console.error("[Analyze] No content_opportunities in AI response:", parsed);
      redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent("AI did not return content opportunities. Please try again."));
    }

    console.log("[Analyze] Found", parsed.content_opportunities.length, "opportunities");

    const opportunities = parsed.content_opportunities.map((opp: any) => ({
      project_id: projectId,
      analysis_id: analysis.id,
      title: opp.title || "Untitled Opportunity",
      description: opp.description || "",
      reason: opp.reason || "",
      opportunity_score: Number(opp.opportunity_score) || 50,
      search_intent: opp.search_intent || "informational",
      funnel_stage: opp.funnel_stage || "top",
      difficulty: opp.difficulty || "medium",
    }));

    console.log("[Analyze] Inserting opportunities:", opportunities);

    const { error: oppError, data: oppData } = await supabase
      .from("content_opportunities")
      .insert(opportunities)
      .select();

    if (oppError) {
      console.error("[Analyze] Opportunities Insert Error:", oppError);
      redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent("Failed to save opportunities: " + oppError.message));
    }

    console.log("[Analyze] Successfully saved", oppData?.length || 0, "opportunities");

  } catch (error) {
    console.error("[Analyze] General Error:", error);
    const message = error instanceof Error ? error.message : "Analysis failed. Try again.";
    redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent(message));
  }

  redirect(`/dashboard/projects/${projectId}`);
}

export async function generateCluster(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  const { data: opportunity } = await supabase
    .from("content_opportunities")
    .select("title, description")
    .eq("id", opportunityId)
    .single();

  if (!opportunity) {
    redirect("/dashboard?error=" + encodeURIComponent("Opportunity not found."));
  }

  const prompt = `Create a topic cluster for: ${opportunity.title}

Return JSON:
{
  "pillar_topic": "Main comprehensive topic",
  "supporting_topics": ["Topic 1", "Topic 2", "Topic 3"],
  "internal_linking_suggestions": ["Suggestion 1", "Suggestion 2"]
}`;

  try {
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
    redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent("Cluster generation failed."));
  }
}

export async function generateBrief(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

  const { data: opportunity } = await supabase
    .from("content_opportunities")
    .select("title, description")
    .eq("id", opportunityId)
    .single();

  if (!opportunity) {
    redirect("/dashboard?error=" + encodeURIComponent("Opportunity not found."));
  }

  const prompt = `Create an SEO brief for: ${opportunity.title}

Return JSON:
{
  "primary_keyword": "main keyword",
  "search_intent": "What searcher wants",
  "target_audience": "Who should read this",
  "suggested_headings": ["H2 1", "H2 2", "H2 3"],
  "questions_to_answer": ["Question 1", "Question 2"],
  "entities_to_mention": ["Entity 1", "Entity 2"],
  "competitor_insights": "How to differentiate"
}`;

  try {
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
    redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent("Brief generation failed."));
  }
}

export async function generateOutline(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const supabase = await createSupabaseServerClient();

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

Return JSON:
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

  try {
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
    redirect(`/dashboard/projects/${projectId}?error=` + encodeURIComponent("Outline generation failed."));
  }
}
"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// THIS IS A TEST FUNCTION TO CHECK IF DATABASE SAVING WORKS
export async function analyzeWebsite(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  const supabase = await createSupabaseServerClient();

  console.log(" TEST: Starting database save test for project:", projectId);

  try {
    // 1. Try to save a fake analysis
    const { data: analysis, error: analysisError } = await supabase
      .from("website_analyses")
      .insert({
        project_id: projectId,
        company_summary: "TEST: This is a fake summary to test the database.",
        product_category: "TEST CATEGORY",
        target_audience: "TEST AUDIENCE",
        positioning: "TEST POSITIONING",
      })
      .select("id")
      .single();

    if (analysisError) {
      console.error("❌ TEST FAILED: Could not save to website_analyses:", analysisError);
      throw new Error("Database save failed: " + analysisError.message);
    }

    console.log("✅ TEST SUCCESS: Saved fake analysis with ID:", analysis.id);

    // 2. Try to save a fake opportunity linked to that analysis
    const { error: oppError } = await supabase
      .from("content_opportunities")
      .insert({
        project_id: projectId,
        analysis_id: analysis.id,
        title: "TEST: This is a fake opportunity",
        description: "Testing if the database works",
        reason: "We are debugging",
        opportunity_score: 99,
        search_intent: "informational",
        funnel_stage: "top",
        difficulty: "low",
      });

    if (oppError) {
      console.error("❌ TEST FAILED: Could not save to content_opportunities:", oppError);
      throw new Error("Database save failed: " + oppError.message);
    }

    console.log("✅ TEST SUCCESS: Saved fake opportunity!");

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ CRITICAL TEST ERROR:", error);
    redirect(`/dashboard/projects/${projectId}?error=${encodeURIComponent(message)}`);
  }

  // Redirect to refresh the page
  redirect(`/dashboard/projects/${projectId}`);
}

// Keep the other functions empty for now so the build doesn't fail
export async function generateCluster(formData: FormData) { redirect("/dashboard"); }
export async function generateBrief(formData: FormData) { redirect("/dashboard"); }
export async function generateOutline(formData: FormData) { redirect("/dashboard"); }
"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function analyzeWebsite(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  
  console.log("🔍 DEBUG: Received projectId:", projectId);
  console.log("🔍 DEBUG: FormData:", Object.fromEntries(formData));

  if (!projectId) {
    console.error("❌ ERROR: No projectId provided!");
    redirect("/dashboard?error=No project ID provided");
  }

  const supabase = await createSupabaseServerClient();

  try {
    console.log(" DEBUG: Creating Supabase client...");

    // Test 1: Check if project exists
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name")
      .eq("id", projectId)
      .single();

    if (projectError) {
      console.error(" ERROR: Could not find project:", projectError);
      throw new Error("Project not found: " + projectError.message);
    }

    console.log("✅ DEBUG: Found project:", project.name);

    // Test 2: Try to insert fake analysis
    console.log("🔍 DEBUG: Attempting to insert fake analysis...");
    
    const { data: analysis, error: analysisError } = await supabase
      .from("website_analyses")
      .insert({
        project_id: projectId,
        company_summary: " TEST ANALYSIS - If you see this, the database is working!",
        product_category: "TEST CATEGORY",
        target_audience: "TEST AUDIENCE",
        positioning: "TEST POSITIONING",
      })
      .select("id")
      .single();

    if (analysisError) {
      console.error("❌ ERROR: Failed to save analysis:", analysisError);
      throw new Error("Failed to save analysis: " + analysisError.message);
    }

    console.log("✅ SUCCESS: Saved analysis with ID:", analysis.id);

    // Test 3: Try to insert fake opportunity
    console.log(" DEBUG: Attempting to insert fake opportunity...");

    const { error: oppError } = await supabase
      .from("content_opportunities")
      .insert({
        project_id: projectId,
        analysis_id: analysis.id,
        title: " TEST OPPORTUNITY",
        description: "This is a test opportunity to verify database writes work",
        reason: "Debugging the analyze feature",
        opportunity_score: 100,
        search_intent: "informational",
        funnel_stage: "top",
        difficulty: "easy",
      });

    if (oppError) {
      console.error("❌ ERROR: Failed to save opportunity:", oppError);
      throw new Error("Failed to save opportunity: " + oppError.message);
    }

    console.log("✅ SUCCESS: Saved opportunity!");
    console.log("🎉 ALL TESTS PASSED! Database is working correctly.");

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ CRITICAL ERROR:", error);
    
    // Redirect with error message
    redirect(`/dashboard/projects/${projectId}?error=${encodeURIComponent(message)}`);
  }

  // Redirect back to project page
  console.log("🔍 DEBUG: Redirecting to:", `/dashboard/projects/${projectId}`);
  redirect(`/dashboard/projects/${projectId}`);
}

// Placeholder functions
export async function generateCluster(formData: FormData) {
  redirect("/dashboard");
}
export async function generateBrief(formData: FormData) {
  redirect("/dashboard");
}
export async function generateOutline(formData: FormData) {
  redirect("/dashboard");
}
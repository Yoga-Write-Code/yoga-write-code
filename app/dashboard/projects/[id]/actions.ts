"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function analyzeWebsite(formData: FormData): Promise<void> {
  const projectId = String(formData.get("projectId") ?? "");
  
  // 1. LOG EVERYTHING so we can see it in Vercel
  console.log("========================================");
  console.log(" SERVER ACTION STARTED");
  console.log("Project ID received:", projectId);
  console.log("========================================");

  if (!projectId) {
    console.error("❌ ERROR: No projectId found in form data!");
    return; // Stop here, don't redirect yet
  }

  const supabase = await createSupabaseServerClient();

  try {
    console.log("1️⃣ Checking if project exists...");
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name")
      .eq("id", projectId)
      .single();

    if (projectError) {
      console.error("❌ ERROR finding project:", projectError.message);
      throw new Error("Project not found");
    }
    console.log("✅ Project found:", project.name);

    console.log("2️⃣ Saving FAKE analysis to database...");
    const { data: analysis, error: analysisError } = await supabase
      .from("website_analyses")
      .insert({
        project_id: projectId,
        company_summary: "🧪 TEST SUCCESS! If you see this in Supabase, the database is working perfectly.",
        product_category: "TEST",
        target_audience: "TEST",
        positioning: "TEST",
      })
      .select("id")
      .single();

    if (analysisError) {
      console.error("❌ ERROR saving analysis:", analysisError.message);
      throw new Error("Database insert failed: " + analysisError.message);
    }
    console.log("✅ Analysis saved! ID:", analysis.id);

    console.log("3️⃣ Saving FAKE opportunity to database...");
    const { error: oppError } = await supabase
      .from("content_opportunities")
      .insert({
        project_id: projectId,
        analysis_id: analysis.id,
        title: "🧪 TEST OPPORTUNITY",
        description: "This proves the database is writing correctly.",
        reason: "Debugging",
        opportunity_score: 100,
        search_intent: "informational",
        funnel_stage: "top",
        difficulty: "low",
      });

    if (oppError) {
      console.error("❌ ERROR saving opportunity:", oppError.message);
      throw new Error("Opportunity insert failed: " + oppError.message);
    }
    console.log("✅ Opportunity saved!");

    console.log("🎉 ALL TESTS PASSED. Redirecting...");

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("💥 CRITICAL FAILURE:", message);
    // Redirect with the error in the URL so it shows on screen
    redirect(`/dashboard/projects/${projectId}?error=${encodeURIComponent(message)}`);
  }

  // Redirect back to the project page to refresh it
  redirect(`/dashboard/projects/${projectId}`);
}
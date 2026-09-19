import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { analyzeWebsite } from "./actions";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!project) notFound();

  // Check for opportunities just to see if the test worked
  const { data: opportunities } = await supabase
    .from("content_opportunities")
    .select("title")
    .eq("project_id", id);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>{project.name}</h1>
      <p style={{ color: "gray" }}>{project.website_url}</p>

      {/* SHOW ERROR IF IT EXISTS */}
      {error && (
        <div style={{ 
          background: "#fee2e2", 
          border: "1px solid #ef4444", 
          color: "#991b1b", 
          padding: "16px", 
          borderRadius: "8px", 
          marginTop: "20px" 
        }}>
          <strong>Error:</strong> {decodeURIComponent(error)}
        </div>
      )}

      {/* STEP 1: RAW HTML FORM */}
      <div style={{ marginTop: "40px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Step 1: Test Database</h2>
        <p>Click the button below. It will NOT use AI. It will just try to save fake text to your database.</p>
        
        {/* THIS IS A RAW HTML FORM. NO CUSTOM COMPONENTS. */}
        <form action={analyzeWebsite} style={{ marginTop: "20px" }}>
          <input type="hidden" name="projectId" value={id} />
          <button 
            type="submit" 
            style={{ 
              background: "#000", 
              color: "#fff", 
              padding: "12px 24px", 
              borderRadius: "6px", 
              border: "none", 
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Run Database Test
          </button>
        </form>
      </div>

      {/* SHOW RESULTS IF THEY EXIST */}
      {opportunities && opportunities.length > 0 && (
        <div style={{ marginTop: "40px", background: "#dcfce7", padding: "20px", borderRadius: "8px" }}>
          <h3 style={{ color: "#166534", fontWeight: "bold" }}>✅ SUCCESS!</h3>
          <p>The database is working. You have {opportunities.length} opportunities saved.</p>
          <ul>
            {opportunities.map((opp, i) => (
              <li key={i}>{opp.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
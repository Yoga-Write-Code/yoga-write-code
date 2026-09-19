import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { decodeEntities } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { analyzeWebsite, generateBrief, generateCluster, generateOutline } from "./actions";

export const metadata: Metadata = { title: "Project" };

const d = decodeEntities;

function Section({ id, step, title, children }: { id: string; step: number; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-24 border-t border-line pt-6">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">Step {step}</p>
      <h2 className="font-display mt-1 text-xl font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 border-b border-line last:border-0">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">{label}</p>
      <p className="mt-1 text-sm leading-6 text-ink-secondary">{d(value)}</p>
    </div>
  );
}

interface ProjectPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!project) notFound();

  // Fetch all data
  const [analysisRes, opportunitiesRes, clusterRes, briefRes, outlineRes] = await Promise.all([
    supabase.from("website_analyses").select("*").eq("project_id", id).limit(1).maybeSingle(),
    supabase.from("content_opportunities").select("*").eq("project_id", id).order("opportunity_score", { ascending: false }),
    supabase.from("topic_clusters").select("*").eq("project_id", id).limit(1).maybeSingle(),
    supabase.from("seo_briefs").select("*").eq("project_id", id).limit(1).maybeSingle(),
    supabase.from("article_outlines").select("*").eq("project_id", id).limit(1).maybeSingle(),
  ]);

  const analysis = analysisRes.data;
  const opportunities = opportunitiesRes.data ?? [];
  const cluster = clusterRes.data;
  const brief = briefRes.data;
  const outline = outlineRes.data;
  const firstOpportunityId = opportunities[0]?.id ?? "";

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-ink">{project.name}</h1>
      <p className="text-sm text-ink-secondary mt-1">{project.website_url}</p>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{decodeURIComponent(error)}</p>
        </div>
      )}

      {/* Progress */}
      <div className="mt-6 flex gap-2">
        <span className={analysis ? "text-green-600" : "text-gray-400"}>
          {analysis ? "✓" : "○"} Analyze
        </span>
        <span className={opportunities.length > 0 ? "text-green-600" : "text-gray-400"}>
          {opportunities.length > 0 ? "✓" : "○"} Opportunities
        </span>
        <span className={cluster ? "text-green-600" : "text-gray-400"}>
          {cluster ? "✓" : "○"} Cluster
        </span>
        <span className={brief ? "text-green-600" : "text-gray-400"}>
          {brief ? "✓" : "○"} Brief
        </span>
        <span className={outline ? "text-green-600" : "text-gray-400"}>
          {outline ? "✓" : "○"} Outline
        </span>
      </div>

      {/* STEP 1 */}
      <Section id="analysis" step={1} title="Website analysis">
        {analysis ? (
          <div className="max-w-2xl">
            <FactRow label="Company summary" value={analysis.company_summary} />
            <FactRow label="Product category" value={analysis.product_category} />
            <FactRow label="Target audience" value={analysis.target_audience} />
            <FactRow label="Positioning" value={analysis.positioning} />
          </div>
        ) : (
          <form action={analyzeWebsite}>
            <input type="hidden" name="projectId" value={id} />
            <button
              type="submit"
              className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-hover"
            >
              Analyze Website
            </button>
          </form>
        )}
      </Section>

      {/* STEP 2 */}
      {analysis && (
        <Section id="opportunities" step={2} title="Content opportunities">
          {opportunities.length > 0 ? (
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="p-4 border border-line rounded-lg bg-surface">
                  <h3 className="font-semibold text-ink">{d(opp.title)}</h3>
                  <p className="text-sm text-ink-secondary mt-1">{d(opp.description)}</p>
                  <p className="text-xs text-ink-muted mt-2">
                    Score: {opp.opportunity_score} • {opp.difficulty} • {opp.search_intent}
                  </p>
                  {!cluster && (
                    <form action={generateCluster} className="mt-3">
                      <input type="hidden" name="projectId" value={id} />
                      <input type="hidden" name="opportunityId" value={opp.id} />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-brand text-white text-sm rounded hover:bg-brand-hover"
                      >
                        Build Cluster
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ink-muted">No opportunities yet. Analyze the website first.</p>
          )}
        </Section>
      )}

      {/* STEP 3 */}
      {cluster && (
        <Section id="cluster" step={3} title="Topic cluster">
          <div className="max-w-2xl">
            <FactRow label="Pillar topic" value={cluster.pillar_topic} />
            <FactRow
              label="Supporting topics"
              value={(cluster.supporting_topics as string[]).join(" • ")}
            />
          </div>
          {!brief && firstOpportunityId && (
            <form action={generateBrief} className="mt-4">
              <input type="hidden" name="projectId" value={id} />
              <input type="hidden" name="opportunityId" value={firstOpportunityId} />
              <button
                type="submit"
                className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-hover"
              >
                Generate SEO Brief
              </button>
            </form>
          )}
        </Section>
      )}

      {/* STEP 4 */}
      {brief && (
        <Section id="brief" step={4} title="SEO brief">
          <div className="max-w-2xl">
            <FactRow label="Primary keyword" value={brief.primary_keyword} />
            <FactRow
              label="Headings"
              value={(brief.suggested_headings as string[]).join(" • ")}
            />
          </div>
          {!outline && firstOpportunityId && (
            <form action={generateOutline} className="mt-4">
              <input type="hidden" name="projectId" value={id} />
              <input type="hidden" name="opportunityId" value={firstOpportunityId} />
              <button
                type="submit"
                className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-hover"
              >
                Generate Outline
              </button>
            </form>
          )}
        </Section>
      )}

      {/* STEP 5 */}
      {outline && (
        <Section id="outline" step={5} title="Article outline">
          <h3 className="text-lg font-semibold text-ink">{d(outline.h1)}</h3>
          <ol className="mt-4 space-y-2">
            {(outline.sections as Array<{ heading: string; points: string[] }>).map((s, i) => (
              <li key={i} className="pl-4 border-l-2 border-line">
                <p className="font-medium">{s.heading}</p>
                {s.points && (
                  <ul className="mt-1 pl-4 list-disc text-sm text-ink-secondary">
                    {s.points.map((p, j) => <li key={j}>{d(p)}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </Section>
      )}
    </div>
  );
}
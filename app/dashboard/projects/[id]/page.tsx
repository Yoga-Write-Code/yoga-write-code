import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { GenerateButton } from "@/components/dashboard/generate-button";
import { PageHeader } from "@/components/page-header";
import { decodeEntities } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { analyzeWebsite, generateBrief, generateCluster, generateOutline } from "./actions";

export const metadata: Metadata = { title: "Project" };

const d = decodeEntities;

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function Section({ id, step, title, children }: { id: string; step: number; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-24 border-t border-line pt-6">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">Step {step}</p>
      <h2 className="font-sans mt-1 text-xl font-semibold tracking-tight text-ink">{title}</h2>
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
    supabase.from("website_analyses").select("*").eq("project_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("content_opportunities").select("*").eq("project_id", id).order("opportunity_score", { ascending: false }),
    supabase.from("topic_clusters").select("*").eq("project_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("seo_briefs").select("*").eq("project_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("article_outlines").select("*").eq("project_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  const analysis = analysisRes.data;
  const opportunities = opportunitiesRes.data ?? [];
  const cluster = clusterRes.data;
  const brief = briefRes.data;
  const outline = outlineRes.data;
  const firstOpportunityId = opportunities[0]?.id ?? "";
  const activeOpportunityId = cluster?.opportunity_id ?? firstOpportunityId;
  const dataError = [
    analysisRes.error,
    opportunitiesRes.error,
    clusterRes.error,
    briefRes.error,
    outlineRes.error,
  ].find(Boolean);

  if (dataError) {
    console.error("[project page] workflow query failed", dataError);
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <PageHeader title={project.name} description={project.website_url} />
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">Error: {safeDecode(error)}</p>
        </div>
      )}

      {dataError && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Some workflow data could not be loaded. Check the database migration and try again.
        </div>
      )}

      {/* Progress Steps */}
      <div className="mt-6 flex flex-wrap gap-2">
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${analysis ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
          {analysis ? "✓" : "○"} 01 Analyze
        </span>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${opportunities.length > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
          {opportunities.length > 0 ? "✓" : "○"} 02 Opportunities
        </span>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${cluster ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
          {cluster ? "✓" : "○"} 03 Cluster
        </span>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${brief ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
          {brief ? "✓" : "○"} 04 Brief
        </span>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${outline ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
          {outline ? "✓" : "○"} 05 Outline
        </span>
      </div>

      {/* STEP 1: Analysis */}
      <Section id="analysis" step={1} title="Website analysis">
        {analysis ? (
          <div className="max-w-2xl">
            <FactRow label="Company summary" value={analysis.company_summary} />
            <FactRow label="Product category" value={analysis.product_category} />
            <FactRow label="Target audience" value={analysis.target_audience} />
            <FactRow label="Positioning" value={analysis.positioning} />
          </div>
        ) : (
          <GenerateButton
            action={analyzeWebsite}
            label="Analyze Website"
            pendingLabel="Analyzing…"
            hiddenFields={{ projectId: id }}
          />
        )}
      </Section>

      {/* STEP 2: Opportunities */}
      {analysis && (
        <Section id="opportunities" step={2} title="Content opportunities">
          {opportunities.length > 0 ? (
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="p-4 border border-line rounded-lg bg-surface">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-ink">{d(opp.title)}</h3>
                      {opp.description && <p className="mt-1 text-sm text-ink-secondary">{d(opp.description)}</p>}
                      <div className="mt-2 flex gap-2 text-xs text-ink-muted">
                        <span>Score: {opp.opportunity_score}</span>
                        <span>•</span>
                        <span>{opp.difficulty}</span>
                        <span>•</span>
                        <span>{opp.search_intent}</span>
                      </div>
                      {opp.reason && <p className="mt-2 text-sm text-ink-secondary"><strong>Why:</strong> {d(opp.reason)}</p>}
                    </div>
                    {!cluster && (
                      <GenerateButton
                        action={generateCluster}
                        label="Build Cluster"
                        pendingLabel="Building…"
                        hiddenFields={{ projectId: id, opportunityId: opp.id }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-line bg-surface-subtle p-8 text-center">
              <p className="text-ink-muted">
                {analysis
                  ? "No opportunities were generated. Re-run the analysis to try again."
                  : "Analyze the website to generate content opportunities."}
              </p>
              {analysis && (
                <div className="mt-4">
                  <GenerateButton
                    action={analyzeWebsite}
                    label="Re-run analysis"
                    pendingLabel="Analyzing…"
                    hiddenFields={{ projectId: id }}
                  />
                </div>
              )}
            </div>
          )}
        </Section>
      )}

      {/* STEP 3: Topic Cluster */}
      {cluster && (
        <Section id="cluster" step={3} title="Topic cluster">
          <div className="max-w-2xl">
            <FactRow label="Pillar topic" value={cluster.pillar_topic} />
            <FactRow label="Supporting topics" value={(cluster.supporting_topics as string[]).join(" • ")} />
          </div>
          {!brief && activeOpportunityId && (
            <div className="mt-4">
              <GenerateButton
                action={generateBrief}
                label="Generate SEO Brief"
                pendingLabel="Generating brief…"
                hiddenFields={{ projectId: id, opportunityId: activeOpportunityId }}
              />
            </div>
          )}
        </Section>
      )}

      {/* STEP 4: SEO Brief */}
      {brief && (
        <Section id="brief" step={4} title="SEO brief">
          <div className="max-w-2xl">
            <FactRow label="Primary keyword" value={brief.primary_keyword} />
            <FactRow label="Suggested headings" value={(brief.suggested_headings as string[]).join(" • ")} />
          </div>
          {!outline && activeOpportunityId && (
            <div className="mt-4">
              <GenerateButton
                action={generateOutline}
                label="Generate Outline"
                pendingLabel="Generating outline…"
                hiddenFields={{ projectId: id, opportunityId: activeOpportunityId }}
              />
            </div>
          )}
        </Section>
      )}

      {/* STEP 5: Outline */}
      {outline && (
        <Section id="outline" step={5} title="Article outline">
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-ink">{d(outline.h1)}</h3>
            <ol className="mt-4 space-y-3">
              {(outline.sections as Array<{ heading: string; points: string[] }>).map((s, i) => (
                <li key={i} className="pl-4 border-l-2 border-line">
                  <p className="font-medium text-ink">{s.heading}</p>
                  {s.points && (
                    <ul className="mt-1 pl-4 list-disc text-sm text-ink-secondary">
                      {s.points.map((p, j) => <li key={j}>{d(p)}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </Section>
      )}
    </div>
  );
}
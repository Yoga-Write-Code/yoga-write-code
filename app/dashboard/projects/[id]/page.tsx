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

interface SectionProps {
  id: string;
  step: number;
  title: string;
  children: ReactNode;
}

function Section({ id, step, title, children }: SectionProps) {
  return (
    <section id={id} className="mt-12 scroll-mt-24 border-t border-line pt-6">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
        Step {step}
      </p>
      <h2 className="font-display mt-1 text-xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

interface FactRowProps {
  label: string;
  value: string;
}

function FactRow({ label, value }: FactRowProps) {
  return (
    <div className="py-3 border-b border-line">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-ink-secondary">{d(value)}</p>
    </div>
  );
}

interface ProjectPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function ProjectPage({
  params,
  searchParams,
}: ProjectPageProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();

  // Get project
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  
  if (!project) notFound();

  // Fetch all data
  const [analysisRes, opportunitiesRes, clusterRes, briefRes, outlineRes] =
    await Promise.all([
      supabase
        .from("website_analyses")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("content_opportunities")
        .select("*")
        .eq("project_id", id)
        .order("opportunity_score", { ascending: false }),
      supabase
        .from("topic_clusters")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("seo_briefs")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("article_outlines")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  const analysis = analysisRes.data;
  const opportunities = opportunitiesRes.data ?? [];
  const cluster = clusterRes.data;
  const brief = briefRes.data;
  const outline = outlineRes.data;

  console.log("DEBUG - Analysis:", analysis ? "EXISTS" : "NULL");
  console.log("DEBUG - Opportunities:", opportunities.length, "items");
  console.log("DEBUG - Cluster:", cluster ? "EXISTS" : "NULL");
  console.log("DEBUG - Brief:", brief ? "EXISTS" : "NULL");
  console.log("DEBUG - Outline:", outline ? "EXISTS" : "NULL");

  const firstOpportunityId = opportunities[0]?.id ?? "";

  return (
    <>
      <PageHeader title={project.name} description={project.website_url} />
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{decodeURIComponent(error)}</p>
        </div>
      )}

      {/* Progress Steps */}
      <div className="mt-6 flex flex-wrap gap-2">
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          analysis ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
        }`}>
          {analysis ? "✓" : "○"} 01 Analyze
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          opportunities.length > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
        }`}>
          {opportunities.length > 0 ? "✓" : "○"} 02 Opportunities
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          cluster ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
        }`}>
          {cluster ? "✓" : "○"} 03 Cluster
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          brief ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
        }`}>
          {brief ? "✓" : "○"} 04 Brief
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          outline ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
        }`}>
          {outline ? "✓" : "○"} 05 Outline
        </div>
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
          <div className="space-y-3">
            <GenerateButton
              action={analyzeWebsite}
              label="Analyze website"
              pendingLabel="Analyzing..."
              hiddenFields={{ projectId: id }}
            />
            <p className="text-sm text-ink-muted">
              AI will analyze the website and generate content opportunities.
            </p>
          </div>
        )}
      </Section>

      {/* STEP 2: Opportunities */}
      {analysis && (
        <Section id="opportunities" step={2} title="Content opportunities">
          {opportunities.length > 0 ? (
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-4 border border-line rounded-lg bg-surface"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-ink">{d(opp.title)}</h3>
                      {opp.description && (
                        <p className="mt-1 text-sm text-ink-secondary">
                          {d(opp.description)}
                        </p>
                      )}
                      <div className="mt-2 flex gap-2 text-xs text-ink-muted">
                        <span>Score: {opp.opportunity_score}</span>
                        <span>•</span>
                        <span>{opp.difficulty}</span>
                        <span>•</span>
                        <span>{opp.search_intent}</span>
                      </div>
                      {opp.reason && (
                        <p className="mt-2 text-sm text-ink-secondary">
                          <strong>Why:</strong> {d(opp.reason)}
                        </p>
                      )}
                    </div>
                    {!cluster && (
                      <form action={generateCluster}>
                        <input type="hidden" name="projectId" value={id} />
                        <input type="hidden" name="opportunityId" value={opp.id} />
                        <button
                          type="submit"
                          className="px-3 py-2 bg-brand text-white text-sm font-medium rounded hover:bg-brand-hover"
                        >
                          Build Cluster
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-line rounded-lg bg-surface-subtle">
              <p className="text-ink-muted">
                No opportunities yet. Complete the website analysis first.
              </p>
            </div>
          )}
        </Section>
      )}

      {/* STEP 3: Topic Cluster */}
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
            <div className="mt-4">
              <form action={generateBrief}>
                <input type="hidden" name="projectId" value={id} />
                <input type="hidden" name="opportunityId" value={firstOpportunityId} />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand text-white text-sm font-medium rounded hover:bg-brand-hover"
                >
                  Generate SEO Brief
                </button>
              </form>
            </div>
          )}
        </Section>
      )}

      {/* STEP 4: SEO Brief */}
      {brief && (
        <Section id="brief" step={4} title="SEO brief">
          <div className="max-w-2xl">
            <FactRow label="Primary keyword" value={brief.primary_keyword} />
            <FactRow
              label="Suggested headings"
              value={(brief.suggested_headings as string[]).join(" • ")}
            />
          </div>
          {!outline && firstOpportunityId && (
            <div className="mt-4">
              <form action={generateOutline}>
                <input type="hidden" name="projectId" value={id} />
                <input type="hidden" name="opportunityId" value={firstOpportunityId} />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand text-white text-sm font-medium rounded hover:bg-brand-hover"
                >
                  Generate Outline
                </button>
              </form>
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
              {(outline.sections as Array<{ heading: string; points: string[] }>).map(
                (section, i) => (
                  <li key={i} className="pl-4 border-l-2 border-line">
                    <p className="font-medium text-ink">{section.heading}</p>
                    {section.points && (
                      <ul className="mt-1 pl-4 list-disc text-sm text-ink-secondary">
                        {section.points.map((point, j) => (
                          <li key={j}>{d(point)}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              )}
            </ol>
          </div>
        </Section>
      )}
    </>
  );
}
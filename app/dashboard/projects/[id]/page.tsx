import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { GenerateButton } from "@/components/dashboard/generate-button";
import { FormError } from "@/components/form";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
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
    <div className="py-3">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-ink-secondary">{d(value)}</p>
    </div>
  );
}

interface Step {
  id: string;
  label: string;
  done: boolean;
  current: boolean;
}

interface StepperProps {
  steps: Step[];
}

function Stepper({ steps }: StepperProps) {
  return (
    <ol className="mt-6 flex flex-wrap items-center gap-2">
      {steps.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className={
              s.current
                ? "inline-flex h-8 items-center rounded-full bg-brand px-3 text-xs font-medium text-white"
                : s.done
                  ? "inline-flex h-8 items-center rounded-full bg-surface-subtle px-3 text-xs font-medium text-ink-secondary"
                  : "inline-flex h-8 items-center rounded-full border border-line px-3 text-xs font-medium text-ink-muted"
            }
          >
            {s.done ? "✓ " : ""}
            {s.label}
          </a>
        </li>
      ))}
    </ol>
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

  // Fetch all data in parallel
  const [analysisRes, opportunitiesRes, clusterRes, briefRes, outlineRes] =
    await Promise.all([
      supabase
        .from("website_analyses")
        .select("*")
        .eq("project_id", id)
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
        .limit(1)
        .maybeSingle(),
      supabase
        .from("seo_briefs")
        .select("*")
        .eq("project_id", id)
        .limit(1)
        .maybeSingle(),
      supabase
        .from("article_outlines")
        .select("*")
        .eq("project_id", id)
        .limit(1)
        .maybeSingle(),
    ]);

  const analysis = analysisRes.data;
  const opportunities = opportunitiesRes.data ?? [];
  const cluster = clusterRes.data;
  const brief = briefRes.data;
  const outline = outlineRes.data;

  // Check what's done
  const done = {
    analysis: Boolean(analysis),
    opportunities: opportunities.length > 0,
    cluster: Boolean(cluster),
    brief: Boolean(brief),
    outline: Boolean(outline),
  };

  // Find first incomplete step
  const firstOpen = (
    ["analysis", "opportunities", "cluster", "brief", "outline"] as const
  ).find((key) => !done[key]);

  const firstOpportunityId = opportunities[0]?.id ?? "";

  return (
    <>
      <PageHeader title={project.name} description={project.website_url} />
      <div className="mt-4">
        <FormError message={error} />
      </div>

      <Stepper
        steps={[
          {
            id: "analysis",
            label: "01 Analyze",
            done: done.analysis,
            current: firstOpen === "analysis",
          },
          {
            id: "opportunities",
            label: "02 Opportunities",
            done: done.opportunities,
            current: firstOpen === "opportunities",
          },
          {
            id: "cluster",
            label: "03 Cluster",
            done: done.cluster,
            current: firstOpen === "cluster",
          },
          {
            id: "brief",
            label: "04 Brief",
            done: done.brief,
            current: firstOpen === "brief",
          },
          {
            id: "outline",
            label: "05 Outline",
            done: done.outline,
            current: firstOpen === "outline",
          },
        ]}
      />

      {/* STEP 1: Analysis */}
      <Section id="analysis" step={1} title="Website analysis">
        {analysis ? (
          <div className="max-w-2xl divide-y divide-line border-y border-line">
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
              pendingLabel="Analyzing website…"
              hiddenFields={{ projectId: id }}
            />
            <p className="text-sm text-ink-muted">
              Fetches the site, runs the AI analysis, saves the result.
            </p>
          </div>
        )}
      </Section>

      {/* STEP 2: Opportunities */}
      {analysis && (
        <Section id="opportunities" step={2} title="Content opportunities">
          {opportunities.length > 0 ? (
            <ul className="divide-y divide-line border-y border-line">
              {opportunities.map((o) => (
                <li
                  key={o.id}
                  className="flex flex-wrap items-baseline justify-between gap-4 py-4"
                >
                  <div className="min-w-0 max-w-2xl">
                    <p className="text-sm font-medium text-ink">
                      {d(o.title)}
                    </p>
                    <p className="mt-1 text-sm text-ink-secondary">
                      {d(o.description)}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ink-muted">
                      Score {o.opportunity_score} · {o.difficulty} ·{" "}
                      {o.search_intent} · {o.funnel_stage} funnel
                    </p>
                    {o.reason && (
                      <p className="mt-2 text-xs text-ink-secondary">
                        {d(o.reason)}
                      </p>
                    )}
                  </div>
                  {!cluster && (
                    <GenerateButton
                      action={generateCluster}
                      label="Build cluster from this"
                      pendingLabel="Building cluster…"
                      hiddenFields={{ projectId: id, opportunityId: o.id }}
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-card border border-line bg-surface-subtle p-8 text-center">
              <p className="text-sm text-ink-muted">
                No opportunities generated yet. Run the website analysis first.
              </p>
            </div>
          )}
        </Section>
      )}

      {/* STEP 3: Topic Cluster */}
      {cluster && (
        <Section id="cluster" step={3} title="Topic cluster">
          <div className="max-w-2xl divide-y divide-line border-y border-line">
            <FactRow label="Pillar topic" value={cluster.pillar_topic} />
            <FactRow
              label="Supporting topics"
              value={(cluster.supporting_topics as string[]).join(" · ")}
            />
            <FactRow
              label="Internal linking"
              value={(cluster.internal_linking_suggestions as string[]).join(
                " · "
              )}
            />
          </div>
          {!brief && firstOpportunityId ? (
            <div className="mt-4">
              <GenerateButton
                action={generateBrief}
                label="Generate SEO brief"
                pendingLabel="Writing brief…"
                hiddenFields={{ projectId: id, opportunityId: firstOpportunityId }}
              />
            </div>
          ) : null}
        </Section>
      )}

      {/* STEP 4: SEO Brief */}
      {brief && (
        <Section id="brief" step={4} title="SEO brief">
          <div className="max-w-2xl divide-y divide-line border-y border-line">
            <FactRow label="Primary keyword" value={brief.primary_keyword} />
            <FactRow
              label="Suggested headings"
              value={(brief.suggested_headings as string[]).join(" · ")}
            />
            <FactRow
              label="Questions to answer"
              value={(brief.questions_to_answer as string[]).join(" · ")}
            />
            <FactRow
              label="Entities to mention"
              value={(brief.entities_to_mention as string[]).join(" · ")}
            />
          </div>
          {!outline && firstOpportunityId ? (
            <div className="mt-4">
              <GenerateButton
                action={generateOutline}
                label="Generate article outline"
                pendingLabel="Outlining…"
                hiddenFields={{ projectId: id, opportunityId: firstOpportunityId }}
              />
            </div>
          ) : null}
        </Section>
      )}

      {/* STEP 5: Outline */}
      {outline && (
        <Section id="outline" step={5} title="Article outline">
          <div className="max-w-2xl">
            <p className="font-display text-lg font-semibold tracking-tight text-ink">
              {d(outline.h1)}
            </p>
            <ol className="mt-4 space-y-5">
              {(outline.sections as Array<{
                heading: string;
                purpose: string;
                points: string[];
              }>).map((s, i) => (
                <li key={s.heading}>
                  <p className="text-sm font-medium text-ink">
                    {i + 1}. {d(s.heading)}
                  </p>
                  <p className="mt-1 text-sm text-ink-secondary">{d(s.purpose)}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-secondary">
                    {s.points.map((point) => (
                      <li key={point}>{d(point)}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-ink-muted">
              Next: open the Editor (sidebar → This project → Editor) to draft
              each section with AI.
            </p>
          </div>
        </Section>
      )}
    </>
  );
}
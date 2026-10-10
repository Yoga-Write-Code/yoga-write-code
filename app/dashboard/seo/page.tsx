import type { Metadata } from "next";
import { generateBrief } from "@/app/dashboard/projects/[id]/actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { OpportunitySerp } from "@/components/dashboard/opportunity-serp";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Opportunities" };

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function intentTone(intent: string) {
  if (intent === "commercial") return "brand" as const;
  if (intent === "informational") return "info" as const;
  if (intent === "transactional") return "success" as const;
  return "neutral" as const;
}

function difficultyDot(difficulty: string) {
  if (difficulty === "low") return "bg-success";
  if (difficulty === "medium") return "bg-warning";
  return "bg-error";
}

type OppRow = {
  id: string;
  title: string;
  reason: string;
  description: string | null;
  opportunity_score: number;
  search_intent: string;
  funnel_stage: string;
  difficulty: string;
  target_keywords: unknown;
  keyword_gaps: unknown;
  projects: { id: string; name: string } | null;
};

export default async function SeoPage() {
  const supabase = await createSupabaseServerClient();
  const fullSelect =
    "id, title, reason, description, opportunity_score, search_intent, funnel_stage, difficulty, target_keywords, keyword_gaps, projects ( id, name )";
  const legacySelect =
    "id, title, reason, description, opportunity_score, search_intent, funnel_stage, difficulty, keyword_gaps, projects ( id, name )";

  let { data } = await supabase
    .from("content_opportunities")
    .select(fullSelect)
    .order("opportunity_score", { ascending: false })
    .limit(25);

  // Fallback for databases where the target_keywords migration hasn't run yet.
  if (!data) {
    const retry = await supabase
      .from("content_opportunities")
      .select(legacySelect)
      .order("opportunity_score", { ascending: false })
      .limit(25);
    data = (retry.data ?? []).map((row) => ({ ...row, target_keywords: [] }));
  }

  const rows = (data ?? []).map((row) => ({
    ...row,
    projects: row.projects?.[0] ?? null,
  })) as OppRow[];

  return (
    <div className="min-w-0">
      <PageHeader
        title="Opportunities"
        description="Your highest-scoring content opportunities across all projects."
      />

      {rows.length === 0 ? (
        <EmptyState
          title="Nothing ranked yet"
          message="Run a website analysis and your opportunities will be ranked here."
        />
      ) : (
        <div className="mt-8 space-y-4">
          {rows.map((o) => (
            <article key={o.id} className="rounded-card border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-ink-muted">{o.projects?.name}</p>
                  <h2 className="mt-0.5 text-base font-semibold text-ink">{o.title}</h2>
                  {o.description ? (
                    <p className="mt-1 text-sm leading-6 text-ink-secondary">{o.description}</p>
                  ) : null}
                </div>
                <Badge tone="brand">{o.opportunity_score}</Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <Badge tone={intentTone(o.search_intent)}>{o.search_intent}</Badge>
                <span className="inline-flex items-center gap-1.5 text-ink-secondary">
                  <span className={`h-1.5 w-1.5 rounded-full ${difficultyDot(o.difficulty)}`} />
                  {cap(o.difficulty)}
                </span>
                <Badge tone="neutral">{o.funnel_stage}</Badge>
              </div>

              <OpportunitySerp
                targetKeywords={o.target_keywords}
                keywordGaps={o.keyword_gaps}
                defaultExpanded={false}
              />

              {o.reason ? (
                <p className="mt-3 text-sm text-ink-secondary" title={o.reason}>
                  <span className="font-medium text-ink">Why it matters: </span>
                  {o.reason}
                </p>
              ) : null}

              <div className="mt-4 border-t border-line pt-3 text-right">
                <form action={generateBrief} className="inline">
                  <input type="hidden" name="projectId" value={o.projects?.id ?? ""} />
                  <input type="hidden" name="opportunityId" value={o.id} />
                  <button type="submit" className="text-xs font-medium text-brand hover:underline">
                    Generate brief
                  </button>
                </form>
              </div>
            </article>
          ))}
          <p className="text-xs text-ink-muted">
            Score reflects relevance, impact, and feasibility from the AI analysis.
          </p>
        </div>
      )}
    </div>
  );
}

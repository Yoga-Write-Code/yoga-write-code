import type { Metadata } from "next";
import { generateBrief } from "@/app/dashboard/projects/[id]/actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { OpportunitySerp } from "@/components/dashboard/opportunity-serp";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Opportunities" };

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

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
        description="Keywords, SERP competition, difficulty, and score — one row per opportunity."
      />

      {rows.length === 0 ? (
        <EmptyState
          title="Nothing ranked yet"
          message="Run a website analysis and your opportunities will be ranked here."
        />
      ) : (
        <section className="mt-8 min-w-0 rounded-card border border-line bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-ink-muted">
                  <th className="px-5 py-3 font-medium">Opportunity</th>
                  <th className="px-3 py-3 font-medium">Keywords &amp; SERP</th>
                  <th className="px-3 py-3 font-medium">Difficulty</th>
                  <th className="px-3 py-3 font-medium">Score</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((o) => (
                  <tr key={o.id} className="align-top transition-colors hover:bg-surface-subtle">
                    <td className="max-w-60 px-5 py-4">
                      <p className="font-medium text-ink">{o.title}</p>
                      <p className="mt-0.5 truncate text-xs text-ink-muted">{o.projects?.name}</p>
                      {o.reason ? (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-secondary" title={o.reason}>
                          {o.reason}
                        </p>
                      ) : null}
                      <p className="mt-1.5 text-[11px] text-ink-muted">
                        {o.search_intent} · {o.funnel_stage} funnel
                      </p>
                    </td>
                    <td className="min-w-64 max-w-90 px-3 py-4">
                      <OpportunitySerp
                        targetKeywords={o.target_keywords}
                        keywordGaps={o.keyword_gaps}
                        fallbackTitle={o.title}
                        defaultExpanded={false}
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-ink-secondary">
                        <span className={`h-1.5 w-1.5 rounded-full ${difficultyDot(o.difficulty)}`} />
                        {cap(o.difficulty)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <Badge tone="brand">{o.opportunity_score}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <form action={generateBrief} className="inline">
                        <input type="hidden" name="projectId" value={o.projects?.id ?? ""} />
                        <input type="hidden" name="opportunityId" value={o.id} />
                        <button type="submit" className="text-xs font-medium text-brand hover:underline">
                          Generate brief
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-line px-5 py-3 text-xs text-ink-muted">
            Score reflects relevance, impact, and feasibility. SERP score is live-search relevance per ranking page.
          </p>
        </section>
      )}
    </div>
  );
}

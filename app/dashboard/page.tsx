import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { DeleteProjectButton } from "@/components/dashboard/delete-project-button";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { generateBrief } from "@/app/dashboard/projects/[id]/actions";
import { getUserDisplayName } from "@/lib/auth/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Overview" };

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const DAY = 86400000;

type ProjState = {
  id: string;
  name: string;
  website_url: string;
  website_analyses: { id: string }[];
  topic_clusters: { id: string }[];
  seo_briefs: { id: string }[];
  article_outlines: { id: string }[];
  article_drafts: { id: string; title: string }[];
};

type OppRow = {
  id: string;
  title: string;
  reason: string;
  opportunity_score: number;
  search_intent: string;
  difficulty: string;
  projects: { id: string; name: string }[];
};

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

function Kpi({ label, value, delta, sub }: { label: string; value: number; delta: string; sub: string }) {
  return (
    <div className="rounded-card border border-line bg-surface px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="font-display text-3xl font-semibold tracking-tight text-ink">{value}</p>
        <span className="text-xs font-medium text-success">{delta}</span>
      </div>
      <p className="mt-1 text-xs text-ink-muted">{sub}</p>
    </div>
  );
}

export default async function OverviewPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: profile } = userData.user
    ? await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userData.user.id)
        .maybeSingle()
    : { data: null };
  const displayName = userData.user
    ? getUserDisplayName(userData.user, profile?.full_name)
    : "there";
  const firstName = cap(
    displayName === "Your account" ? "there" : displayName.split(/\s+/)[0] || "there",
  );
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const now = new Date().getTime();
  const weekAgo = new Date(now - 7 * DAY).toISOString();
  const twoWeeksAgo = new Date(now - 14 * DAY).toISOString();

  const [projectsRes, oppsRes, oppsWeek, oppsPrev, draftsWeek, draftsPrev, oppsTop] =
    await Promise.all([
      supabase
        .from("projects")
        .select(
          "id, name, website_url, website_analyses ( id ), topic_clusters ( id ), seo_briefs ( id ), article_outlines ( id ), article_drafts ( id, title )"
        )
        .order("updated_at", { ascending: false }),
      supabase.from("content_opportunities").select("id", { count: "exact", head: true }),
      supabase
        .from("content_opportunities")
        .select("id", { count: "exact", head: true })
        .gte("created_at", weekAgo),
      supabase
        .from("content_opportunities")
        .select("id", { count: "exact", head: true })
        .gte("created_at", twoWeeksAgo)
        .lt("created_at", weekAgo),
      supabase
        .from("article_drafts")
        .select("id", { count: "exact", head: true })
        .gte("created_at", weekAgo),
      supabase
        .from("article_drafts")
        .select("id", { count: "exact", head: true })
        .gte("created_at", twoWeeksAgo)
        .lt("created_at", weekAgo),
      supabase
        .from("content_opportunities")
        .select("id, title, reason, opportunity_score, search_intent, difficulty, projects ( id, name )")
        .order("opportunity_score", { ascending: false })
        .limit(5),
    ]);

  const states = (projectsRes.data ?? []) as ProjState[];
  const totalOpps = oppsRes.count ?? 0;
  const oppsDelta = (oppsWeek.count ?? 0) - (oppsPrev.count ?? 0);
  const draftsDelta = (draftsWeek.count ?? 0) - (draftsPrev.count ?? 0);
  const analyzed = states.filter((s) => (s.website_analyses ?? []).length > 0).length;
  const draftsTotal = states.reduce((n, s) => n + (s.article_drafts ?? []).length, 0);
  const topOpps = (oppsTop.data ?? []) as OppRow[];
  const focusProject = states[0];

  const actions: { title: string; sub: string; href: string }[] = [];
  for (const pr of states) {
    if (!(pr.website_analyses ?? []).length) {
      actions.push({ title: `Analyze ${pr.name}`, sub: "Turn the website into a content plan", href: `/dashboard/projects/${pr.id}` });
    } else if (!(pr.topic_clusters ?? []).length) {
      actions.push({ title: `Build a topic cluster for ${pr.name}`, sub: "From your top opportunity", href: `/dashboard/projects/${pr.id}#opportunities` });
    } else if (!(pr.seo_briefs ?? []).length) {
      actions.push({ title: `Generate an SEO brief for ${pr.name}`, sub: "Keyword, headings, questions, entities", href: `/dashboard/projects/${pr.id}#cluster` });
    } else if (!(pr.article_outlines ?? []).length) {
      actions.push({ title: `Generate an outline for ${pr.name}`, sub: "Structure the article before writing", href: `/dashboard/projects/${pr.id}#brief` });
    } else if (!(pr.article_drafts ?? []).length) {
      actions.push({ title: `Draft the ${pr.name} article`, sub: "Open the editor with your outline", href: `/dashboard/projects/${pr.id}/editor` });
    } else {
      actions.push({ title: `Continue writing in ${pr.name}`, sub: pr.article_drafts[0].title, href: `/dashboard/content?draft=${pr.article_drafts[0].id}` });
    }
  }
  if (actions.length === 0) {
    actions.push({ title: "Analyze your first website", sub: "Create a content plan in one click", href: "/dashboard/projects/new" });
  }
  const topActions = actions.slice(0, 4);

  return (
    <div className="min-w-0">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            {greeting}, {firstName}
          </h1>
          <p className="mt-2 truncate text-sm text-ink-secondary">
            Here&apos;s your content intelligence{focusProject ? ` for ${focusProject.name}` : ""}.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex h-10 shrink-0 items-center rounded-field bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
        >
          New project
        </Link>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Projects" value={states.length} delta={`${analyzed} analyzed`} sub="total in workspace" />
        <Kpi
          label="Opportunities"
          value={totalOpps}
          delta={oppsDelta > 0 ? `+${oppsDelta} this week` : "±0 this week"}
          sub="vs previous week"
        />
        <Kpi
          label="Drafts"
          value={draftsTotal}
          delta={draftsDelta > 0 ? `+${draftsDelta} this week` : "±0 this week"}
          sub="vs previous week"
        />
        <Kpi label="Next actions" value={topActions.length} delta="ready" sub="computed from your workflow" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 rounded-card border border-line bg-surface">
          <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-4">
            <p className="text-sm font-semibold text-ink">Top content opportunities</p>
            <Link href="/dashboard/seo" className="text-xs font-medium text-brand underline underline-offset-4">
              View all
            </Link>
          </div>
          {topOpps.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ink-muted">
              We&apos;re analyzing your sites… opportunities will rank here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs text-ink-muted">
                    <th className="px-5 py-3 font-medium">Topic</th>
                    <th className="hidden px-3 py-3 font-medium md:table-cell">Intent</th>
                    <th className="hidden px-3 py-3 font-medium md:table-cell">Difficulty</th>
                    <th className="px-3 py-3 font-medium">Score</th>
                    <th className="hidden px-3 py-3 font-medium xl:table-cell">Why it matters</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {topOpps.map((o) => (
                    <tr key={o.id} className="transition-colors hover:bg-surface-subtle">
                      <td className="max-w-55 px-5 py-3">
                        <p className="truncate font-medium text-ink">{o.title}</p>
                        <p className="truncate text-xs text-ink-muted">{o.projects?.[0]?.name}</p>
                      </td>
                      <td className="hidden px-3 py-3 md:table-cell">
                        <Badge tone={intentTone(o.search_intent)}>{o.search_intent}</Badge>
                      </td>
                      <td className="hidden px-3 py-3 md:table-cell">
                        <span className="flex items-center gap-1.5 text-xs text-ink-secondary">
                          <span className={`h-1.5 w-1.5 rounded-full ${difficultyDot(o.difficulty)}`} />
                          {cap(o.difficulty)}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <Badge tone="brand">{o.opportunity_score}</Badge>
                      </td>
                      <td className="hidden max-w-55 px-3 py-3 xl:table-cell">
                        <p className="truncate text-xs text-ink-secondary" title={o.reason}>
                          {o.reason}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <form action={generateBrief} className="inline">
                          <input type="hidden" name="projectId" value={o.projects?.[0]?.id ?? ""} />
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
          )}
          <p className="border-t border-line px-5 py-3 text-xs text-ink-muted">
            Score reflects relevance, impact, and feasibility from the AI analysis.
          </p>
        </section>

        <aside className="min-w-0 h-fit rounded-card border border-line bg-surface p-5">
          <p className="text-sm font-semibold text-ink">Next best actions</p>
          <ul className="mt-4 space-y-2">
            {topActions.map((a) => (
              <li key={a.href + a.title}>
                <Link
                  href={a.href}
                  className="flex items-center justify-between gap-3 rounded-control border border-line px-4 py-3 transition-colors hover:bg-surface-subtle"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{a.title}</span>
                    <span className="block truncate text-xs text-ink-muted">{a.sub}</span>
                  </span>
                  <ArrowRight size={16} className="shrink-0 text-ink-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="mt-8">
        <PageHeader title="Projects" description="Most recently updated first." />
        {states.length === 0 ? (
          <EmptyState title="No projects yet" message="Analyze your first website to create a content plan." />
        ) : (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {states.map((project) => (
              <li
                key={project.id}
                className="flex items-center justify-between gap-6 py-4 transition-colors hover:bg-surface-subtle"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{project.name}</p>
                  <p className="mt-1 truncate text-sm text-ink-muted">{project.website_url}</p>
                </div>
                <div className="flex shrink-0 items-center gap-5">
                  {(project.website_analyses ?? []).length ? (
                    <Badge tone="success">Analyzed</Badge>
                  ) : (
                    <Badge tone="neutral">New</Badge>
                  )}
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="text-sm font-medium text-brand underline underline-offset-4"
                  >
                    Open
                  </Link>
                  <DeleteProjectButton projectId={project.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
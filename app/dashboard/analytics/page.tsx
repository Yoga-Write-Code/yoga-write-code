import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const supabase = await createSupabaseServerClient();

  const [projectsRes, analysesRes, opportunitiesRes, draftsRes] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("website_analyses").select("id", { count: "exact", head: true }),
    supabase.from("content_opportunities").select("id", { count: "exact", head: true }),
    supabase.from("article_drafts").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Projects", value: String(projectsRes.count ?? 0) },
    { label: "Analyses", value: String(analysesRes.count ?? 0) },
    { label: "Opportunities", value: String(opportunitiesRes.count ?? 0) },
    { label: "Drafts", value: String(draftsRes.count ?? 0) },
  ];

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Real activity in your workspace — nothing simulated."
      />
      <dl className="mt-8 grid grid-cols-2 gap-px border border-stone-200 bg-stone-200 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white px-5 py-6">
            <dt className="text-xs font-medium uppercase tracking-[0.12em] text-stone-400">
              {stat.label}
            </dt>
            <dd className="font-sans mt-2 text-3xl tracking-tight text-stone-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm text-stone-500">
        External traffic metrics arrive when you connect a real analytics source.
      </p>
    </>
  );
}
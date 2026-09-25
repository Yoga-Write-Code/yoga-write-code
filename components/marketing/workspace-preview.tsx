import Image from "next/image";
import Link from "next/link";

const opportunityRows = [
  ["Turn your website into your next five articles", "informational", "92"],
  ["Build a focused topic cluster", "informational", "88"],
  ["Create a commercial comparison page", "commercial", "88"],
  ["Develop a founder-friendly SEO guide", "commercial", "85"],
];

const navItems = [
  ["Overview", "▤", "/dashboard"],
  ["Opportunities", "◎", "/dashboard/seo"],
  ["Drafts & Editor", "✎", "/dashboard/content"],
  ["Analytics", "▥", "/dashboard/analytics"],
  ["Settings", "⚙", "/dashboard/settings"],
] as const;

export function WorkspacePreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#eaeaef] bg-white shadow-[0_12px_32px_rgba(20,20,27,0.10)]">
      <div className="flex min-h-[580px] flex-col md:flex-row">
        <aside className="flex w-full shrink-0 flex-row gap-2 overflow-x-auto border-b border-[#eaeaef] bg-[#f6f6f9] p-4 md:w-56 md:flex-col md:border-b-0 md:border-r">
          <div className="flex shrink-0 items-center gap-2 px-2 pb-3 font-bold text-[#14141b]">
            <Image src="/icon.svg" alt="" width={28} height={28} unoptimized />
            <span className="text-sm">
              Yoga Write Code
              <span className="block text-[10px] font-medium text-[#8b8b96]">Content OS</span>
            </span>
          </div>
          <p className="hidden px-2 pt-3 text-[10px] font-bold uppercase tracking-[0.06em] text-[#8b8b96] md:block">
            Workspace
          </p>
          <nav className="flex gap-1 md:mt-2 md:block md:space-y-1">
            {navItems.map(([label, icon, href], index) => (
              <Link
                key={label}
                href={href}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                  index === 0
                    ? "bg-[#f5f3ff] text-[#5b34e0]"
                    : "text-[#6b6b76] hover:bg-white hover:text-[#14141b]"
                }`}
              >
                <span className="w-4 text-center">{icon}</span>
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto hidden rounded-xl border border-[#eaeaef] bg-white p-3 text-xs md:block">
            <p className="font-semibold text-[#14141b]">
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#18a857]" />
              Design Partner Program
            </p>
            <p className="mt-2 leading-5 text-[#6b6b76]">
              Help shape the next version of Yoga Write Code.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1 bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-[#eaeaef] px-5 py-3 sm:px-7">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#eaeaef] bg-[#f6f6f9] px-3 py-2 text-xs text-[#8b8b96] sm:max-w-xs">
              <span>⌕</span>
              <span className="truncate">Search content, keywords, projects…</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#18a857] text-[10px] font-bold text-white">
                YW
              </span>
              <span className="hidden text-xs font-semibold text-[#14141b] sm:block">Your workspace</span>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-[#14141b]">
                  Welcome to your workspace <span aria-hidden="true">👋</span>
                </h3>
                <p className="mt-1 text-xs text-[#6b6b76]">
                  Your content intelligence, in one calm place.
                </p>
              </div>
              <Link
                href="/dashboard/projects/new"
                className="rounded-lg bg-[#6d46f5] px-3 py-2 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(109,70,245,0.24)] transition hover:bg-[#5b34e0]"
              >
                + New project
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Projects", "2", "total in workspace"],
                ["Opportunities", "10", "+5 this week"],
                ["Drafts", "2", "+2 this week"],
                ["Next actions", "2", "ready to continue"],
              ].map(([label, value, sub]) => (
                <div key={label} className="rounded-xl border border-[#eaeaef] bg-white p-4">
                  <p className="text-[11px] font-semibold text-[#6b6b76]">{label}</p>
                  <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#14141b]">{value}</p>
                  <p className="mt-1 text-[10px] text-[#8b8b96]">{sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
              <div className="overflow-hidden rounded-xl border border-[#eaeaef]">
                <div className="flex items-center justify-between border-b border-[#eaeaef] px-4 py-3">
                  <h4 className="text-sm font-bold text-[#14141b]">Top content opportunities</h4>
                  <Link href="/dashboard/seo" className="text-xs font-semibold text-[#6d46f5]">
                    View all →
                  </Link>
                </div>
                <div className="divide-y divide-[#f0f0f4] px-4">
                  {opportunityRows.map(([title, intent, score]) => (
                    <div key={title} className="flex items-center gap-3 py-3 text-xs">
                      <span className="min-w-0 flex-1 truncate font-semibold text-[#14141b]">{title}</span>
                      <span
                        className={`hidden rounded-full px-2 py-1 text-[10px] font-semibold sm:inline ${
                          intent === "commercial"
                            ? "bg-[#fcf2df] text-[#b9791f]"
                            : "bg-[#f5f3ff] text-[#6d46f5]"
                        }`}
                      >
                        {intent}
                      </span>
                      <span className="shrink-0 text-[11px] text-[#8b8b96]">Score {score}</span>
                    </div>
                  ))}
                </div>
                <p className="border-t border-[#f0f0f4] px-4 py-3 text-[10px] text-[#8b8b96]">
                  Score reflects relevance, impact, and feasibility.
                </p>
              </div>

              <div className="rounded-xl border border-[#eaeaef] p-4">
                <h4 className="text-sm font-bold text-[#14141b]">Next best actions</h4>
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-[#ede9fe] bg-[#f5f3ff] p-3 text-xs">
                    <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#6d46f5]">Continue</p>
                    <p className="mt-1 font-semibold text-[#14141b]">Your next pillar topic</p>
                    <p className="mt-1 text-[#6b6b76]">Build a focused plan from your website.</p>
                  </div>
                  <div className="rounded-lg border border-[#ede9fe] bg-[#f5f3ff] p-3 text-xs">
                    <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#6d46f5]">Explore</p>
                    <p className="mt-1 font-semibold text-[#14141b]">A stronger first brief</p>
                    <p className="mt-1 text-[#6b6b76]">Turn an opportunity into a clear next step.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

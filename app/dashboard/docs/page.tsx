import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Docs" };

const sections = [
  { id: "getting-started", title: "Getting started" },
  { id: "usage", title: "Using Yoga Write Code" },
  { id: "billing", title: "Billing & plans" },
  { id: "limits", title: "Usage limits" },
  { id: "faq", title: "FAQ" },
] as const;

export default function DocsPage() {
  return (
    <div className="min-w-0">
      <PageHeader title="Docs" description="How to use Yoga Write Code, billing, and usage limits." />

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1 lg:sticky lg:top-6 lg:self-start" aria-label="Docs sections">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="block rounded-control px-3 py-1.5 text-sm text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink"
            >
              {s.title}
            </a>
          ))}
        </nav>

        <div className="max-w-3xl space-y-14">
          <section id="getting-started" className="scroll-mt-24 space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-ink">Getting started</h2>
            <p className="text-[15px] leading-7 text-ink-secondary">
              Yoga Write Code turns your website into a structured content plan. Create a project with
              your domain and we analyze your site, surface content opportunities, group them into topic
              clusters, and generate SEO briefs and outlines.
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-7 text-ink-secondary">
              <li>Go to <strong className="text-ink">Overview → New project</strong> and enter your website URL.</li>
              <li>Wait for the analysis to finish, then open the project.</li>
              <li>Review content opportunities and pick a cluster to work on.</li>
              <li>Generate an SEO brief and outline, then draft your content in the editor.</li>
            </ol>
          </section>

          <section id="usage" className="scroll-mt-24 space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-ink">Using Yoga Write Code</h2>
            <h3 className="font-semibold text-ink">Content opportunities</h3>
            <p className="text-[15px] leading-7 text-ink-secondary">
              Finds keyword and topic gaps based on your site. Each opportunity shows intent, difficulty
              signal, and suggested priority.
            </p>
            <h3 className="font-semibold text-ink">Topic clusters</h3>
            <p className="text-[15px] leading-7 text-ink-secondary">
              Groups related opportunities into pillar/cluster structure so your content builds topical
              authority.
            </p>
            <h3 className="font-semibold text-ink">SEO briefs & outlines</h3>
            <p className="text-[15px] leading-7 text-ink-secondary">
              Generates a structured brief (target keyword, headings, questions to answer) and a draft
              outline per cluster.
            </p>
            <h3 className="font-semibold text-ink">Drafts & editor</h3>
            <p className="text-[15px] leading-7 text-ink-secondary">
              Turn outlines into full drafts, edit inline, and manage all drafts from the Drafts page.
            </p>
            <h3 className="font-semibold text-ink">Analytics</h3>
            <p className="text-[15px] leading-7 text-ink-secondary">
              Track project progress: analyses run, clusters built, briefs and drafts created.
            </p>
          </section>

          <section id="billing" className="scroll-mt-24 space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-ink">Billing & plans</h2>
            <p className="text-[15px] leading-7 text-ink-secondary">
              Plans are billed monthly through Paddle. You can upgrade, downgrade, or cancel from{" "}
              <strong className="text-ink">Dashboard → Upgrade</strong> (manage) and{" "}
              <strong className="text-ink">Dashboard → Settings</strong>.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-ink-secondary">
              <li>Upgrades take effect immediately and are pro-rated.</li>
              <li>Cancellations stop future renewals; you keep access until the end of the paid period.</li>
              <li>Refunds are handled per our refund policy — see the footer link.</li>
            </ul>
          </section>

          <section id="limits" className="scroll-mt-24 space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-ink">Usage limits</h2>
            <p className="text-[15px] leading-7 text-ink-secondary">
              Each plan includes a monthly quota of website analyses and AI generations (briefs, outlines,
              drafts). Check your current usage on the Overview and Pricing pages. Hitting a limit will
              pause new analyses until your quota resets or you upgrade.
            </p>
          </section>

          <section id="faq" className="scroll-mt-24 space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-ink">FAQ</h2>
            <h3 className="font-semibold text-ink">Can I change my website URL?</h3>
            <p className="text-[15px] leading-7 text-ink-secondary">
              Yes — edit the project or create a new project for a different domain.
            </p>
            <h3 className="font-semibold text-ink">Do you offer annual billing?</h3>
            <p className="text-[15px] leading-7 text-ink-secondary">
              Contact us and we can set up a custom annual plan.
            </p>
            <h3 className="font-semibold text-ink">How do I delete my account?</h3>
            <p className="text-[15px] leading-7 text-ink-secondary">
              Go to Dashboard → Settings and use the delete account option.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

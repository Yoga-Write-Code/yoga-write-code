import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Welcome", robots: { index: false, follow: false } };

const steps = [
  {
    title: "Pick your plan",
    body: "Start with a 7-day free trial of Pro, or explore the free tier first.",
    href: "/pricing",
    cta: "View pricing",
  },
  {
    title: "Add your website",
    body: "Create a project from your domain — we analyze it and find content opportunities.",
    href: "/dashboard/projects/new",
    cta: "Create project",
  },
  {
    title: "Generate your plan",
    body: "Topic clusters, SEO briefs, outlines and drafts from one calm workspace.",
    href: "/dashboard",
    cta: "Go to dashboard",
  },
];

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-canvas px-5 py-20 font-sans sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Welcome</p>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">
          Let&apos;s set up your workspace
        </h1>
        <p className="mt-4 text-lg text-ink-secondary">
          Three quick steps — you can skip any of them and come back later.
        </p>

        <ol className="mt-12 space-y-6">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-card border border-line bg-surface p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Step {i + 1}
              </p>
              <h2 className="mt-2 font-heading text-xl font-bold tracking-tight text-ink">
                {step.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-secondary">{step.body}</p>
              <Link
                href={step.href}
                className="mt-4 inline-flex items-center rounded-control bg-brand px-4 py-2 text-xs font-semibold text-white shadow-pop transition-colors hover:bg-brand-hover"
              >
                {step.cta}
              </Link>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-sm text-ink-muted">
          <Link href="/dashboard" className="font-medium text-ink-secondary hover:text-ink">
            Skip for now →
          </Link>
        </p>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yoga Write Code vs The Competition | Best AI SEO Tool",
  description:
    "See why Yoga Write Code is the smarter alternative to legacy SEO tools. Full 5-step content pipeline vs just text generation.",
};

const competitors = [
  {
    name: "SurferSEO",
    slug: "/compare/surfer-seo",
    description:
      "YWC is cheaper, easier, and includes AI generation — Surfer is just an analyzer.",
  },
  {
    name: "Frase",
    slug: "/compare/frase",
    description:
      "YWC has better topic clustering and live SERP analysis built into one workflow.",
  },
  {
    name: "Jasper",
    slug: "/compare/jasper",
    description:
      "YWC provides the strategy and briefs — Jasper just writes blindly.",
  },
];

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <h1 className="font-heading text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">
        The Smarter Alternative to Legacy SEO Tools
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-secondary">
        Most SEO tools stop at data or text generation. Yoga Write Code delivers the full
        5-step pipeline — from website analysis to publishable outlines — so you get strategy,
        not just suggestions.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {competitors.map((c) => (
          <Link
            key={c.slug}
            href={c.slug}
            className="group rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-brand-soft hover:shadow-pop"
          >
            <h2 className="font-heading text-lg font-bold text-ink group-hover:text-brand">
              vs {c.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-secondary">{c.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
              See comparison <span aria-hidden="true">&rarr;</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

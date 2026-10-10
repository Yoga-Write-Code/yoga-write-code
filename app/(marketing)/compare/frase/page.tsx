import type { Metadata } from "next";
import { ComparisonTable } from "@/components/marketing/comparison-table";

export const metadata: Metadata = {
  title: "Best Frase Alternative 2026 | Yoga Write Code",
  description:
    "Yoga Write Code beats Frase with better topic clustering, live SERP analysis, and a complete content pipeline.",
};

const features = [
  { name: "Topic cluster generation", ywc: true, competitor: true },
  { name: "Live SERP analysis", ywc: true, competitor: true },
  { name: "AI content briefs", ywc: true, competitor: true },
  { name: "Article outline generation", ywc: true, competitor: false },
  { name: "AI text generation", ywc: true, competitor: true },
  { name: "Website analysis & strategy", ywc: true, competitor: false },
  { name: "All-in-one pipeline", ywc: true, competitor: false },
];

export default function FraseComparisonPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <h1 className="font-heading text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">
        Best Frase Alternative 2026
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-secondary">
        Frase does SERP research well, but lacks topic clustering and a connected
        content pipeline. Yoga Write Code ties everything together — from strategy to
        publishable outlines — in one workflow.
      </p>

      <div className="mt-12">
        <ComparisonTable competitorName="Frase" features={features} />
      </div>
    </div>
  );
}

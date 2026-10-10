import type { Metadata } from "next";
import { ComparisonTable } from "@/components/marketing/comparison-table";

export const metadata: Metadata = {
  title: "Best SurferSEO Alternative 2026 | Yoga Write Code",
  description:
    "Yoga Write Code is the affordable SurferSEO alternative that analyzes, clusters, briefs, and generates — all in one workflow.",
};

const features = [
  { name: "Website analysis & strategy", ywc: true, competitor: false },
  { name: "Topic cluster generation", ywc: true, competitor: false },
  { name: "AI content briefs", ywc: true, competitor: true },
  { name: "Article outline generation", ywc: true, competitor: false },
  { name: "AI text generation", ywc: true, competitor: false },
  { name: "SERP content scoring", ywc: true, competitor: true },
  { name: "All-in-one pipeline", ywc: true, competitor: false },
];

export default function SurferSeoComparisonPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <h1 className="font-heading text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">
        Best SurferSEO Alternative 2026
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-secondary">
        SurferSEO is a solid content analyzer, but it stops there. Yoga Write Code
        includes everything Surfer does — plus AI generation, topic clusters, and a
        complete 5-step pipeline at a fraction of the cost.
      </p>

      <div className="mt-12">
        <ComparisonTable competitorName="SurferSEO" features={features} />
      </div>
    </div>
  );
}

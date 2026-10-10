import type { Metadata } from "next";
import { ComparisonTable } from "@/components/marketing/comparison-table";

export const metadata: Metadata = {
  title: "Best Jasper Alternative 2026 | Yoga Write Code",
  description:
    "Yoga Write Code is the strategic Jasper alternative — we provide the strategy and briefs so your content actually ranks.",
};

const features = [
  { name: "Content strategy & research", ywc: true, competitor: false },
  { name: "SEO briefs with entities", ywc: true, competitor: false },
  { name: "Topic cluster generation", ywc: true, competitor: false },
  { name: "Article outline generation", ywc: true, competitor: false },
  { name: "AI text generation", ywc: true, competitor: true },
  { name: "Website analysis", ywc: true, competitor: false },
  { name: "All-in-one pipeline", ywc: true, competitor: false },
];

export default function JasperComparisonPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <h1 className="font-heading text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">
        Best Jasper Alternative 2026
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-secondary">
        Jasper writes blindly without strategy. Yoga Write Code provides the research,
        topic clusters, and SEO briefs first — then generates content that actually
        ranks. Strategy before writing, not after.
      </p>

      <div className="mt-12">
        <ComparisonTable competitorName="Jasper" features={features} />
      </div>
    </div>
  );
}

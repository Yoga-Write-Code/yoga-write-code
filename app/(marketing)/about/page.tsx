import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { MarketingCta } from "@/components/marketing/marketing-cta";
import { siteBaseUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Yoga Write Code is a SaaS that turns your website into structured content planning — content opportunities, topic clusters, SEO briefs, and outlines.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Yoga Write Code",
    description:
      "An SEO content planning tool built by Sachin Pandey, from real SEO and content work.",
    url: "/about",
  },
};

const workflow = [
  "Website",
  "Research",
  "Content Opportunities",
  "Topic Clusters",
  "SEO Brief",
  "Content Outline",
];

export default function AboutPage() {
  return (
    <>
      <main className="bg-canvas">
        <div className="mx-auto max-w-3xl px-5 py-20 font-sans sm:px-8 sm:py-28 space-y-14">
          <section>
            <h1 className="font-heading text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">
              About Yoga Write Code
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-ink-secondary">
              Yoga Write Code helps businesses turn their website into a
              structured content plan: research, content opportunities, topic
              clusters, SEO briefs, and outlines — in one SEO workflow.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-ink">
              Why YWC was built
            </h2>
            <p className="leading-7 text-ink-secondary">
              Most businesses know they need content. The hard part is deciding
              what that content should be. What should a business publish next? Which
              topics are actually relevant to the business? Which opportunities
              are worth pursuing? How should related topics be organized? What
              should an SEO brief contain? And how does research become a
              useful outline?
            </p>
            <p className="leading-7 text-ink-secondary">
              Those decisions usually live in scattered spreadsheets, tabs, and
              opinions. Yoga Write Code exists to make them more structured and
              evidence-based.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-ink">
              What YWC does
            </h2>
            <p className="leading-7 text-ink-secondary">
              YWC is an SEO content planning workflow, not a generic AI writing
              tool. You start with your website, and it takes you through a
              connected process:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {workflow.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink">
                    {step}
                  </span>
                  {i < workflow.length - 1 ? (
                    <span aria-hidden="true" className="text-ink-muted">→</span>
                  ) : null}
                </span>
              ))}
            </div>
            <p className="leading-7 text-ink-secondary">
              Each step feeds the next: your site grounds the research, the
              research surfaces content opportunities, opportunities become
              topic clusters, and each cluster can produce SEO briefs and
              content outlines you can actually write from.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-ink">
              What YWC believes
            </h2>
            <p className="leading-7 text-ink-secondary">
              Producing more AI content is not the goal. Choosing the right
              content to create comes first. A mediocre brief for the wrong
              topic is worth less than a sharp brief for the right one, no
              matter how fast it got written.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-ink">
              How YWC is built
            </h2>
            <p className="leading-7 text-ink-secondary">
              YWC ships in small steps: build, release what works, and improve
              it based on real usage — testing the workflow against real
              websites and listening to the
              people using it. The product would rather solve one problem well
              than carry a long feature list that solves nothing completely.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-ink">
              Founder
            </h2>
            <div className="flex items-start gap-6">
              <Image
                src="/images/sachin-pandey.png"
                alt="Sachin Pandey, founder of Yoga Write Code"
                width={120}
                height={120}
                className="h-30 w-30 rounded-full object-cover"
                priority
              />
              <p className="leading-7 text-ink-secondary flex-1">
                Yoga Write Code is built by{" "}
              <a
                href="https://sachinpandey.com.np/about"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand hover:underline"
              >
                Sachin Pandey
              </a>
              , who has worked across SEO, websites, content marketing, digital
              marketing, automation, and software. The product comes from
              problems observed through that real SEO and content work — not
              from a whiteboard.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-ink">
              Who it&apos;s for
            </h2>
            <p className="leading-7 text-ink-secondary">
              Today YWC is aimed at small businesses, founders, and marketing
              teams doing their own SEO content strategy — people who need
              structure but don&apos;t want to manage a stack of disconnected
              tools. YWC is still validating exactly who gets the most
              value, so the ideal customer profile is intentionally a work in
              progress.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-ink">
              Current stage
            </h2>
            <p className="leading-7 text-ink-secondary">
              YWC is an early product in active validation. The core workflow
              works end to end, and it is tested with real websites
              and potential users. Expect rough edges; expect changes. If
              you&apos;re here early, your feedback directly shapes what gets
              built next.
            </p>
          </section>
        </div>

        <MarketingCta
          title="See it on your own website."
          description="The fastest way to understand YWC is to run it on a real site. Or reach out if you have a question about the workflow."
          primaryLabel="Try it free"
          primaryHref="/signup"
          secondaryLabel="Contact us"
          secondaryHref="mailto:hello@yogawritecode.com"
        />
      </main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          url: new URL("/about", siteBaseUrl).toString(),
          name: "About Yoga Write Code",
          description:
            "Yoga Write Code is a SaaS that turns your website into structured content planning.",
        }}
      />
    </>
  );
}

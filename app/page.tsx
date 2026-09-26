import type { Metadata } from "next";
import Link from "next/link";
import { MarketingCta } from "@/components/marketing/marketing-cta";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { WorkflowPreview } from "@/components/marketing/workflow-preview";
import { WorkspacePreview } from "@/components/marketing/workspace-preview";
import { siteBaseUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Yoga Write Code — Turn your website into your next five articles",
  description:
    "Paste a URL and get real content opportunities, topic clusters, SEO briefs, and article outlines grounded in your business.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Yoga Write Code — AI Content Operating System",
    description:
      "Turn your website into your next five articles with a connected five-step content workflow.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const steps = [
  {
    n: "01",
    title: "Analyze Website",
    text: "Paste your URL. Get a grounded company summary, category, and target audience.",
  },
  {
    n: "02",
    title: "Content Opportunities",
    text: "See specific topics, quick wins, and opportunities tied to your business.",
  },
  {
    n: "03",
    title: "Topic Cluster",
    text: "Build a pillar topic with supporting articles and internal-link suggestions.",
  },
  {
    n: "04",
    title: "SEO Brief",
    text: "Get the keyword, intent, headings, questions, entities, and insights to write with.",
  },
  {
    n: "05",
    title: "Outline",
    text: "Start with a clean H1 and section structure that is ready for a writer.",
  },
];

const features = [
  ["Keyword opportunities", "Prioritized topics scored for business relevance, intent, and feasibility."],
  ["Visual topic clusters", "Pillar and supporting topics with internal linking built into the plan."],
  ["SEO briefs", "Headings, entities, questions, and competitor insights generated together."],
  ["Article outlines", "A clean H1/H2/H3 structure that is ready to draft without cleanup."],
  ["Competitor gaps", "Spot the topics your competitors cover and your audience is searching for."],
  ["Founder-friendly", "Plain language and a guided workflow, with no SEO jargon required."],
] as const;

const painPoints = [
  "Hunting keywords across multiple tools",
  "Guessing search intent",
  "Manual competitor analysis",
  "Briefs that drift from strategy",
  "No clear topic clusters",
];

const faqs = [
  [
    "What is Yoga Write Code?",
    "Yoga Write Code is an AI content operating system that turns your website into a connected plan of opportunities, clusters, briefs, and outlines.",
  ],
  [
    "How does the website analysis work?",
    "Submit a public website URL. The system extracts page signals and uses them to ground the analysis in what your business actually does.",
  ],
  [
    "Do I need to connect other tools?",
    "No. Start with your public website. You can create a complete first content plan without a spreadsheet or additional SEO setup.",
  ],
  [
    "Can I edit what the AI generates?",
    "Yes. Every outline can become a draft in the editor, where you can write, rewrite, or use AI on individual sections.",
  ],
];

const siteOrigin = siteBaseUrl.origin;
const logoUrl = new URL("/icon.svg", siteBaseUrl).toString();

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteOrigin}/#organization`,
      name: "Yoga Write Code",
      url: siteOrigin,
      logo: logoUrl,
    },
    {
      "@type": "WebSite",
      "@id": `${siteOrigin}/#website`,
      url: siteOrigin,
      name: "Yoga Write Code",
      publisher: { "@id": `${siteOrigin}/#organization` },
    },
    {
      "@type": "HowTo",
      name: "How Yoga Write Code turns your website into a content plan",
      step: steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.text,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-soft bg-brand-soft px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-brand">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      {children}
    </span>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-heading mt-4 text-3xl font-bold tracking-[-0.03em] text-ink sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-3 text-[15px] leading-7 text-ink-secondary">{description}</p> : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface font-sans text-ink">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden px-5 pb-16 pt-20 text-center sm:px-8 sm:pt-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[-150px] h-[420px] w-[900px] -translate-x-1/2 rounded-[50%] bg-brand-soft/40 blur-3xl"
          />
          <div className="relative mx-auto max-w-[1160px]">
            <Eyebrow>Start from your site, not a keyword</Eyebrow>
            <h1 className="font-heading mx-auto mt-6 max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-ink sm:text-6xl">
              Turn your website into your{" "}
              <span className="text-brand">next five articles.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[17px] leading-8 text-ink-secondary">
              Paste a URL. Get real content opportunities pulled from what your business actually does — then a brief and outline for each one.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-[10px] bg-brand px-5 py-3 text-sm font-semibold text-white shadow-pop transition hover:-translate-y-0.5 hover:bg-brand-hover"
              >
                Try it free <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#how"
                className="rounded-[10px] border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-line-strong"
              >
                See how it works
              </a>
            </div>
            <WorkflowPreview />
          </div>
        </section>

        <section id="how" className="bg-surface-subtle px-5 py-20 sm:px-8">
          <div className="mx-auto grid max-w-[1160px] items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow>The problem</Eyebrow>
              <h2 className="font-heading mt-5 max-w-md text-3xl font-bold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
                Content workflows are broken.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-7 text-ink-secondary">
                15 tools, 15 steps, days of work — just to ship one article. Teams lose momentum between research and writing, and briefs drift from the strategy they started with.
              </p>
            </div>
            <div className="space-y-2.5">
              {painPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 text-sm font-medium text-ink-secondary">
                  <span className="font-extrabold text-error">×</span>
                  {point}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-[1160px]">
            <SectionIntro
              eyebrow="The workflow"
              title="From URL to outline in 5 steps."
              description="Built for content operations. Not another point-solution SEO tool."
            />
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map((step) => (
                <article key={step.n} className="rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-1 hover:border-brand-soft hover:shadow-pop">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-sm font-extrabold text-brand">
                    {step.n}
                  </div>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.06em] text-ink-muted">Step {step.n}</p>
                  <h3 className="font-heading mt-1.5 text-[15px] font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-[13px] leading-5 text-ink-secondary">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="bg-surface-subtle px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-[1160px]">
            <SectionIntro eyebrow="What&apos;s inside" title="Everything you need. Nothing you don&apos;t." />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map(([title, text]) => (
                <article key={title} className="rounded-2xl border border-line bg-surface p-5">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-success-soft text-sm font-extrabold text-success">✓</span>
                  <h3 className="font-heading mt-4 text-[15px] font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-[13px] leading-5 text-ink-secondary">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div id="demo" className="border-y border-line bg-surface-subtle px-5 py-16 text-center sm:px-8">
          <Eyebrow>Live product preview</Eyebrow>
          <h2 className="font-heading mt-4 text-3xl font-bold tracking-[-0.03em] text-ink">Take a look inside the workspace.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-ink-secondary">
            See how your next content plan moves from a URL to a focused, writer-ready outline.
          </p>
        </div>

        <section className="bg-surface px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-[1160px]">
            <WorkspacePreview />
          </div>
        </section>

        <MarketingCta />

        <section id="faq" className="border-t border-line px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <SectionIntro eyebrow="Questions" title="Good to know." />
            <div className="divide-y divide-line border-y border-line">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {question}
                    <span className="text-xl font-normal leading-none text-ink-muted transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

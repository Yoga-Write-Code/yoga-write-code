import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WorkflowPreview } from "@/components/marketing/workflow-preview";
import { WorkspacePreview } from "@/components/marketing/workspace-preview";

export const metadata: Metadata = {
  title: "Yoga Write Code — Turn your website into your next five articles",
  description:
    "Paste a URL and get real content opportunities, topic clusters, SEO briefs, and article outlines grounded in your business.",
  alternates: { canonical: "https://yogawritecode.com" },
  openGraph: {
    title: "Yoga Write Code — AI Content Operating System",
    description:
      "Turn your website into your next five articles with a connected five-step content workflow.",
    url: "https://yogawritecode.com",
    siteName: "Yoga Write Code",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://yogawritecode.com/icon.svg",
        width: 108,
        height: 108,
        alt: "Yoga Write Code logo",
      },
    ],
  },
  twitter: {
    card: "summary",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://yogawritecode.com/#organization",
      name: "Yoga Write Code",
      url: "https://yogawritecode.com",
      logo: "https://yogawritecode.com/icon.svg",
    },
    {
      "@type": "WebSite",
      "@id": "https://yogawritecode.com/#website",
      url: "https://yogawritecode.com",
      name: "Yoga Write Code",
      publisher: { "@id": "https://yogawritecode.com/#organization" },
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

function MarketingMark() {
  return <Image src="/icon.svg" alt="" width={28} height={28} unoptimized />;
}

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ede9fe] bg-[#f5f3ff] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6d46f5]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#7c5cfc]" />
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
      <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-[#14141b] sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-3 text-[15px] leading-7 text-[#6b6b76]">{description}</p> : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#14141b]">
      <header className="sticky top-0 z-50 border-b border-[#eaeaef] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-[1160px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Yoga Write Code home">
            <MarketingMark />
            <span className="text-[15px] font-bold tracking-tight">Yoga Write Code</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#6b6b76] md:flex">
            <a href="#how" className="transition-colors hover:text-[#14141b]">How it works</a>
            <a href="#features" className="transition-colors hover:text-[#14141b]">Features</a>
            <a href="#demo" className="transition-colors hover:text-[#14141b]">Live demo</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden rounded-lg border border-[#eaeaef] bg-white px-3.5 py-2 text-xs font-semibold text-[#14141b] transition hover:border-[#b4b4be] sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[#6d46f5] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(109,70,245,0.24)] transition hover:bg-[#5b34e0]"
            >
              Try it free
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-5 pb-16 pt-20 text-center sm:px-8 sm:pt-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[-150px] h-[420px] w-[900px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(124,92,252,0.14),transparent_70%)]"
          />
          <div className="relative mx-auto max-w-[1160px]">
            <Eyebrow>Start from your site, not a keyword</Eyebrow>
            <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#14141b] sm:text-6xl">
              Turn your website into your{" "}
              <span className="text-[#6d46f5]">next five articles.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[17px] leading-8 text-[#6b6b76]">
              Paste a URL. Get real content opportunities pulled from what your business actually does — then a brief and outline for each one.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#6d46f5] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(109,70,245,0.25)] transition hover:-translate-y-0.5 hover:bg-[#5b34e0]"
              >
                Try it free <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#how"
                className="rounded-[10px] border border-[#eaeaef] bg-white px-5 py-3 text-sm font-semibold text-[#14141b] transition hover:-translate-y-0.5 hover:border-[#b4b4be]"
              >
                See how it works
              </a>
            </div>
            <WorkflowPreview />
          </div>
        </section>

        <section id="how" className="bg-[#fafafa] px-5 py-20 sm:px-8">
          <div className="mx-auto grid max-w-[1160px] items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow>The problem</Eyebrow>
              <h2 className="mt-5 max-w-md text-3xl font-extrabold leading-tight tracking-[-0.03em] text-[#14141b] sm:text-4xl">
                Content workflows are broken.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-7 text-[#6b6b76]">
                15 tools, 15 steps, days of work — just to ship one article. Teams lose momentum between research and writing, and briefs drift from the strategy they started with.
              </p>
            </div>
            <div className="space-y-2.5">
              {painPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-xl border border-[#eaeaef] bg-white px-4 py-3.5 text-sm font-medium text-[#3b3b45]">
                  <span className="font-extrabold text-[#e5594c]">×</span>
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
                <article key={step.n} className="rounded-2xl border border-[#eaeaef] bg-white p-5 transition hover:-translate-y-1 hover:border-[#ede9fe] hover:shadow-[0_4px_16px_rgba(20,20,27,0.06)]">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#f5f3ff] text-sm font-extrabold text-[#6d46f5]">
                    {step.n}
                  </div>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.06em] text-[#8b8b96]">Step {step.n}</p>
                  <h3 className="mt-1.5 text-[15px] font-bold text-[#14141b]">{step.title}</h3>
                  <p className="mt-2 text-[13px] leading-5 text-[#6b6b76]">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="bg-[#fafafa] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-[1160px]">
            <SectionIntro eyebrow="What&apos;s inside" title="Everything you need. Nothing you don&apos;t." />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map(([title, text]) => (
                <article key={title} className="rounded-2xl border border-[#eaeaef] bg-white p-5">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e3f8ec] text-sm font-extrabold text-[#18a857]">✓</span>
                  <h3 className="mt-4 text-[15px] font-bold text-[#14141b]">{title}</h3>
                  <p className="mt-2 text-[13px] leading-5 text-[#6b6b76]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div id="demo" className="border-y border-[#eaeaef] bg-[#f6f6f9] px-5 py-16 text-center sm:px-8">
          <Eyebrow>Live product preview</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-[#14141b]">Take a look inside the workspace.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-[#6b6b76]">
            See how your next content plan moves from a URL to a focused, writer-ready outline.
          </p>
        </div>

        <section className="bg-white px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-[1160px]">
            <WorkspacePreview />
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8">
          <div className="mx-auto max-w-[1160px] rounded-3xl bg-[#14141b] px-6 py-14 text-center shadow-[0_12px_32px_rgba(20,20,27,0.12)] sm:px-10">
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-white">See what it finds on your site.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-[#b4b4be]">
              Try the five-step workflow with your own website. Free while in beta, with a clear plan from the first analysis.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/signup" className="rounded-[10px] bg-white px-5 py-3 text-sm font-semibold text-[#14141b] transition hover:-translate-y-0.5">
                Try it free <span aria-hidden="true">→</span>
              </Link>
              <a href="mailto:hello@yogawritecode.com" className="rounded-[10px] border border-[#3a3a44] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#5a5a66]">
                Talk to us
              </a>
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-[#eaeaef] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <SectionIntro eyebrow="Questions" title="Good to know." />
            <div className="divide-y divide-[#eaeaef] border-y border-[#eaeaef]">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#14141b] [&::-webkit-details-marker]:hidden">
                    {question}
                    <span className="text-xl font-normal leading-none text-[#8b8b96] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b6b76]">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#eaeaef] px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <MarketingMark />
            <span className="text-sm font-bold">Yoga Write Code</span>
          </Link>
          <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.06em] text-[#8b8b96]">Product</p>
              <a href="#how" className="block py-1 text-[#6b6b76] hover:text-[#14141b]">How it works</a>
              <a href="#demo" className="block py-1 text-[#6b6b76] hover:text-[#14141b]">Live preview</a>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.06em] text-[#8b8b96]">Company</p>
              <a href="mailto:hello@yogawritecode.com" className="block py-1 text-[#6b6b76] hover:text-[#14141b]">Contact</a>
              <Link href="/" className="block py-1 text-[#6b6b76] hover:text-[#14141b]">About Yoga Write Code</Link>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.06em] text-[#8b8b96]">Legal</p>
              <Link href="/terms" className="block py-1 text-[#6b6b76] hover:text-[#14141b]">Terms</Link>
              <Link href="/privacy" className="block py-1 text-[#6b6b76] hover:text-[#14141b]">Privacy</Link>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1160px] flex-col gap-2 border-t border-[#eaeaef] pt-5 text-xs text-[#8b8b96] sm:flex-row sm:justify-between">
          <span>© 2026 Yoga Write Code. All rights reserved.</span>
          <span>Built for modern content teams.</span>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

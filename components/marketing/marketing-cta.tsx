import Link from "next/link";

type MarketingCtaProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function MarketingCta({
  title = "See what it finds on your site.",
  description = "Try the five-step workflow with your own website. Free while in beta, with a clear plan from the first analysis.",
  primaryLabel = "Try it free",
  primaryHref = "/signup",
  secondaryLabel = "Talk to us",
  secondaryHref = "mailto:hello@yogawritecode.com",
}: MarketingCtaProps) {
  return (
    <section className="font-sans px-5 pb-20 sm:px-8">
      <div className="mx-auto max-w-[1160px] rounded-surface bg-ink px-6 py-14 text-center shadow-pop sm:px-10">
        <h2 className="font-heading text-3xl font-bold tracking-[-0.03em] text-white">{title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-line-strong">{description}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href={primaryHref}
            className="rounded-control bg-surface px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5"
          >
            {primaryLabel} <span aria-hidden="true">→</span>
          </Link>
          <a
            href={secondaryHref}
            className="rounded-control border border-line-strong px-5 py-3 text-sm font-semibold text-white transition hover:border-ink-muted"
          >
            {secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

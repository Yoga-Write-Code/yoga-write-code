import Link from "next/link";
import { MarketingBrand } from "@/components/marketing/brand";
import { FooterSubscribe } from "@/components/marketing/footer-subscribe";

const footerLinks = [
  {
    title: "Features",
    links: [
      { label: "All Features", href: "/features" },
      { label: "Topic Clusters", href: "/features#topic-clusters" },
      { label: "SEO Briefs", href: "/features#seo-briefs" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Overview", href: "/solutions" },
      { label: "Agencies", href: "/solutions/agencies" },
      { label: "SaaS Founders", href: "/solutions#saas-founders" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "vs SurferSEO", href: "/compare/surfer-seo" },
      { label: "vs Frase", href: "/compare/frase" },
      { label: "vs Jasper", href: "/compare/jasper" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/resources/blog" },
      { label: "FAQs", href: "/resources/faqs" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface px-5 py-12 font-sans sm:px-8">
      <div className="mx-auto flex max-w-[1160px] flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <MarketingBrand />
          <p className="text-sm text-ink-secondary">Write at flow, growth with clarity.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-12 gap-y-6 text-sm">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
                {group.title}
              </p>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-1 text-ink-secondary transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-10 max-w-[1160px]">
        <FooterSubscribe />
      </div>
      <div className="mx-auto mt-10 flex max-w-[1160px] flex-col gap-2 border-t border-line pt-5 text-xs text-ink-muted sm:flex-row sm:justify-between">
        <span>&copy; 2026 Yoga Write Code. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/company/yogawritecode"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            LinkedIn
          </a>
          <a
            href="https://x.com/yogawritecode"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            X (Twitter)
          </a>
        </div>
      </div>
    </footer>
  );
}

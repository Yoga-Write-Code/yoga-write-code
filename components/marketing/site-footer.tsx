import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics/cookie-settings-button";
import { MarketingBrand } from "@/components/marketing/brand";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Live preview", href: "/#demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "mailto:hello@yogawritecode.com" },
      { label: "About Yoga Write Code", href: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface px-5 py-12 font-sans sm:px-8">
      <div className="mx-auto flex max-w-[1160px] flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <MarketingBrand />
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-12 gap-y-6 text-sm">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
                {group.title}
              </p>
              {group.links.map((link) =>
                link.href.startsWith("mailto:") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block py-1 text-ink-secondary transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block py-1 text-ink-secondary transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1160px] flex-col gap-2 border-t border-line pt-5 text-xs text-ink-muted sm:flex-row sm:justify-between">
        <span>© 2026 Yoga Write Code. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <CookieSettingsButton />
          <span>Built for modern content teams.</span>
        </div>
      </div>
    </footer>
  );
}

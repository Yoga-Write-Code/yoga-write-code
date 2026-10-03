import Link from "next/link";
import { MarketingBrand } from "@/components/marketing/brand";
import { MobileMenu } from "@/components/marketing/mobile-menu";

const navigationLeft = [
  { label: "How it works", href: "/#how" },
  { label: "Live demo", href: "/#demo" },
];

const navigationRight = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 font-sans backdrop-blur-md">
      <div className="relative mx-auto flex h-[68px] max-w-[1160px] items-center justify-center gap-14 px-5 sm:px-8">
        <nav className="hidden items-center gap-14 text-sm font-medium text-ink-secondary md:flex">
          {navigationLeft.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <MarketingBrand />
        <nav className="hidden items-center gap-14 text-sm font-medium text-ink-secondary md:flex">
          {navigationRight.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute right-5 flex items-center gap-2.5 sm:right-8">
          <MobileMenu />
          <Link
            href="/login"
            className="hidden rounded-control border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-line-strong sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="hidden rounded-control bg-brand px-3.5 py-2 text-xs font-semibold text-white shadow-pop transition-colors hover:bg-brand-hover sm:inline-flex"
          >
            Try it free
          </Link>
        </div>
      </div>
    </header>
  );
}

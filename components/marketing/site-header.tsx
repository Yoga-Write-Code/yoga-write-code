import Link from "next/link";
import { MarketingBrand } from "@/components/marketing/brand";

const navigation = [
  { label: "How it works", href: "/#how" },
  { label: "Features", href: "/#features" },
  { label: "Live demo", href: "/#demo" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 font-sans backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1160px] items-center justify-between px-5 sm:px-8">
        <MarketingBrand />

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-secondary md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="hidden rounded-control border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-line-strong sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-control bg-brand px-3.5 py-2 text-xs font-semibold text-white shadow-pop transition-colors hover:bg-brand-hover"
          >
            Try it free
          </Link>
        </div>
      </div>
    </header>
  );
}

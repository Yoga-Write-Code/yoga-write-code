"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { MarketingBrand } from "@/components/marketing/brand";

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { label: "Features", href: "/features" },
  { label: "Solutions", href: "/solutions" },
  { label: "Blog", href: "/resources/blog" },
  { label: "FAQs", href: "/resources/faqs" },
];

const megaMenu: Record<string, NavItem[]> = {
  Features: [
    { label: "Topic Clusters", href: "/features#topic-clusters" },
    { label: "SEO Briefs", href: "/features#seo-briefs" },
  ],
  Solutions: [
    { label: "Agencies", href: "/solutions/agencies" },
    { label: "SaaS Founders", href: "/solutions#saas-founders" },
  ],
};

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-[68px] max-w-[1160px] items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <MarketingBrand />
          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const hasChildren = megaMenu[item.label];
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasChildren && setOpenMega(item.label)}
                  onMouseLeave={() => setOpenMega(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 rounded-control px-3 py-2 text-sm font-medium text-ink-secondary transition-colors hover:text-ink"
                  >
                    {item.label}
                    {hasChildren ? <ChevronDown size={14} /> : null}
                  </Link>
                  {hasChildren && openMega === item.label ? (
                    <div className="absolute left-0 top-full min-w-[200px] rounded-card border border-line bg-surface p-2 shadow-pop">
                      {megaMenu[item.label]!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-control px-3 py-2 text-sm text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/login"
            className="rounded-control border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-line-strong"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-control bg-brand px-3.5 py-2 text-xs font-semibold text-white shadow-pop transition-colors hover:bg-brand-hover"
          >
            Signup
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-control p-2 text-ink-secondary transition-colors hover:bg-surface-subtle md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 top-[68px] z-40 bg-ink/30 md:hidden" onClick={() => setMobileOpen(false)}>
          <nav className="fixed inset-x-0 top-[68px] z-50 border-b border-line bg-surface px-5 py-4 shadow-pop">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex gap-2.5 border-t border-line pt-4">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-control border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="rounded-control bg-brand px-3.5 py-2 text-xs font-semibold text-white shadow-pop"
              >
                Signup
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

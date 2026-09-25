import type { ReactNode } from "react";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export function LegalDoc({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface font-sans text-ink">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-16">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
          Yoga Write Code
        </p>
        <h1 className="font-heading mt-4 text-4xl font-bold leading-tight tracking-tight text-ink">{title}</h1>
        <p className="mt-2 text-sm text-ink-muted">Last updated: {updated}</p>
        <div className="mt-10 space-y-10">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalSection({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-heading text-xl font-bold tracking-tight text-ink">
        {n}. {title}
      </h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-ink-secondary">{children}</div>
    </section>
  );
}
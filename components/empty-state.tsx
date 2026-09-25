import type { ReactNode } from "react";

export function EmptyState({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <section className="mt-8 rounded-card border border-dashed border-line-strong bg-surface px-8 py-12">
      <p className="font-sans text-lg font-semibold tracking-tight text-ink">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink-secondary">{message}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}
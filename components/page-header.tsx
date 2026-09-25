import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div className="min-w-0">
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-secondary">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex shrink-0 items-center gap-3">{children}</div> : null}
    </header>
  );
}
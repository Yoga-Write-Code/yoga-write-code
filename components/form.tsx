import type { ReactNode } from "react";

export const inputClass =
  "mt-1.5 h-10 w-full rounded-field border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft";

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink-secondary">
        {label}
      </label>
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  fullWidth = false,
}: {
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="submit"
      className={`inline-flex h-10 items-center justify-center rounded-field bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-wait disabled:opacity-60${
        fullWidth ? " w-full" : ""
      }`}
    >
      {children}
    </button>
  );
}

/** Hairline rule with a label, used to separate email sign-in from Google. */
export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-line" />
      <span className="text-xs text-ink-muted">or</span>
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}

export function SecondaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center justify-center rounded-field border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle"
    >
      {children}
    </button>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="rounded-control border-l-2 border-error bg-error-soft px-3 py-2 text-sm text-error">
      {message}
    </p>
  );
}
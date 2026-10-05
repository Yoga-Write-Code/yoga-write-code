import Link from "next/link";

/**
 * Cookie consent banner. Shown only while the visitor has not accepted or
 * declined, so it never blocks a returning visitor twice.
 */
export function AnalyticsConsentBanner({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-labelledby="analytics-consent-title"
      aria-describedby="analytics-consent-body"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl border border-line bg-surface p-4 shadow-pop sm:bottom-6 sm:p-5"
    >
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="hidden shrink-0 text-brand sm:block">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 12.8A9 9 0 1 1 11.2 2.5a4.5 4.5 0 0 0 5 5 4.5 4.5 0 0 0 5.3 5.3z" />
            <circle cx="9" cy="10" r="0.5" fill="currentColor" />
            <circle cx="14" cy="15" r="0.5" fill="currentColor" />
            <circle cx="10" cy="16" r="0.5" fill="currentColor" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p id="analytics-consent-title" className="sr-only">
            Cookie consent
          </p>
          <p id="analytics-consent-body" className="text-sm leading-6 text-ink">
            We use third-party cookies to personalize content, analyze site
            traffic, and improve the product.
          </p>
          <Link
            href="/privacy"
            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-ink-secondary underline-offset-2 hover:text-ink hover:underline"
          >
            Learn more
            <span aria-hidden="true">&rsaquo;</span>
          </Link>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onDecline}
            className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="inline-flex h-10 items-center justify-center rounded-field bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-ink/90"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}

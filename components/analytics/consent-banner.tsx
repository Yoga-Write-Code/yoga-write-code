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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface px-5 py-4 shadow-pop sm:px-8"
    >
      <div className="mx-auto flex max-w-[1160px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-[640px]">
          <p id="analytics-consent-title" className="text-sm font-semibold text-ink">
            Help us improve Yoga Write Code
          </p>
          <p id="analytics-consent-body" className="mt-1 text-sm text-ink-secondary">
            With your permission we use Google Analytics for page counts and Microsoft Clarity for
            anonymous recordings of how the site is used, on public pages only. Both stay off and set
            no cookies until you accept. Read our{" "}
            <Link
              href="/privacy"
              className="font-medium text-brand underline underline-offset-2 hover:text-brand-hover"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onDecline}
            className="inline-flex h-10 items-center justify-center rounded-field border border-line-strong bg-surface px-4 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-subtle"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="inline-flex h-10 items-center justify-center rounded-field bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

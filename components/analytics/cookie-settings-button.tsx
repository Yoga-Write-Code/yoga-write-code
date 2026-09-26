"use client";

import { clearAnalyticsConsent } from "@/lib/analytics";

/** Reopens the consent banner so a previous choice can be changed. */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={clearAnalyticsConsent}
      className="py-1 text-left text-ink-secondary transition-colors hover:text-ink"
    >
      Cookie settings
    </button>
  );
}

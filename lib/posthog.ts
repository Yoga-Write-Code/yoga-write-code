import posthog from "posthog-js";

let initialized = false;

/** Initialize PostHog once. Call only after the visitor accepts analytics cookies. */
export function initPostHog() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  posthog.init("phc_rCBwSrW7nsp8xoEtfFYeAQWUcR4Kj9GamEHzw2amJsrE", {
    api_host: "https://us.i.posthog.com",
    defaults: "2026-05-30",
  });
  capturePageView();
}

export { posthog };

/** Capture a $pageview with the current URL — no-op until PostHog is initialized. */
export function capturePageView() {
  if (!initialized || typeof window === "undefined") return;
  posthog.capture("$pageview", { $current_url: window.location.href });
}

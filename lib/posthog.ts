import posthog from "posthog-js";

let initialized = false;

/** Initialize PostHog once. Call only after the visitor accepts analytics cookies. */
export function initPostHog() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  posthog.init("phc_rCBwSrW7nsp8xoEtfFYeAQWUcR4Kj9GamEHzw2amJsrE", {
    api_host: "https://us.i.posthog.com",
    defaults: "2026-05-30",
    person_profiles: "always",
  });
  capturePageView();

  // Fire a deferred signup event if one was queued before init.
  try {
    const raw = sessionStorage.getItem("ph_signup_event");
    if (raw) {
      sessionStorage.removeItem("ph_signup_event");
      sessionStorage.setItem("ph_signup_tracked", "1");
      const { login_type } = JSON.parse(raw) as { login_type?: string };
      posthog.capture("user_signed_up", { login_type: login_type ?? "email", is_free_trial: true });
    }
  } catch {
    // ignore storage/parse issues
  }
}

export { posthog };

/** Capture a $pageview with the current URL — no-op until PostHog is initialized. */
export function capturePageView() {
  if (!initialized || typeof window === "undefined") return;
  posthog.capture("$pageview", { $current_url: window.location.href });
}

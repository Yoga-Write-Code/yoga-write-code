"use client";

import { useEffect } from "react";

/**
 * Marks that a signup just happened. PostHog reads this flag and fires
 * `user_signed_up` right after init (which only runs post-consent), so the
 * event is captured exactly once per browser session.
 */
export function SignupTracker({ loginType = "email" }: { loginType?: string }) {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("ph_signup_tracked")) return;
      sessionStorage.setItem("ph_signup_event", JSON.stringify({ login_type: loginType }));
    } catch {
      // ignore storage issues
    }
  }, [loginType]);

  return null;
}

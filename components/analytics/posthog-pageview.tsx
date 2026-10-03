"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { capturePageView } from "@/lib/posthog";

/** Fires a $pageview on first load and on every client-side route change. */
export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    capturePageView();
  }, [pathname, searchParams]);

  return null;
}

"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { AnalyticsConsentBanner } from "@/components/analytics/consent-banner";
import {
  clarityExcludedPaths,
  clarityMaskedSelectors,
  clarityProjectId,
  getConsentServerSnapshot,
  getConsentSnapshot,
  getHydratedSnapshot,
  getServerHydratedSnapshot,
  gtmContainerId,
  saveAnalyticsConsent,
  subscribeToConsent,
  subscribeToHydration,
  type ConsentDecision,
} from "@/lib/analytics";

/** False during server rendering and hydration, true once mounted in a browser. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );
}

/**
 * Google's Tag Manager loader, unchanged apart from the container ID.
 *
 * GTM's <noscript> fallback iframe is intentionally omitted. It only renders
 * when JavaScript is off, and with JavaScript off nobody can consent, so serving
 * it would fire the container's tags and drop its cookies for every such
 * visitor regardless of what they chose.
 *
 * GA4 is fired by the container rather than by gtag.js here, so pageviews are
 * counted once.
 */
function GoogleTagManager({ containerId }: { containerId: string }) {
  return (
    <Script id="gtm-loader" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${containerId}');
      `}
    </Script>
  );
}

/**
 * Microsoft's loader, followed by the privacy settings that must be queued in
 * the same tick so they are not dropped. `clarity` is defined synchronously by
 * the loader, so every `clarity(...)` call below is queued before the tag
 * arrives and replayed in order.
 */
function ClarityTags({ projectId }: { projectId: string }) {
  return (
    <Script id="clarity-init" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${projectId}");
        clarity("consentv2", { analytics: "granted", ad: "denied" });
        clarity("set", "mask", ${JSON.stringify(clarityMaskedSelectors)});
        clarity("set", "exclude", ${JSON.stringify(clarityExcludedPaths)});
      `}
    </Script>
  );
}

/**
 * Loads Google Tag Manager and Microsoft Clarity, but only after the visitor
 * accepts. Until then no third-party script is requested and no analytics or
 * session-recording cookie exists.
 */
export function TagManager() {
  const decision: ConsentDecision | null = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );
  const hydrated = useHydrated();

  // Keeps the banner and both tags out of the server HTML, so a returning
  // visitor never sees the banner flash before their stored choice is read.
  if (!hydrated) return null;

  const granted = decision === "granted";

  return (
    <>
      {granted && gtmContainerId ? <GoogleTagManager containerId={gtmContainerId} /> : null}
      {granted && clarityProjectId ? <ClarityTags projectId={clarityProjectId} /> : null}
      {decision === null ? (
        <AnalyticsConsentBanner
          onAccept={() => saveAnalyticsConsent("granted")}
          onDecline={() => saveAnalyticsConsent("denied")}
        />
      ) : null}
    </>
  );
}

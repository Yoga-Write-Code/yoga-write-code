"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { AnalyticsConsentBanner } from "@/components/analytics/consent-banner";
import {
  clarityExcludedPaths,
  clarityMaskedSelectors,
  clarityProjectId,
  gaMeasurementId,
  getConsentServerSnapshot,
  getConsentSnapshot,
  getHydratedSnapshot,
  getServerHydratedSnapshot,
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

function GoogleAnalyticsTags({ measurementId }: { measurementId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted',
            functionality_storage: 'granted',
            personalization_storage: 'granted',
            security_storage: 'granted'
          });
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
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
 * Loads Google Analytics and Microsoft Clarity, but only after the visitor
 * accepts. Until then no third-party script is requested and no analytics or
 * session-recording cookie exists.
 */
export function GoogleAnalytics() {
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
      {granted && gaMeasurementId ? (
        <GoogleAnalyticsTags measurementId={gaMeasurementId} />
      ) : null}
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

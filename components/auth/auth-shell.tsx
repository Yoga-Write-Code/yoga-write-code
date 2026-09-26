import type { ReactNode } from "react";
import { MarketingBrand } from "@/components/marketing/brand";
import { siteConfig, workflowSteps } from "@/lib/site";

/**
 * Split-screen shell shared by /login and /signup: the brand and the form on the
 * left, an on-brand panel on the right restating what the product does. The
 * panel is hidden below `lg`, where the form takes the full width.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-5 py-7 sm:px-10 sm:py-9">
        <MarketingBrand />

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-hover via-brand to-brand lg:flex lg:flex-col lg:justify-center lg:px-16">
        {/* Soft blurred blobs for depth, matching the homepage hero treatment. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-20 h-[460px] w-[460px] rounded-full bg-brand-soft/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 -left-24 h-[400px] w-[400px] rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative">
          <h2 className="font-heading max-w-md text-[2.5rem] font-bold leading-[1.05] tracking-[-0.04em] text-white">
            {siteConfig.ogHeadline}
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-white/75">
            Paste a URL. Get real content opportunities pulled from what your business actually
            does, then a brief and outline for each one.
          </p>

          <ul className="mt-9 flex flex-wrap gap-2">
            {workflowSteps.map((step) => (
              <li
                key={step}
                className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white"
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </main>
  );
}

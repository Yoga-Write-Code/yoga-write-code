import Link from "next/link";
import type { PlanStatus } from "@/lib/plan";

export function PlanBanner({ planStatus }: { planStatus: PlanStatus }) {
  if (planStatus.isPro && !planStatus.isTrialActive) return null;

  if (planStatus.isTrialActive) {
    return (
      <div className="mb-6 rounded-card border border-brand-soft bg-brand-soft/30 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">
              Trial active — {planStatus.daysLeftInTrial} day{planStatus.daysLeftInTrial !== 1 ? "s" : ""} left
            </p>
            <p className="mt-0.5 text-xs text-ink-secondary">
              Upgrade before your trial ends to keep Pro features.
            </p>
          </div>
          <Link
            href="/pricing"
            className="rounded-control bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-hover"
          >
            Upgrade now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-card border border-line bg-surface-subtle px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">Free plan</p>
          <p className="mt-0.5 text-xs text-ink-secondary">
            {planStatus.projectLimit} projects max · No export · Upgrade for unlimited access.
          </p>
        </div>
        <Link
          href="/pricing"
          className="rounded-control bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-hover"
        >
          Start 7-day free trial
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { DODO_PAYMENT_LINK } from "@/lib/dodo";

type BillingCycle = "monthly" | "yearly";

const STARTER_FEATURES = [
  { label: "50 Free AI Credits", included: true },
  { label: "1 Active Project", included: true },
  { label: "Full 5 Step Workflow", included: true },
  { label: "View only exports", included: false },
] as const;

const PRO_FEATURES = [
  { label: "Unlimited AI Credits", included: true },
  { label: "Unlimited Projects", included: true },
  { label: "Export to Markdown, PDF, Word", included: true },
  { label: "Priority AI Processing", included: true },
] as const;

function FeatureList({ features }: { features: ReadonlyArray<{ label: string; included: boolean }> }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {features.map((feature) => (
        <li key={feature.label} className="flex items-start gap-2.5 text-sm">
          {feature.included ? (
            <Check size={16} className="mt-0.5 shrink-0 text-success" />
          ) : (
            <X size={16} className="mt-0.5 shrink-0 text-ink-muted" />
          )}
          <span className={feature.included ? "text-ink-secondary" : "text-ink-muted"}>
            {feature.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function PricingPlans({
  isPro,
}: {
  monthlyPriceId?: string;
  yearlyPriceId?: string;
  isPro: boolean;
}) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const proPrice = cycle === "yearly" ? "$189" : "$19";
  const proUnit = cycle === "yearly" ? "/ year" : "/ month";

  return (
    <div>
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1">
          <button
            type="button"
            onClick={() => setCycle("monthly")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              cycle === "monthly" ? "bg-ink text-white" : "text-ink-secondary hover:text-ink"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setCycle("yearly")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              cycle === "yearly" ? "bg-ink text-white" : "text-ink-secondary hover:text-ink"
            }`}
          >
            Yearly
            <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="flex flex-col rounded-card border border-line bg-surface p-7">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">Starter</p>
          <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-ink">Free</h2>
          <p className="mt-5 flex items-baseline gap-2">
            <span className="font-sans text-4xl font-semibold tracking-tight text-ink">$0</span>
            <span className="text-sm text-ink-muted">/ forever</span>
          </p>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
            Everything to get started
          </p>
          <FeatureList features={STARTER_FEATURES} />
          <div className="mt-8 pt-2">
            <button
              type="button"
              disabled
              className="inline-flex h-11 w-full cursor-default items-center justify-center rounded-field border border-line bg-surface text-sm font-medium text-ink-muted"
            >
              Current Plan
            </button>
          </div>
        </section>

        <section className="relative flex flex-col rounded-card border-2 border-brand bg-surface p-7">
          <span className="absolute right-6 top-6 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand">
            Most Popular
          </span>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Pro Writer</p>
          <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-ink">
            Scale your strategy
          </h2>
          <p className="mt-5 flex items-baseline gap-2">
            <span className="font-sans text-4xl font-semibold tracking-tight text-ink">{proPrice}</span>
            <span className="text-sm text-ink-muted">{proUnit}</span>
          </p>
          <p className="mt-1 text-xs font-medium text-success">Includes a 7-day free trial</p>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
            Everything in starter, plus
          </p>
          <FeatureList features={PRO_FEATURES} />
          <div className="mt-8 pt-2">
            {isPro ? (
              <button
                type="button"
                disabled
                className="inline-flex h-11 w-full cursor-default items-center justify-center rounded-field border border-line bg-surface text-sm font-medium text-ink-muted"
              >
                Current Plan
              </button>
            ) : (<a
                href={DODO_PAYMENT_LINK}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-field bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
              >
                Start 7-day free trial
                <ArrowRight size={16} />
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

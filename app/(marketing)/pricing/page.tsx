import type { Metadata } from "next";
import Link from "next/link";
import { PricingPlans } from "@/components/pricing-plans";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for serious content teams. Cancel anytime.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  const monthlyPriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_MONTHLY ?? "";
  const yearlyPriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_YEARLY ?? "";

  return (
    <>
      <main className="bg-canvas">
        <div className="mx-auto max-w-[1160px] px-5 py-16 sm:px-8 sm:py-20">
          <h1 className="font-heading text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">
            Pricing
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-secondary">
            Simple, transparent pricing for serious content teams. Cancel anytime.
          </p>
          <p className="mt-3 max-w-xl text-sm text-ink-muted">
            Start with a 7-day free trial of Pro. No credit card required to begin. Free plan includes 2 projects and core features.
          </p>

          <div className="mt-10">
            <PricingPlans monthlyPriceId={monthlyPriceId} yearlyPriceId={yearlyPriceId} isPro={false} />
          </div>

          <p className="mt-8 text-xs text-ink-muted">
            Secure payments powered by Dodo Payments. Cancel anytime. By subscribing you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-ink">
              Terms
            </Link>
            ,{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-ink">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/refund-policy" className="underline underline-offset-4 hover:text-ink">
              Refund Policy
            </Link>
            .
          </p>
        </div>
      </main>
    </>
  );
}

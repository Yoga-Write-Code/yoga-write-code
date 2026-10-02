import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PricingPlans } from "@/components/pricing-plans";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Upgrade",
  robots: { index: false, follow: false },
};

export default async function PricingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  const { data: profile } = userData.user
    ? await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", userData.user.id)
        .maybeSingle()
    : { data: null };

  const profileRow = profile as { subscription_status?: string | null } | null;
  const isPro = profileRow?.subscription_status === "active";

  // Price IDs are server-only values passed to the client toggle as props.
  const monthlyPriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_MONTHLY ?? "";
  const yearlyPriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_YEARLY ?? "";

  return (
    <div className="min-w-0">
      <PageHeader
        title="Upgrade to Pro"
        description="Simple, transparent pricing for serious content teams. Cancel anytime."
      />

      <div className="mt-10">
        <PricingPlans
          monthlyPriceId={monthlyPriceId}
          yearlyPriceId={yearlyPriceId}
          isPro={isPro}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-xs text-ink-muted">
        <p>Secure payments powered by Paddle. Cancel anytime.</p>
        <Link
          href="/dashboard"
          className="font-medium text-ink-secondary transition-colors hover:text-ink"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

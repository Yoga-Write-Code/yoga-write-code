import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const userEmail = userData.user?.email ?? undefined;

  return (
    <div className="min-w-0">
      <PageHeader title="Checkout" description="Secure payment powered by Dodo Payments." />
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-ink-secondary">Loading checkout…</p>}>
          <CheckoutClient email={userEmail} />
        </Suspense>
      </div>
    </div>
  );
}

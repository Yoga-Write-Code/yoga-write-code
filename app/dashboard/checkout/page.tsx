import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="min-w-0">
      <PageHeader title="Checkout" description="Secure payment powered by Paddle." />
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-ink-secondary">Loading checkout…</p>}>
          <CheckoutClient />
        </Suspense>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Paddle } from "@paddle/paddle-js";
import { resolvePaddleEnvironment } from "@/lib/paddle";

export function CheckoutClient({ email }: { email?: string }) {
  const searchParams = useSearchParams();
  const priceId = searchParams.get("priceId") ?? "";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!priceId) {
      setError("No price selected. Please choose a plan first.");
      return;
    }

    let cancelled = false;

    async function start() {
      try {
        const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
        if (!token) throw new Error("Dodo Payments checkout is not configured.");

        const environment = resolvePaddleEnvironment(process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT);

        const { initializePaddle } = await import("@paddle/paddle-js");
        const paddle: Paddle | undefined = await initializePaddle({ token, environment });
        if (!paddle || cancelled) throw new Error("Dodo Payments checkout failed to load.");

        paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          ...(email ? { customer: { email } } : {}),
          settings: {
            displayMode: "inline",
            frameTarget: "dodo-checkout-frame",
            frameInitialHeight: 600,
            frameStyle: "width: 100%; min-height: 600px; border: none;",
            successUrl: "https://app.yogawritecode.com/welcome",
          },
        });
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not start checkout.");
      }
    }

    start();
    return () => {
      cancelled = true;
    };
  }, [priceId, email]);

  return (
    <div className="mx-auto w-full max-w-xl">
      {error ? (
        <p className="rounded-control border-l-2 border-error bg-error-soft px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}
      <div id="dodo-checkout-frame" className="w-full" />
    </div>
  );
}

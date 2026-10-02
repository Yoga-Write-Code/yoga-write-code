"use client";

import { useState } from "react";
import type { Paddle, PaddleEventData } from "@paddle/paddle-js";

const PAYMENT_SUCCESS_URL = "https://app.yogawritecode.com/dashboard/payment-success";

type PaddleCheckoutButtonProps = {
  priceId: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
};

export function PaddleCheckoutButton({
  priceId,
  children = "Upgrade to Pro",
  fullWidth = false,
}: PaddleCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openCheckout() {
    setError(null);
    setLoading(true);

    try {
      const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
      if (!token) {
        throw new Error("Paddle checkout is not configured.");
      }

      const environment =
        process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production"
          ? "production"
          : "sandbox";

      const { initializePaddle } = await import("@paddle/paddle-js");

      const paddle: Paddle | undefined = await initializePaddle({
        token,
        environment,
        eventCallback(event: PaddleEventData) {
          if (String(event.name) === "checkout.completed") {
            setLoading(false);
          }
        },
      });

      if (!paddle) {
        throw new Error("Paddle checkout failed to load. Please try again.");
      }

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        settings: {
          displayMode: "overlay",
          successUrl: PAYMENT_SUCCESS_URL,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setLoading(false);
    }
  }

  return (
    <div className={fullWidth ? "w-full" : undefined}>
      <button
        type="button"
        onClick={openCheckout}
        disabled={loading}
        className={`inline-flex h-11 items-center justify-center rounded-field bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-wait disabled:opacity-60${
          fullWidth ? " w-full" : ""
        }`}
      >
        {loading ? "Opening checkout…" : children}
      </button>
      {error ? (
        <p className="mt-2 rounded-control border-l-2 border-error bg-error-soft px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

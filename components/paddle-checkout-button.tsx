"use client";

import { useState } from "react";

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
      if (!priceId) throw new Error("Paddle checkout is not configured.");

      const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
      if (!token) throw new Error("Paddle checkout is not configured.");

      const { resolvePaddleEnvironment } = await import("@/lib/paddle");
      const environment = resolvePaddleEnvironment(process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT);

      const { initializePaddle } = await import("@paddle/paddle-js");
      const paddle = await initializePaddle({ token, environment });
      if (!paddle) throw new Error("Paddle checkout failed to load.");

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        settings: {
          displayMode: "overlay",
          variant: "one-page",
          successUrl: "https://app.yogawritecode.com/welcome",
        },
      });
      setLoading(false);
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

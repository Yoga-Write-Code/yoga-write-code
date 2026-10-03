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
    if (!priceId) {
      setError("Paddle checkout is not configured.");
      setLoading(false);
      return;
    }
    window.location.href = `/dashboard/checkout?priceId=${encodeURIComponent(priceId)}`;
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

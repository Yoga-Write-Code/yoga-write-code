"use client";

import { useTransition } from "react";

type PaddleCheckoutButtonProps = {
  priceId: string;
  children?: React.ReactNode;
  className?: string;
};

export function PaddleCheckoutButton({
  priceId,
  children,
  className,
}: PaddleCheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!priceId) throw new Error("Dodo Payments checkout is not configured.");

    startTransition(async () => {
      const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
      if (!token) throw new Error("Dodo Payments checkout is not configured.");

      const { resolvePaddleEnvironment } = await import("@/lib/paddle");
      const environment = resolvePaddleEnvironment(process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT);

      const { initializePaddle } = await import("@paddle/paddle-js");
      const paddle = await initializePaddle({ token, environment });

      if (!paddle) throw new Error("Dodo Payments checkout failed to load.");

      paddle.Checkout.open({
        settings: { displayMode: "inline", frameTarget: "dodo-checkout-frame" },
        items: [{ priceId, quantity: 1 }],
      });
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={className}
      >
        {children ?? "Upgrade to Pro"}
      </button>
      <div id="dodo-checkout-frame" className="w-full" />
    </>
  );
}

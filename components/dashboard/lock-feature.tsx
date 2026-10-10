"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

type LockFeatureProps = {
  isLocked: boolean;
  children: React.ReactNode;
};

export function LockFeature({ isLocked, children }: LockFeatureProps) {
  if (!isLocked) return <>{children}</>;

  return (
    <div className="group relative">
      <div className="pointer-events-none select-none opacity-50">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 rounded-field bg-brand px-4 py-2 text-xs font-semibold text-white shadow-pop transition hover:bg-brand-hover"
        >
          <Lock size={14} />
          Upgrade to Pro
        </Link>
      </div>
    </div>
  );
}

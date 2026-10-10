import type { User } from "@supabase/supabase-js";

export type Plan = "free" | "pro";

export const FREE_PROJECT_LIMIT = 2;
export const TRIAL_DAYS = 7;

export type PlanStatus = {
  plan: Plan;
  isPro: boolean;
  isTrialActive: boolean;
  trialEndsAt: Date | null;
  daysLeftInTrial: number;
  projectLimit: number;
  canExport: boolean;
  canCreateProject: boolean;
};

export function getPlanStatus(user: User | null, projectCount: number): PlanStatus {
  const isPro = (user?.user_metadata?.plan as Plan) === "pro";
  const trialEnd = user?.user_metadata?.trial_end
    ? new Date(user.user_metadata.trial_end as string)
    : null;

  const now = new Date();
  const isTrialActive = !isPro && trialEnd !== null && trialEnd > now;
  const daysLeftInTrial =
    isTrialActive && trialEnd
      ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / 86400000))
      : 0;

  const effectiveIsPro = isPro || isTrialActive;

  return {
    plan: isPro ? "pro" : isTrialActive ? "pro" : "free",
    isPro: effectiveIsPro,
    isTrialActive,
    trialEndsAt: trialEnd,
    daysLeftInTrial,
    projectLimit: effectiveIsPro ? Infinity : FREE_PROJECT_LIMIT,
    canExport: effectiveIsPro,
    canCreateProject: effectiveIsPro || projectCount < FREE_PROJECT_LIMIT,
  };
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { getUserDisplayName } from "@/lib/auth/user";
import { getPlanStatus } from "@/lib/plan";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const { data: profile } = data.user
    ? await supabase
        .from("profiles")
        .select("full_name, subscription_status")
        .eq("id", data.user.id)
        .maybeSingle()
    : { data: null };
  const name = data.user
    ? getUserDisplayName(data.user, profile?.full_name)
    : "Your account";
  const email = data.user?.email ?? "";
  const profileRow = profile as { subscription_status?: string | null } | null;
  const planStatus = getPlanStatus(data.user, 0, profileRow?.subscription_status);
  const isPro = planStatus.isPro;
  const planLabel = planStatus.isTrialActive
    ? `Pro Trial (${planStatus.daysLeftInTrial} days left)`
    : isPro
      ? "Pro Writer"
      : "Starter (Free)";

  return (
    <>
      <PageHeader title="Settings" description="Manage your account and preferences." />

      <div className="mt-8 space-y-6">
        <section className="rounded-card border border-line bg-surface p-6">
          <h2 className="font-sans text-lg font-semibold tracking-tight text-ink">Account</h2>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">Name</p>
              <p className="mt-1 text-sm text-ink">{name}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">Email</p>
              <p className="mt-1 text-sm text-ink">{email}</p>
            </div>
          </div>
        </section>

        <section className="rounded-card border border-line bg-surface p-6">
          <h2 className="font-sans text-lg font-semibold tracking-tight text-ink">Billing</h2>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">Plan</p>
              <p className="mt-1 text-sm text-ink">{planLabel}</p>
            </div>
            {!isPro ? (
              <Link
                href="/dashboard/pricing"
                className="inline-flex h-10 items-center justify-center rounded-field bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
              >
                Upgrade to Pro
              </Link>
            ) : (
              <Link
                href="/dashboard/pricing"
                className="text-sm font-medium text-brand underline underline-offset-4"
              >
                Manage plan
              </Link>
            )}
          </div>
          <p className="mt-4 border-t border-line pt-4 text-xs text-ink-muted">
            Payments are processed by Dodo Payments. Read our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-ink">
              Terms of Service
            </Link>
            ,{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-ink">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/refund-policy" className="underline underline-offset-4 hover:text-ink">
              Refund Policy
            </Link>
            .
          </p>
        </section>

        <section className="rounded-card border border-line bg-surface p-6">
          <h2 className="font-sans text-lg font-semibold tracking-tight text-ink">AI Features</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Yoga Write Code uses AI to analyze websites and generate content plans. All AI features
            are enabled by default and work automatically.
          </p>
        </section>

        <section className="rounded-card border border-line bg-surface p-6">
          <h2 className="font-sans text-lg font-semibold tracking-tight text-ink">Support</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Questions or feedback? Email us at support@yogawritecode.com.
          </p>
        </section>
      </div>
    </>
  );
}
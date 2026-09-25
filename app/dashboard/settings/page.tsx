import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { getUserDisplayName } from "@/lib/auth/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const name = data.user ? getUserDisplayName(data.user) : "Your account";
  const email = data.user?.email ?? "";

  return (
    <>
      <PageHeader title="Settings" description="Manage your account and preferences." />

      <div className="mt-8 space-y-6">
        <section className="rounded-card border border-line bg-surface p-6">
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink">Account</h2>
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
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink">AI Features</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Yoga Write Code uses AI to analyze websites and generate content plans. All AI features
            are enabled by default and work automatically.
          </p>
        </section>

        <section className="rounded-card border border-line bg-surface p-6">
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink">Support</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Questions or feedback? Email us at support@yogawritecode.com.
          </p>
        </section>
      </div>
    </>
  );
}
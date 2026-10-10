import type { Metadata } from "next";
import { Field, FormError, PrimaryButton, inputClass } from "@/components/form";
import { PageHeader } from "@/components/page-header";
import { PlanBanner } from "@/components/dashboard/plan-banner";
import { createProject } from "@/lib/projects/actions";
import { FREE_PROJECT_LIMIT, getPlanStatus } from "@/lib/plan";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true });

  const projectCount = count ?? 0;
  const planStatus = getPlanStatus(userData.user, projectCount);
  const isLocked = !planStatus.canCreateProject;

  return (
    <>
      <PlanBanner planStatus={planStatus} />
      <PageHeader
        title="New project"
        description="Name your project and tell us which website to analyze."
      />
      {isLocked ? (
        <div className="mt-8 max-w-md rounded-card border border-line bg-surface-subtle px-5 py-6 text-center">
          <p className="text-sm font-semibold text-ink">
            Free plan limit reached ({FREE_PROJECT_LIMIT} projects)
          </p>
          <p className="mt-1 text-sm text-ink-secondary">
            Upgrade to Pro for unlimited projects and all features.
          </p>
        </div>
      ) : (
        <form action={createProject} className="mt-8 max-w-md space-y-4">
          <FormError message={error} />
          <Field label="Project name" htmlFor="name">
            <input id="name" name="name" required placeholder="Yoga Write Code" className={inputClass} />
          </Field>
          <Field label="Website" htmlFor="website_url">
            <input
              id="website_url"
              name="website_url"
              type="url"
              required
              placeholder="https://yogawritecode.com"
              className={inputClass}
            />
          </Field>
          <div className="pt-2">
            <PrimaryButton>Create project</PrimaryButton>
          </div>
        </form>
      )}
    </>
  );
}

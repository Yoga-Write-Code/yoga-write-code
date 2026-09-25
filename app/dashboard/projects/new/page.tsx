import type { Metadata } from "next";
import { Field, FormError, PrimaryButton, inputClass } from "@/components/form";
import { PageHeader } from "@/components/page-header";
import { createProject } from "@/lib/projects/actions";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <PageHeader
        title="New project"
        description="Name your project and tell us which website to analyze."
      />
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
    </>
  );
}
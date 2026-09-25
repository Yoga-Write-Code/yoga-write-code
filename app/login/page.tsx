import type { Metadata } from "next";
import Link from "next/link";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { Field, FormError, PrimaryButton, inputClass } from "@/components/form";
import { login } from "@/lib/auth/actions";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-card border border-line bg-surface px-8 py-10">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
          Yoga Write Code
        </p>

        <h1 className="font-sans mt-3 text-2xl font-semibold tracking-tight text-ink">
          Log in
        </h1>

        <p className="mt-2 text-sm text-ink-secondary">
          Continue to your content workspace.
        </p>

        <div className="mt-5">
          <FormError message={error} />
        </div>

        <div className="mt-5">
          <GoogleAuthButton label="Continue with Google" />
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-xs text-ink-muted">or</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <form action={login} className="space-y-4">
          <Field label="Email" htmlFor="email">
            <input id="email" name="email" type="email" required className={inputClass} />
          </Field>

          <Field label="Password" htmlFor="password">
            <input id="password" name="password" type="password" required className={inputClass} />
          </Field>

          <PrimaryButton>Log in</PrimaryButton>
        </form>

        <p className="mt-4 text-xs text-ink-muted">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-4">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>

        <p className="mt-6 text-sm text-ink-secondary">
          No account?{" "}
          <Link href="/signup" className="font-medium text-brand underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { Field, FormError, OrDivider, PrimaryButton, inputClass } from "@/components/form";
import { login } from "@/lib/auth/actions";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell>
      <h1 className="font-sans text-2xl font-semibold tracking-tight text-ink">Log in</h1>
      <p className="mt-2 text-sm text-ink-secondary">
        New here?{" "}
        <Link
          href="/signup"
          className="font-medium text-brand underline underline-offset-4 hover:text-brand-hover"
        >
          Create an account
        </Link>
      </p>

      <div className="mt-5">
        <FormError message={error} />
      </div>

      <form action={login} className="mt-5 space-y-4">
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" required className={inputClass} />
        </Field>

        <Field label="Password" htmlFor="password">
          <input id="password" name="password" type="password" required className={inputClass} />
        </Field>

        <PrimaryButton fullWidth>Log in</PrimaryButton>
      </form>

      <OrDivider />

      <GoogleAuthButton label="Continue with Google" />

      <p className="mt-5 text-xs text-ink-muted">
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
    </AuthShell>
  );
}

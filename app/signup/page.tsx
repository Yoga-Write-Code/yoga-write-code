import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { Field, FormError, OrDivider, PrimaryButton, inputClass } from "@/components/form";
import { signup } from "@/lib/auth/actions";

export const metadata: Metadata = { title: "Sign up" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell>
      <h1 className="font-sans text-2xl font-semibold tracking-tight text-ink">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-ink-secondary">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-brand underline underline-offset-4 hover:text-brand-hover"
        >
          Log in
        </Link>
      </p>

      <div className="mt-5">
        <FormError message={error} />
      </div>

      <form action={signup} className="mt-5 space-y-4">
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" required className={inputClass} />
        </Field>

        <Field label="Password" htmlFor="password">
          <input id="password" name="password" type="password" required className={inputClass} />
          <p className="mt-1.5 text-xs text-ink-muted">At least 6 characters.</p>
        </Field>

        <PrimaryButton fullWidth>Sign up</PrimaryButton>
      </form>

      <OrDivider />

      <GoogleAuthButton label="Sign up with Google" />

      <p className="mt-5 text-xs text-ink-muted">
        By creating an account you agree to our{" "}
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

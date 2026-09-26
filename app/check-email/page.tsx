import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Check your email" };

export default function CheckEmailPage() {
  return (
    <AuthShell>
      <h1 className="font-sans text-2xl font-semibold tracking-tight text-ink">
        Check your email
      </h1>
      <p className="mt-2 text-sm text-ink-secondary">
        We sent a confirmation link to the address you signed up with. Open it to activate your
        account, then come back and log in.
      </p>

      <div className="mt-6 rounded-field border border-line bg-surface-subtle px-4 py-3 text-sm text-ink-secondary">
        Nothing after a few minutes? Check spam, or{" "}
        <Link
          href="/signup"
          className="font-medium text-brand underline underline-offset-4 hover:text-brand-hover"
        >
          sign up again
        </Link>{" "}
        with a different address.
      </div>

      <p className="mt-6 text-sm text-ink-secondary">
        Already confirmed?{" "}
        <Link
          href="/login"
          className="font-medium text-brand underline underline-offset-4 hover:text-brand-hover"
        >
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}

import type { Metadata } from "next";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Yoga Write Code team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-canvas">
        <div className="mx-auto max-w-2xl px-5 py-20 font-sans sm:px-8 sm:py-28">
          <h1 className="font-heading text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">
            Contact us
          </h1>
          <p className="mt-4 text-lg text-ink-secondary">
            Questions, feedback, or partnership ideas? We&apos;d love to hear from you.
          </p>

          <form action="mailto:hello@yogawritecode.com" method="post" encType="text/plain" className="mt-10 space-y-5">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-ink">Name</label>
              <input id="name" name="name" required className="mt-1.5 w-full rounded-field border border-line bg-surface px-3.5 py-2.5 text-sm text-ink" />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-ink">Email</label>
              <input id="email" name="email" type="email" required className="mt-1.5 w-full rounded-field border border-line bg-surface px-3.5 py-2.5 text-sm text-ink" />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium text-ink">Message</label>
              <textarea id="message" name="message" rows={5} required className="mt-1.5 w-full rounded-field border border-line bg-surface px-3.5 py-2.5 text-sm text-ink" />
            </div>
            <button type="submit" className="rounded-control bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-pop transition-colors hover:bg-brand-hover">
              Send message
            </button>
          </form>

          <p className="mt-8 text-sm text-ink-muted">
            Prefer email directly? Write to{" "}
            <a href="mailto:hello@yogawritecode.com" className="font-medium text-brand underline underline-offset-4">
              hello@yogawritecode.com
            </a>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

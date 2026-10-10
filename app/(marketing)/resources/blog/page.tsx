import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <h1 className="font-heading text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">
        SEO Blog
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-secondary">
        Insights on SEO content strategy, topic clusters, and building a scalable content operation.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
      >
        &larr; Back to Home
      </Link>
    </div>
  );
}

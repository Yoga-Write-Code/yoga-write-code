/**
 * Renders a JSON-LD structured data script. Use on server components only.
 * The "<" character is escaped so the payload can never break out of the
 * script tag (e.g. via a "</script>" substring).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * Derive display keywords when an opportunity has no stored target_keywords
 * (e.g. rows created before the keywords migration).
 */
export function deriveFallbackKeywords(title: string, max = 3): string[] {
  const base = title.split(/[:–—\-–|]/)[0]?.trim().toLowerCase() ?? "";
  if (!base) return [];
  const short = base.length > 60 ? `${base.slice(0, 60).trim()}…` : base;
  const words = short.split(/\s+/).filter(Boolean);
  const out = [short];
  if (words.length >= 2) {
    out.push(`how to ${short}`);
    out.push(`${short} guide`);
  }
  return out.slice(0, max);
}

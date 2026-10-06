export type KeywordGap = {
  keyword: string;
  title: string;
  url: string;
  score: number;
};

type TavilyResult = {
  title?: string;
  url?: string;
  score?: number;
  content?: string;
};

/**
 * Search Tavily for the opportunity topic and return the top competing pages.
 * Used as "keyword / traffic gap" signals for an opportunity.
 * Returns an empty array when no API key is configured or the request fails,
 * so analysis never breaks because enrichment is unavailable.
 */
export async function fetchKeywordGaps(query: string, limit = 5): Promise<KeywordGap[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey || !query.trim()) return [];

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic",
        max_results: limit,
      }),
    });
    if (!res.ok) {
      console.error("[tavily] search failed", res.status);
      return [];
    }
    const data = (await res.json()) as { results?: TavilyResult[] };
    return (data.results ?? [])
      .filter((r) => typeof r.url === "string" && typeof r.title === "string")
      .slice(0, limit)
      .map((r) => ({
        keyword: query,
        title: String(r.title),
        url: String(r.url),
        score: typeof r.score === "number" ? Math.round(r.score * 100) / 100 : 0,
      }));
  } catch (error) {
    console.error("[tavily] search error", error);
    return [];
  }
}

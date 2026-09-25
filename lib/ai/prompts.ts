export const PROMPT_VERSION = "2026-08-22";

const JSON_RULE =
  "Respond ONLY with valid JSON matching the requested shape. No markdown, no HTML, no commentary.";

export function websiteAnalysisPrompt(url: string, websiteText: string | null) {
  return `You are an SEO strategist. Website: ${url}.
${websiteText ? `Extracted page text (truncated): ${websiteText}` : "No extracted text available; infer from the URL and domain only."}
Return JSON with exactly this shape: { companySummary, productCategory, targetAudience, positioning, opportunities: [{ title, description, opportunityScore (0-100), difficulty ("low" | "medium" | "hard"), businessRelevance ("low" | "medium" | "high"), searchIntent ("informational" | "commercial" | "transactional" | "navigational"), funnelStage ("top" | "middle" | "bottom"), reason }] }.
Generate 3-5 specific opportunities grounded in the website signals.
${JSON_RULE}`;
}

export function topicClusterPrompt(
  ctx: { opportunityTitle: string; companySummary: string },
  websiteSignals?: string,
) {
  return `Opportunity: ${ctx.opportunityTitle}. Company: ${ctx.companySummary}.
${websiteSignals ? `Website signals: ${websiteSignals}\n` : ""}Return JSON: { pillarTopic, supportingTopics[], searchIntent, priority, internalLinkingSuggestions[] }.
${JSON_RULE}`;
}

export function seoBriefPrompt(
  ctx: { opportunityTitle: string; targetAudience: string },
  websiteSignals?: string,
) {
  return `Article opportunity: ${ctx.opportunityTitle}. Audience: ${ctx.targetAudience}.
${websiteSignals ? `Website signals: ${websiteSignals}\n` : ""}Return JSON: { primaryKeyword, searchIntent, targetAudience, suggestedHeadings[], questionsToAnswer[], entitiesToMention[], competitorInsights[] }.
${JSON_RULE}`;
}

export function articleOutlinePrompt(
  ctx: { opportunityTitle: string },
  websiteSignals?: string,
) {
  return `Write an article outline for: ${ctx.opportunityTitle}.
${websiteSignals ? `Website signals: ${websiteSignals}\n` : ""}Return JSON: { title, h1, sections: [{ heading, purpose, points[] }] }.
${JSON_RULE}`;
}

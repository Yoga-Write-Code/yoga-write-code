import { extractWebsiteSignals } from "./extract";
import type { AIProvider, AnalysisInput, OpportunityContext } from "./provider";
import {
  ArticleOutlineSchema,
  SeoBriefSchema,
  TopicClusterSchema,
  WebsiteAnalysisSchema,
} from "./schemas";

const delay = () => new Promise((resolve) => setTimeout(resolve, 800));
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function brandOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").split(".")[0] || "the product";
  } catch {
    return "the product";
  }
}

export class MockAIProvider implements AIProvider {
  async analyzeWebsite(input: AnalysisInput) {
    await delay();
    const s = await extractWebsiteSignals(input.websiteUrl);
    const brand = s.host.split(".")[0] || brandOf(input.websiteUrl);
    const Brand = cap(brand);
    const live = s.textLength > 0;

    const term1 = s.topTerms[0] ?? brand;
    const term2 = s.topTerms[1] ?? `${brand} setup`;
    const term3 = s.topTerms[2] ?? `${brand} pricing`;

    const haystack = `${s.title} ${s.metaDescription} ${s.topTerms.join(" ")}`.toLowerCase();
    const category =
      haystack.includes("shop") || haystack.includes("store") || haystack.includes("cart")
        ? "E-commerce"
        : haystack.includes("api") || haystack.includes("developer") || haystack.includes("docs")
          ? "Developer tools"
          : haystack.includes("blog") || haystack.includes("news")
            ? "Media / publishing"
            : "B2B SaaS";

    const companySummary = live
      ? `${s.title || Brand} (${s.host}). ${s.metaDescription || ""} Main sections on the page: ${
          s.headings.slice(0, 4).join("; ") || "product features"
        }. Dominant topics found in the page text: ${s.topTerms.slice(0, 5).join(", ")}.`
      : `Live page text for ${s.host} was unavailable (the site blocks crawlers or renders with JavaScript), so this is inferred from the domain only.`;

    return WebsiteAnalysisSchema.parse({
      companySummary,
      productCategory: category,
      targetAudience: `People searching for "${term1}" and "${term2}". Based on the page language, likely ${
        category === "E-commerce" ? "shoppers comparing options" : "practitioners and buyers evaluating solutions"
      } for ${brand}.`,
      positioning: `${Brand} leads with "${s.headings[0] ?? "its core value proposition"}" and repeats themes of ${term1} and ${term3} — a ${category.toLowerCase()} pitch aimed at evaluators, not beginners.`,
      opportunities: [
        {
          title: `${cap(term1)}: the practical guide for ${brand} users`,
          description: `Pillar content built around the site's most dominant topic ("${term1}").`,
          opportunityScore: 84,
          difficulty: "medium",
          businessRelevance: "high",
          searchIntent: "informational",
          funnelStage: "top",
          reason: `"${term1}" is the most frequent topic on the homepage — core to the site's messaging.`,
          keywords: [`${term1} guide`, `how to use ${term1}`, `${term1} for beginners`, `${term1} best practices`],
        },
        {
          title: `${cap(term1)} vs alternatives: an honest comparison`,
          description: `Comparison piece capturing commercial intent around ${term2}.`,
          opportunityScore: 76,
          difficulty: "hard",
          businessRelevance: "high",
          searchIntent: "commercial",
          funnelStage: "bottom",
          reason: `The page already discusses "${term2}"; comparison searches convert evaluators.`,
          keywords: [`${term1} vs alternatives`, `best ${term1} tools`, `${term2} comparison`],
        },
        {
          title: `How to get the most from ${term3}`,
          description: `Mid-funnel article for existing users, derived from the site's "${term3}" theme.`,
          opportunityScore: 68,
          difficulty: "easy",
          businessRelevance: "medium",
          searchIntent: "informational",
          funnelStage: "middle",
          reason: `Supports retention and links back to the "${term1}" pillar.`,
          keywords: [`${term3} tips`, `how to use ${term3}`, `${term3} tutorial`],
        },
      ],
    });
  }

  async generateCluster(input: OpportunityContext) {
    await delay();
    const s = await extractWebsiteSignals(input.websiteUrl);
    const term = input.opportunityTitle.split(":")[0].toLowerCase() || "the topic";
    return TopicClusterSchema.parse({
      pillarTopic: `The complete guide to ${term}`,
      supportingTopics:
        s.headings.slice(0, 4).length > 0
          ? s.headings.slice(0, 4)
          : [`What ${term} actually solves`, `Choosing the right plan`, `Migration without downtime`, `Measuring ROI`],
      searchIntent: "informational",
      priority: "high",
      internalLinkingSuggestions: [
        "Link every supporting article up to the pillar guide.",
        `Cross-link the comparison article into the "${term}" guide.`,
        "Add a pricing-page CTA from the pillar.",
      ],
    });
  }

  async generateBrief(input: OpportunityContext) {
    await delay();
    const s = await extractWebsiteSignals(input.websiteUrl);
    const brand = s.host.split(".")[0] || brandOf(input.websiteUrl);
    const keyword = input.opportunityTitle.split(":")[0].toLowerCase();
    return SeoBriefSchema.parse({
      primaryKeyword: keyword,
      searchIntent: "informational",
      targetAudience: input.targetAudience || `Evaluators of ${brand}.`,
      suggestedHeadings:
        s.headings.slice(0, 5).length > 0
          ? s.headings.slice(0, 5)
          : [`What is ${keyword}?`, `Who it's for`, `Step-by-step setup`, `Pricing and costs`, `Mistakes to avoid`],
      questionsToAnswer: [
        `What is ${keyword} in plain terms?`,
        `How long does setup take?`,
        `What does it cost at scale?`,
        `How does ${brand} compare to alternatives?`,
      ],
      entitiesToMention: [...s.topTerms.slice(0, 4), brand],
      competitorInsights: [
        "Competitors skip implementation detail — include a worked example.",
        "Most pages lack concrete numbers; add benchmarks.",
      ],
    });
  }

  async generateOutline(input: OpportunityContext) {
    await delay();
    const s = await extractWebsiteSignals(input.websiteUrl);
    const Brand = cap(s.host.split(".")[0] || brandOf(input.websiteUrl));
    const h2a = s.headings[0] ?? "Why teams struggle today";
    const h2b = s.headings[1] ?? "What changes with a real system";
    return ArticleOutlineSchema.parse({
      title: input.opportunityTitle,
      h1: `${Brand}: The Practical Guide`,
      sections: [
        {
          heading: h2a,
          purpose: "Open with the site's own primary theme to match reader intent.",
          points: ["Define the core problem", "Show who it affects", "Preview the solution"],
        },
        {
          heading: h2b,
          purpose: "Transition from pain to the product's value.",
          points: ["Core value plainly", "Proof and examples", "Who it's for"],
        },
        {
          heading: "Step-by-step setup",
          purpose: "The actionable core readers came for.",
          points: ["Create the workspace", "Import existing data", "Invite the team"],
        },
        {
          heading: "Mistakes to avoid",
          purpose: "Differentiate with honest advice.",
          points: ["Over-configuring early", "Ignoring documentation", "Skipping measurement"],
        },
      ],
    });
  }
}
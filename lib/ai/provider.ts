import { BedrockAIProvider } from "./bedrock";
import { MockAIProvider } from "./mock";
import type {
  ArticleOutlineResult,
  SeoBriefResult,
  TopicClusterResult,
  WebsiteAnalysisResult,
} from "./schemas";

export class AIError extends Error {
  code: "AI_PROVIDER_ERROR" | "AI_VALIDATION_ERROR" | "AI_RATE_LIMIT" | "AI_TIMEOUT" | "AI_EMPTY_RESPONSE";
  constructor(code: AIError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

export interface AnalysisInput {
  websiteUrl: string;
  websiteText: string | null;
}

export interface OpportunityContext {
  websiteUrl: string;
  opportunityTitle: string;
  opportunityDescription: string;
  companySummary: string;
  targetAudience: string;
}

export interface AIProvider {
  analyzeWebsite(input: AnalysisInput): Promise<WebsiteAnalysisResult>;
  generateCluster(input: OpportunityContext): Promise<TopicClusterResult>;
  generateBrief(input: OpportunityContext): Promise<SeoBriefResult>;
  generateOutline(input: OpportunityContext): Promise<ArticleOutlineResult>;
}

function configuredMode() {
  const configured = (
    process.env.AI_MODE ??
    process.env.AI_MOCK_MODE ??
    (process.env.BEDROCK_MODEL_ID ? "bedrock" : "mock")
  )
    .trim()
    .toLowerCase();

  return configured === "mock" || configured === "true" ? "mock" : "bedrock";
}

export function isMockAIMode() {
  return configuredMode() === "mock";
}

export function getAIProvider(): AIProvider {
  return isMockAIMode() ? new MockAIProvider() : new BedrockAIProvider();
}

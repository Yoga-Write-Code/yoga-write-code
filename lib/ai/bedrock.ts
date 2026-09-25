import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  type BedrockRuntimeClientConfig,
} from "@aws-sdk/client-bedrock-runtime";
import type { ZodType } from "zod";
import { extractWebsiteSignals } from "./extract";
import {
  articleOutlinePrompt,
  seoBriefPrompt,
  topicClusterPrompt,
  websiteAnalysisPrompt,
} from "./prompts";
import type { AIProvider, AnalysisInput, OpportunityContext } from "./provider";
import {
  ArticleOutlineSchema,
  SeoBriefSchema,
  TopicClusterSchema,
  WebsiteAnalysisSchema,
  type ArticleOutlineResult,
  type SeoBriefResult,
  type TopicClusterResult,
  type WebsiteAnalysisResult,
} from "./schemas";

const DEFAULT_MODEL_ID = "au.anthropic.claude-opus-4-6-v1";

const clientConfig: BedrockRuntimeClientConfig = {
  region: process.env.AWS_REGION?.trim() || "us-east-1",
};

// Do not pass an empty credentials object. That prevents the AWS SDK from
// using its normal credential chain (including Bedrock bearer tokens).
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const client = new BedrockRuntimeClient(clientConfig);

type GenerateOptions =
  | string
  | { user: string; maxTokens?: number; system?: string };

function modelId() {
  return process.env.BEDROCK_MODEL_ID?.trim() || DEFAULT_MODEL_ID;
}

async function invokeModel(
  userPrompt: string,
  maxTokens: number,
  systemPrompt?: string,
): Promise<string> {
  const body: Record<string, unknown> = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: userPrompt }],
  };

  if (systemPrompt) body.system = systemPrompt;

  const command = new InvokeModelCommand({
    modelId: modelId(),
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(body),
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body)) as {
    content?: Array<{ text?: string }>;
  };

  return responseBody.content?.[0]?.text?.trim() ?? "";
}

/**
 * Low-level text generation used by the editor as well as the structured
 * workflow provider. Keep this function independent of BedrockAIProvider so
 * provider methods can call it without recursion.
 */
export async function invokeBedrock(prompt: string, maxTokens = 2048): Promise<string> {
  return invokeModel(prompt, maxTokens);
}

export async function generateWithBedrock(options: GenerateOptions): Promise<string> {
  if (typeof options === "string") return invokeModel(options, 2048);

  return invokeModel(
    options.user,
    options.maxTokens ?? 2048,
    options.system,
  );
}

function stripFences(value: string) {
  return value
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function extractJsonObject(value: string): string {
  const cleaned = stripFences(value);
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("The AI response did not contain a JSON object.");
  }
  return cleaned.slice(start, end + 1);
}

function camelizeKey(key: string) {
  return key.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase());
}

function normalizeModelKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeModelKeys);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [camelizeKey(key), normalizeModelKeys(nested)]),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Accept the two common AI response shapes used by the prompts. */
function normalizeStructuredValue(value: unknown): unknown {
  const normalized = normalizeModelKeys(value);
  if (!isRecord(normalized)) return normalized;

  const record = { ...normalized };
  const opportunities =
    record.opportunities ??
    record.contentOpportunities ??
    record.content_opportunities;
  if (Array.isArray(opportunities)) {
    record.opportunities = opportunities.map((opportunity) => {
      if (!isRecord(opportunity)) return opportunity;
      const normalizedOpportunity = { ...opportunity };
      if (typeof normalizedOpportunity.opportunityScore === "string") {
        const score = Number(normalizedOpportunity.opportunityScore);
        if (Number.isFinite(score)) normalizedOpportunity.opportunityScore = score;
      }
      normalizedOpportunity.businessRelevance ??= "medium";
      if (normalizedOpportunity.difficulty === "easy") {
        normalizedOpportunity.difficulty = "low";
      }
      if (normalizedOpportunity.funnelStage === "awareness") {
        normalizedOpportunity.funnelStage = "top";
      } else if (normalizedOpportunity.funnelStage === "consideration") {
        normalizedOpportunity.funnelStage = "middle";
      } else if (normalizedOpportunity.funnelStage === "decision") {
        normalizedOpportunity.funnelStage = "bottom";
      }
      return normalizedOpportunity;
    });
  }

  if (record.competitorInsights !== undefined && !Array.isArray(record.competitorInsights)) {
    record.competitorInsights = [String(record.competitorInsights)];
  }

  return record;
}

async function structured<T>(
  schema: ZodType<T>,
  prompt: string,
  maxTokens: number,
): Promise<T> {
  let lastIssue = "The AI response did not match the expected format.";

  for (let attempt = 0; attempt < 2; attempt++) {
    const retryInstruction =
      attempt === 0
        ? ""
        : "\nThe previous response was invalid. Return one valid JSON object and no commentary.";

    try {
      const raw = await invokeBedrock(`${prompt}${retryInstruction}`, maxTokens);
      const candidate = normalizeStructuredValue(JSON.parse(extractJsonObject(raw)));
      const parsed = schema.safeParse(candidate);
      if (parsed.success) return parsed.data;

      lastIssue = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
    } catch (error) {
      lastIssue = error instanceof Error ? error.message : lastIssue;
    }
  }

  throw new Error(`AI response validation failed: ${lastIssue}`);
}

export class BedrockAIProvider implements AIProvider {
  async analyzeWebsite(input: AnalysisInput): Promise<WebsiteAnalysisResult> {
    const signals = await extractWebsiteSignals(input.websiteUrl);
    const websiteText = input.websiteText ?? JSON.stringify(signals);
    return structured(
      WebsiteAnalysisSchema,
      websiteAnalysisPrompt(input.websiteUrl, websiteText),
      4000,
    );
  }

  async generateCluster(input: OpportunityContext): Promise<TopicClusterResult> {
    const signals = await extractWebsiteSignals(input.websiteUrl);
    return structured(
      TopicClusterSchema,
      topicClusterPrompt(input, JSON.stringify(signals)),
      2000,
    );
  }

  async generateBrief(input: OpportunityContext): Promise<SeoBriefResult> {
    const signals = await extractWebsiteSignals(input.websiteUrl);
    return structured(
      SeoBriefSchema,
      seoBriefPrompt(input, JSON.stringify(signals)),
      3000,
    );
  }

  async generateOutline(input: OpportunityContext): Promise<ArticleOutlineResult> {
    const signals = await extractWebsiteSignals(input.websiteUrl);
    return structured(
      ArticleOutlineSchema,
      articleOutlinePrompt(input, JSON.stringify(signals)),
      3000,
    );
  }
}

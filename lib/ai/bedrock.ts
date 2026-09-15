import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

// CRITICAL: This MUST be an Inference Profile ID (starts with "us.")
// For Opus 4, use this exact ID:
const ACTIVE_MODEL_ID = "us.anthropic.claude-opus-4-20250514-v1:0";

// If you ever want to switch back to Sonnet 3.5, use this ID instead:
// const ACTIVE_MODEL_ID = "us.anthropic.claude-3-5-sonnet-20241022-v2:0";

type GenerateOptions = 
  | string 
  | { user: string; maxTokens?: number; system?: string };

export class BedrockAIProvider {
  async generate(options: GenerateOptions): Promise<string> {
    const userPrompt = typeof options === "string" ? options : options.user;
    const maxTokens = typeof options === "string" ? 2048 : (options.maxTokens ?? 2048);
    const systemPrompt = typeof options === "string" ? undefined : options.system;

    try {
      const body: any = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens,
        messages: [{ role: "user", content: userPrompt }],
      };
      
      if (systemPrompt) {
        body.system = systemPrompt;
      }

      const command = new InvokeModelCommand({
        modelId: ACTIVE_MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(body),
      });

      const response = await client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      return responseBody.content?.[0]?.text ?? "";
    } catch (error: any) {
      console.error("[Bedrock Error Details]", error?.name, error?.message);
      throw new Error(`Bedrock failed: ${error?.name || 'Unknown'} - ${error?.message || 'Check AWS credentials'}`);
    }
  }

  // Satisfy AIProvider interface expected by provider.ts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async analyzeWebsite(input: any): Promise<any> {
    return this.generate(JSON.stringify(input));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async generateCluster(input: any): Promise<any> {
    return this.generate(JSON.stringify(input));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async generateBrief(input: any): Promise<any> {
    return this.generate(JSON.stringify(input));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async generateOutline(input: any): Promise<any> {
    return this.generate(JSON.stringify(input));
  }
}

// Function export for sections.ts
export async function generateWithBedrock(options: GenerateOptions): Promise<string> {
  const provider = new BedrockAIProvider();
  return provider.generate(options);
}

// Function export for actions.ts
export async function invokeBedrock(prompt: string, maxTokens = 2048): Promise<string> {
  return generateWithBedrock({ user: prompt, maxTokens });
}
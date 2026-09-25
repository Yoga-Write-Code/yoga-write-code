import { z } from "zod";
import { generateWithBedrock } from "./bedrock";
import { extractWebsiteSignals } from "./extract";
import { isMockAIMode } from "./provider";

const SectionDraftSchema = z.object({ content: z.string().min(1) });

export type SectionInput = {
  websiteUrl: string;
  heading: string;
  purpose: string;
  points: string[];
  current?: string;
  mode: "draft" | "improve";
};

function promptFor(input: SectionInput, signalsText: string) {
  if (input.mode === "improve") {
    return `Improve this article section draft. Keep the author's intent, tighten sentences, and add specificity using the website context.
Section heading: ${input.heading}
Current draft:
${input.current ?? ""}
${signalsText}
Return JSON: { "content": markdown string for this one section }.`;
  }
  return `Write the draft for one article section in a calm, precise voice for a technical audience.
Section heading: ${input.heading}
Purpose: ${input.purpose}
Must cover: ${input.points.join("; ") || "the heading topic"}
${signalsText}
Return JSON: { "content": markdown string for this one section (short paragraphs and bullets) }.`;
}

export async function generateSection(input: SectionInput): Promise<string> {
  if (isMockAIMode()) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (input.mode === "improve" && input.current) {
      return `${input.current.trim()}\n\n- In practice, teams see the biggest wins from ${input.points[0] ?? "a clear process"} first.\n- Measure before and after to prove impact.`;
    }
    return `${input.purpose ? `${input.purpose}\n\n` : ""}${input.points
      .map((p) => `- ${p}`)
      .join("\n")}\n\n(Mock draft — set AI_MODE=bedrock for real writing.)`;
  }

  const signals = await extractWebsiteSignals(input.websiteUrl);
  const signalsText = `Website context: host ${signals.host}; page title: ${signals.title || "(none)"}; key terms: ${signals.topTerms.slice(0, 5).join(", ") || "(none)"}.`;

  for (let attempt = 0; attempt < 2; attempt++) {
    const raw = await generateWithBedrock({ user: promptFor(input, signalsText), maxTokens: 1200 });
    try {
      const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      const parsed = SectionDraftSchema.safeParse(JSON.parse(cleaned));
      if (parsed.success) return parsed.data.content;
    } catch {
      console.error("[sections] invalid JSON, retrying");
    }
    if (attempt === 1) throw new Error("AI section draft failed validation.");
  }
  throw new Error("AI section draft failed validation.");
}
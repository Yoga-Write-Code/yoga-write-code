export type ReadabilityIssueType = "passive" | "adverb" | "long-sentence" | "hard-sentence";

export type ReadabilityIssue = {
  type: ReadabilityIssueType;
  sentence: string;
};

export type ReadabilityReport = {
  wordCount: number;
  sentenceCount: number;
  gradeLevel: number | null;
  counts: Record<ReadabilityIssueType, number>;
  issues: ReadabilityIssue[];
};

const PASSIVE_RE =
  /\b(am|is|are|was|were|be|been|being)\s+(?:\w+ly\s+)?\w+(?:ed|en)\b/i;
const ADVERB_RE = /\b\w+ly\b/gi;

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  const groups = w.match(/[aeiouy]+/g);
  let count = groups ? groups.length : 1;
  if (w.endsWith("e") && count > 1) count -= 1;
  return Math.max(1, count);
}

export function analyzeReadability(text: string): ReadabilityReport {
  const sentences = splitSentences(text);
  const words = text.match(/[A-Za-z0-9']+/g) ?? [];
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const gradeLevel =
    wordCount > 0 && sentenceCount > 0
      ? Math.max(
          0,
          Math.round(
            0.39 * (wordCount / sentenceCount) +
              11.8 * (syllables / wordCount) -
              15.59
          )
        )
      : null;

  const counts: Record<ReadabilityIssueType, number> = {
    passive: 0,
    adverb: 0,
    "long-sentence": 0,
    "hard-sentence": 0,
  };
  const issues: ReadabilityIssue[] = [];

  for (const sentence of sentences) {
    const sentenceWords = sentence.match(/[A-Za-z0-9']+/g) ?? [];

    if (PASSIVE_RE.test(sentence)) {
      counts.passive += 1;
      issues.push({ type: "passive", sentence });
    }

    const adverbs = sentence.match(ADVERB_RE);
    if (adverbs && adverbs.length > 0) {
      counts.adverb += adverbs.length;
      issues.push({ type: "adverb", sentence });
    }

    if (sentenceWords.length > 30) {
      counts["long-sentence"] += 1;
      issues.push({ type: "long-sentence", sentence });
    }

    const avgSyllables =
      sentenceWords.reduce((sum, w) => sum + countSyllables(w), 0) /
      Math.max(1, sentenceWords.length);
    if (avgSyllables > 1.7 && sentenceWords.length > 12) {
      counts["hard-sentence"] += 1;
      issues.push({ type: "hard-sentence", sentence });
    }
  }

  return { wordCount, sentenceCount, gradeLevel, counts, issues };
}

export const ISSUE_LABELS: Record<ReadabilityIssueType, string> = {
  passive: "Passive voice",
  adverb: "Adverbs",
  "long-sentence": "Hard to read (30+ words)",
  "hard-sentence": "Very hard to read",
};

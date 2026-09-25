import { z } from "zod";

export const WebsiteAnalysisSchema = z.object({
  companySummary: z.string().min(1),
  productCategory: z.string().min(1),
  targetAudience: z.string().min(1),
  positioning: z.string().min(1),
  opportunities: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        opportunityScore: z.number().int().min(0).max(100),
        difficulty: z.enum(["easy", "low", "medium", "hard"]),
        businessRelevance: z.enum(["low", "medium", "high"]),
        searchIntent: z.enum(["informational", "commercial", "transactional", "navigational"]),
        funnelStage: z.enum(["top", "middle", "bottom"]),
        reason: z.string().min(1),
      })
    )
    .min(1)
    .max(10),
});

export const TopicClusterSchema = z.object({
  pillarTopic: z.string().min(1),
  supportingTopics: z.array(z.string().min(1)).min(1).max(12),
  searchIntent: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]),
  internalLinkingSuggestions: z.array(z.string().min(1)).min(1).max(10),
});

export const SeoBriefSchema = z.object({
  primaryKeyword: z.string().min(1),
  searchIntent: z.string().min(1),
  targetAudience: z.string().min(1),
  suggestedHeadings: z.array(z.string().min(1)).min(1).max(12),
  questionsToAnswer: z.array(z.string().min(1)).min(1).max(10),
  entitiesToMention: z.array(z.string().min(1)).min(1).max(15),
  competitorInsights: z.array(z.string().min(1)).max(10),
});

export const ArticleOutlineSchema = z.object({
  title: z.string().min(1),
  h1: z.string().min(1),
  sections: z
    .array(
      z.object({
        heading: z.string().min(1),
        purpose: z.string().min(1),
        points: z.array(z.string().min(1)).min(1).max(8),
      })
    )
    .min(2)
    .max(12),
});

export type WebsiteAnalysisResult = z.infer<typeof WebsiteAnalysisSchema>;
export type TopicClusterResult = z.infer<typeof TopicClusterSchema>;
export type SeoBriefResult = z.infer<typeof SeoBriefSchema>;
export type ArticleOutlineResult = z.infer<typeof ArticleOutlineSchema>;
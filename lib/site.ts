/**
 * Single source of truth for site-wide identity, canonical URL, and the copy
 * used in metadata and the generated Open Graph image.
 */
const siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yogawritecode.com";

export const siteConfig = {
  name: "Yoga Write Code",
  url: siteUrl,
  tagline: "AI content operating system for SaaS companies.",
  ogHeadline: "Turn your website into your next five articles",
} as const;

/** Absolute base used to resolve relative metadata URLs (og:image, canonical, ...). */
export const siteBaseUrl: URL = new URL(siteUrl);

/** Short workflow step labels, shown as pills in the generated OG image. */
export const workflowSteps: readonly string[] = [
  "Analyze",
  "Opportunities",
  "Clusters",
  "Briefs",
  "Outlines",
];

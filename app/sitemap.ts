import type { MetadataRoute } from "next";
import { siteBaseUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteBaseUrl.origin,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: new URL("/terms", siteBaseUrl).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: new URL("/privacy", siteBaseUrl).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}

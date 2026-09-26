import type { MetadataRoute } from "next";
import { siteBaseUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/login", "/signup", "/api/", "/auth/", "/editor"],
      },
    ],
    sitemap: new URL("/sitemap.xml", siteBaseUrl).toString(),
    host: siteBaseUrl.origin,
  };
}

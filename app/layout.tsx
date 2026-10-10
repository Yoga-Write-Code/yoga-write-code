import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { TagManager } from "@/components/analytics/tag-manager";
import { siteBaseUrl, siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  display: "swap",
  weight: "300 900",
});

export const metadata: Metadata = {
  // Resolves every relative metadata URL (og:image, twitter:image, icons) to an absolute URL.
  metadataBase: siteBaseUrl,
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description:
    "Yoga Write Code is an AI content operating system that turns your website into structured content planning — content opportunities, topic clusters, SEO briefs, and outlines.",
  keywords: [
    "AI content planning",
    "SEO content strategy",
    "content marketing",
    "topic clusters",
    "SEO briefs",
    "content outlines",
    "SaaS content",
    "content operations",
    "SEO workflow",
    "AI writing tool",
    "content calendar",
    "digital marketing",
  ],
  authors: [{ name: "Sachin Pandey", url: "https://sachinpandey.com.np" }],
  creator: "Sachin Pandey",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Turn your website into structured content planning — content opportunities, topic clusters, SEO briefs, and outlines.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Turn your website into structured content planning — content opportunities, topic clusters, SEO briefs, and outlines.",
    images: ["/opengraph-image"],
  },
  verification: {
    // Google Search Console ownership token. Unrelated to the GTM container ID,
    // which is loaded by <TagManager /> once the visitor accepts.
    google: "tL8-FZhkoHwlI57LESE58csCvMLzdQRxxCi6Cs6d7bc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${inter.variable} ${satoshi.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas font-sans text-ink antialiased">
        {children}
        <TagManager />
      </body>
    </html>
  );
}

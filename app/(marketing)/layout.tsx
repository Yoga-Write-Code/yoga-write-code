import type { Metadata } from "next";
import { TagManager } from "@/components/analytics/tag-manager";
import { SiteFooter } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/header";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Yoga Write Code",
    template: "%s · Yoga Write Code",
  },
  description:
    "Yoga Write Code is an AI content operating system that turns your website into structured content planning — content opportunities, topic clusters, SEO briefs, and outlines.",
};

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-canvas font-sans text-ink antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <TagManager />
      </body>
    </html>
  );
}

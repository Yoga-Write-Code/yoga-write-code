import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
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
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: siteConfig.tagline,
  icons: { icon: "/icon.svg" },
  // Inherited by every route. The image itself comes from app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    // Google Search Console ownership token. Unrelated to the GA4 measurement
    // ID, which is loaded by <GoogleAnalytics /> once the visitor accepts.
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
        <GoogleAnalytics />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  display: "swap",
  weight: "300 900",
});

export const metadata: Metadata = {
  title: { default: "Yoga Write Code", template: "%s · Yoga Write Code" },
  description: "AI content operating system for SaaS companies.",
  icons: { icon: "/icon.svg" },
  verification: {
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
      <body className="bg-canvas font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
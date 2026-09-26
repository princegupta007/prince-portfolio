import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Self-hosted by next/font — zero runtime requests to font CDNs (agent/rules/30-performance.md).
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  // wght is always included for variable fonts; axes lists the EXTRA ones only.
  axes: ["opsz", "wdth"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Interim metadata — full SEO set (canonical/OG/Twitter/JSON-LD) lands in Phase 8.
export const metadata: Metadata = {
  title: "Prince Gupta — Frontend Engineer",
  description:
    "Portfolio of Prince Gupta, Frontend Engineer (React.js, Next.js, TypeScript) — Jaipur, India.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { DotRail } from "@/components/layout/DotRail";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { NavProvider } from "@/components/interactive/NavProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { THEME_COOKIE } from "@/lib/constants";
import "./globals.css";

// Self-hosted by next/font — zero runtime requests to font CDNs (rule 30).
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  // wght is implicit for variable fonts; axes lists the extras only (D10).
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

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Deviation D1: theme cookie read at SSR → correct first paint, zero FOUC.
  const store = await cookies();
  const theme = store.get(THEME_COOKIE)?.value === "light" ? "light" : "dark";

  return (
    <html
      lang="en"
      data-theme={theme}
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ScrollProgress />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <ToastProvider>
          <NavProvider>
            <Header />
            <DotRail />
            <main id="main">{children}</main>
            <Footer />
          </NavProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

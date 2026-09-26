import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { DotRail } from "@/components/layout/DotRail";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { NavProvider } from "@/components/interactive/NavProvider";
import { InteractionLayer } from "@/components/interactive/InteractionLayer";
import { PaletteHost } from "@/components/interactive/PaletteHost";
import { Preloader } from "@/components/interactive/Preloader";
import { Reveal } from "@/components/interactive/Reveal";
import { TimelineFill } from "@/components/interactive/TimelineFill";
import { ToastProvider } from "@/components/ui/Toast";
import { THEME_COOKIE , SITE_ORIGIN } from "@/lib/constants";
import { JsonLd } from "@/components/seo/JsonLd";
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
/**
 * Pre-paint boot script (Phase 5, D19): marks <html> with `js` so the
 * reveal/line-mask hidden states can be JS-gated (no-JS visitors always see
 * complete content), and with `pg-pre` ONLY on the first view of a session —
 * the CSS hides #loader unless that class is present, so revisits and no-JS
 * loads never see the curtain. sessionStorage is wrapped for private mode.
 */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.className+=" js";try{if(!sessionStorage.getItem("pg-seen")){d.className+=" pg-pre";sessionStorage.setItem("pg-seen","1")}}catch(e){}})();`;

const TITLE = "Prince Gupta — Frontend Engineer · React.js, Next.js, TypeScript";
const DESCRIPTION =
  "Portfolio of Prince Gupta, Frontend Engineer (React.js, Next.js, TypeScript) — Jaipur, India. 3.5+ years shipping production admin platforms, marketplaces and real-time operational dashboards.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "Prince Gupta", url: SITE_ORIGIN }],
  creator: "Prince Gupta",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Prince Gupta — Frontend Engineer",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Prince Gupta — Frontend Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/og.png" }],
  },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0d" },
    { media: "(prefers-color-scheme: light)", color: "#f5f4ed" },
  ],
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
      // the boot script mutates <html> class before hydration (next-themes pattern)
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <JsonLd />
      </head>
      <body className="min-h-full">
        <Preloader />
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
          <PaletteHost />
        </ToastProvider>
        <Reveal />
        <InteractionLayer />
        <TimelineFill />
      </body>
    </html>
  );
}

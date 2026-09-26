/**
 * Public, CV-backed constants (source: agent/context/cv-source.md — verbatim CV).
 * Nothing here is secret; everything here is rendered somewhere on the site.
 * Do NOT add client/project names — see agent/rules/10-content-policy.md.
 */

/**
 * Canonical origin (Phase 8, D32): owner-set NEXT_PUBLIC_SITE_URL in production;
 * Vercel preview hosts fall back to their own URL so previews never leak the
 * production canonical; local builds use the documented placeholder.
 */
export const SITE_ORIGIN: string =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://princegupta.dev");
/** @deprecated use SITE_ORIGIN */
export const SITE_URL: string = SITE_ORIGIN;

export const CONTACT = {
  name: "Prince Gupta",
  role: "Frontend Engineer",
  location: "Jaipur, Rajasthan, India",
  email: "princegupta98299@gmail.com",
  emailHref: "mailto:princegupta98299@gmail.com",
  phone: "+91 99828 44166",
  /** CV phone, WhatsApp shares the same number (owner-confirmed) — wa.me needs digits only. */
  whatsapp: "https://wa.me/919982844166",
  phoneHref: "tel:+919982844166",
  github: "https://github.com/princegupta007",
  linkedin: "https://www.linkedin.com/in/princegupta7",
} as const;

export const AVAILABILITY = {
  status: "Open to opportunities",
  notice: "30 days (negotiable to 15)",
} as const;

/** Served from public/cv/ — copied verbatim from docs/cv/ in Phase 1. */
export const CV_PATH = "/cv/Prince_Gupta_Frontend_Engineer.pdf";

export const THEME_COOKIE = "pg-theme";

/**
 * Owner add-on 3 (portrait): set to "/portrait.jpg" the moment the owner's
 * headshot is committed to public/. Null = feature fully off (nothing renders,
 * no JSON-LD image) so the build stays green without the asset.
 */
export const PORTRAIT_SRC: string | null = "/portrait.jpg";

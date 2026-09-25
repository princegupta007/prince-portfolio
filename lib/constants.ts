/**
 * Public, CV-backed constants (source: agent/context/cv-source.md — verbatim CV).
 * Nothing here is secret; everything here is rendered somewhere on the site.
 * Do NOT add client/project names — see agent/rules/10-content-policy.md.
 */

/** Canonical origin. Empty locally; Phase 8 metadata falls back to VERCEL_URL on previews. */
export const SITE_URL: string = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export const CONTACT = {
  name: "Prince Gupta",
  role: "Frontend Engineer",
  location: "Jaipur, Rajasthan, India",
  email: "princegupta98299@gmail.com",
  emailHref: "mailto:princegupta98299@gmail.com",
  phone: "+91 99828 44166",
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

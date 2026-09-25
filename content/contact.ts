import type { ContactRow } from "./types";

/**
 * 09 · Contact — lines h2, giant mailto with highlighter hover, CTA row,
 * availability strip and contact rows. Values mirror lib/constants.ts
 * (CONTACT / AVAILABILITY) so there is a single source per fact.
 */

export const CONTACT_HEAD = {
  idx: "09",
  meta: "Available for frontend & full-stack roles", // CV: "Open to opportunities"
  /** h2 line-mask: "Let's build" solid + "something real." outline. */
  titleLines: ["Let's build", "something real."],
  outlineLine: 2,
} as const;

// CV: Summary/openness — frontend or full-stack, complex products; remote /
//     hybrid / on-site in India; 30-day notice negotiable to 15
export const CONTACT_LEDE =
  "I'm looking for frontend or full-stack roles where the product is complex and the interface carries real weight — **admin platforms, marketplaces, operational tooling**. Open to **remote, hybrid or on-site** in India. **30-day notice, negotiable to 15.**" as const;

/** Giant mailto — split so the "@" gets its own span (prototype .at). */
export const BIG_EMAIL = {
  user: "princegupta98299",
  at: "@",
  domain: "gmail.com",
} as const;

export const CONTACT_CTA = {
  start: { label: "Start a conversation", variant: "primary", icon: "mail" },
  copy: { label: "Copy email", variant: "ghost", icon: "copy" },
  cv: { label: "Download CV", variant: "ghost", icon: "download" },
} as const;

export const CONTACT_AVAIL = {
  b: "Open to opportunities", // CV: "Open to opportunities"
  small: "Remote · Hybrid · On-site — 30 days' notice (negotiable to 15)", // CV: notice period line
} as const;

// Rows mirror lib/constants.ts CONTACT + CV summary facts.
export const CONTACT_ROWS: ContactRow[] = [
  {
    kind: "email",
    label: "Email",
    value: "princegupta98299@gmail.com", // CV: email
    href: "mailto:princegupta98299@gmail.com",
    copyable: true,
    hint: "click to copy",
  },
  {
    kind: "phone",
    label: "Phone",
    value: "+91 99828 44166", // CV: phone
    href: "tel:+919982844166",
    numeric: true,
  },
  {
    kind: "linkedin",
    label: "LinkedIn",
    value: "/in/princegupta7", // CV: LinkedIn
    href: "https://www.linkedin.com/in/princegupta7/",
    external: true,
  },
  {
    kind: "github",
    label: "GitHub",
    value: "@princegupta007", // CV: GitHub
    href: "https://github.com/princegupta007",
    external: true,
  },
  { kind: "location", label: "Location", value: "Jaipur, Rajasthan, India" }, // CV: location
  {
    kind: "experience",
    label: "Experience",
    value: "3.5+ years · Jan 2023 – present",
  }, // CV: summary
  { kind: "focus", label: "Focus", value: "React.js · Next.js · TypeScript" }, // CV: headline stack
];

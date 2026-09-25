import type { Principle } from "./types";

/**
 * 06 · How I work — four rules, each with an evidence line that traces to
 * shipped CV facts. Hover lift is CSS-only (Phase 4); no JS.
 */

export const PRINCIPLES_HEAD = {
  idx: "06",
  title: "How I work",
  meta: "Four rules · each traceable to shipped work",
} as const;

export const PRINCIPLES: Principle[] = [
  {
    num: "01",
    title: "Security belongs on the server",
    // CV: Konstant — server-enforced RBAC on every endpoint
    desc: "Permission logic is enforced on every endpoint before a response is shaped. The interface reflects what a role can do — it never pretends to be the gate. Hiding a button is presentation; checking the caller is security.",
    evidence: "Server-enforced RBAC · 4 roles · 5,000+ users",
  },
  {
    num: "02",
    title: "Reuse before rebuild",
    // CV: Konstant — Turborepo shared packages, 5+ views, 3+ apps
    desc: "Shared components live in a Turborepo monorepo — one library powering 5+ admin views across 3+ applications. Fewer places for the UI to drift, faster onboarding for the next surface, and refactors that land everywhere at once.",
    evidence: "Turborepo monorepo · 3+ apps · 5+ views",
  },
  {
    num: "03",
    title: "Performance is measured, not assumed",
    // CV: Konstant — ~30% bundle cut; SSR on Vercel
    desc: "Route-based code-splitting, lazy loading and dependency pruning took one product's initial bundle down ~30%; SSR gives marketing surfaces their own crawlable, cacheable life. Numbers first, then optimise.",
    evidence: "~30% bundle cut · SSR on Vercel",
  },
  {
    num: "04",
    title: "Ship, then sharpen",
    // CV: Freelance — full product to production in 8 weeks, tested components
    desc: "A full product — admin panel, public site and API — reached production in 8 weeks as sole developer, with tested components and peer review along the way. Momentum matters; so does not shipping brittle code behind it.",
    evidence: "8 weeks to production · Jest + RTL coverage",
  },
];

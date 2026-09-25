import type { BentoTile } from "./types";

/**
 * 03 · What I build — bento grid (spans 8 · 4/4/4/4 · 6/6) + the 03·B
 * wiring schematic lives in content/wiring.ts. Copy verbatim from the
 * approved prototype; every fact traces to the CV.
 */

export const EXPERTISE_HEAD = {
  idx: "03",
  title: "What I build",
  meta: "Seven things I'm hired for",
} as const;

export const EXPERTISE_INTRO = {
  // CV: six client products (Konstant) + own product (freelance)
  lead: "Across six client products and one platform of my own, the work keeps landing in the same places: complex interfaces where **permissions, state and performance** carry real weight.",
  /** The word "CV" renders as a download link to the public CV PDF. */
  cvLine: {
    before: "The detailed breakdown lives in the ",
    link: "CV",
    after: " — this is the shape of it.",
  },
} as const;

/** Role mini-grid inside the feature tile — rendered all-lit (static). */
// CV: Konstant bullet — "server-enforced RBAC model for 4 roles with separate
//     dashboards and permission-based UI rendering"
export const FEATURE_ROLES = [
  { label: "Super", note: "Full control plane" },
  { label: "Admin", note: "Operations, read-only pricing" },
  { label: "Company", note: "Own records only" },
  { label: "Partner", note: "Read-only access" },
] as const;

export const EXPERTISE_TILES: BentoTile[] = [
  {
    span: "wide",
    ic: "shield",
    code: "E — 01",
    title: "Server-enforced access control & permission-driven UIs",
    // CV: Konstant — 4-role RBAC, endpoint-level enforcement, permission-based
    //     UI, role-scoped visibility, masked contacts
    desc: "RBAC models for **4 roles** — Super Admin, Admin, Company, Partner — enforced strictly **server-side on every API endpoint** **and** **reflected in the UI**: separate dashboards per role, permission-based rendering, role-scoped data visibility, and contact fields masked where a role shouldn't see them.",
    ev: [
      "4 roles",
      "Endpoint-level checks",
      "Permission-based UI",
      "JWT sessions",
    ],
  },
  {
    span: "third",
    ic: "grid",
    code: "E — 02",
    title: "Admin platforms & internal tools",
    // CV: Konstant — 22-module super admin panel, EN/AR CMS; SSTPL — 5+ internal tools
    desc: "Multi-module back-office products operators run the business in — one super-admin panel carried **22 modules**: user management, approvals, enquiries, notifications, ads, and a bilingual English/Arabic CMS.",
    ev: ["22 modules", "EN / AR CMS", "Multi-site provisioning"],
  },
  {
    span: "third",
    ic: "bag",
    code: "E — 03",
    title: "Marketplace & transaction workflows",
    // CV: Konstant — bid-to-hire flows, seller onboarding (4 document uploads),
    //     6-step listing wizard, orders (8 statuses), RFQs (6 statuses)
    desc: "Bid-to-hire flows, seller onboarding with **4 document uploads** and admin approval, 6-step listing wizards, and order / RFQ management across **8 + 6 statuses**.",
    ev: ["8 order states", "6 RFQ states", "Onboarding flows"],
  },
  {
    span: "third",
    ic: "signal",
    code: "E — 04",
    title: "Real-time interfaces",
    // CV: Konstant — WebSockets, optimistic updates w/ rollback, live roster
    //     updates for ~40 seasonal instructors
    desc: "Bids, chats and staff rosters pushed over **WebSockets** — optimistic updates that roll back on server rejection, and live shift updates reaching ~40 seasonal instructors.",
    ev: ["WebSockets", "Optimistic UI", "Rollback-safe"],
  },
  {
    span: "third",
    ic: "perf",
    code: "E — 05",
    title: "Performance & frontend architecture",
    // CV: Konstant — ~30% bundle cut, Next.js SSR on Vercel, Turborepo monorepo 3+ apps
    desc: "Route-based code-splitting, lazy loading and dependency pruning cut an initial bundle **~30%**; SSR marketing surfaces on Next.js App Router; shared packages in a **Turborepo monorepo** reused across 3+ apps.",
    ev: ["~30% lighter", "SSR · Vercel", "Turborepo"],
  },
  {
    span: "half",
    ic: "sliders",
    code: "E — 06",
    title: "Subscriptions & feature gating",
    // CV: Konstant — subscription plans 10/100/unlimited, feature flags, 3 tiers
    desc: "Plan selection and renewal screens for sellers, plan and pricing configuration for admins, and plan-based limits — **10 / 100 / unlimited** — with feature flags gating participation, sample requests and listing visibility across **3 tiers**.",
    ev: ["3 tiers", "Feature flags", "Plan limits", "Renewal flows"],
  },
  {
    span: "half",
    ic: "db",
    code: "E — 07",
    title: "Full-stack when it counts",
    // CV: Konstant — 20 NestJS REST endpoints, PostgreSQL/Prisma; SSTPL — Django
    //     service ingestion, JWT across 5+ tools
    desc: "Frontend-first, backend-capable: **20 REST endpoints in NestJS** over PostgreSQL with Prisma — owning queries and schema changes — plus Express APIs with JWT auth, and Django-ingested event pipelines earlier in the career.",
    ev: [
      "NestJS · Express",
      "PostgreSQL · Prisma",
      "REST · JWT",
      "20 endpoints",
    ],
  },
];

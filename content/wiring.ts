import type { WiringNode } from "./types";

/**
 * 03·B · How it's wired — the schematic. 10 nodes across 3 bands with
 * 2 labelled buses. Phase 4: click + ←/→ selection, sticky detail panel,
 * NO auto-cycle (Phase 5). Panel SSR-renders node 01 for no-JS.
 */

export const WIRING_HEAD = {
  idx: "03·B",
  title: "How it's wired — anatomy of the work",
  meta: "Select a node · ← → keys also move", // Phase 5 restores "or let it cycle"
} as const;

export const WIRING_INTRO =
  "The grid above is **what** I deliver; this schematic is **how** it holds together — the ten places my work actually lands, layered the way I build: interface on top, state and data in the middle, platform underneath. Every node carries shipped evidence." as const;

export const WIRING_BANDS = [
  { title: "Interface", sub: "what users touch" },
  { title: "State & data", sub: "what drives it" },
  { title: "Platform", sub: "what keeps it shipping" },
] as const;

/** Bus labels rendered between band 1→2 and band 2→3. */
export const WIRING_BUS = [
  "events · props · rendered permissions",
  "queries · tokens · socket frames",
] as const;

// All ten nodes trace to CV bullets (Konstant / SSTPL / freelance) — see
// agent/context/cv-source.md. Proof lines restate CV-shipped facts only.
export const WIRING_NODES: WiringNode[] = [
  {
    id: "ui",
    band: 1,
    ic: "ui",
    title: "UI / UX layer",
    sub: "permission-based · responsive · EN/AR",
    // CV: Konstant — permission-based UI rendering; EN/AR CMS; responsive dashboards
    desc: "Interfaces that reshape per role and per locale: permission-based rendering, responsive layouts from phone to ops desk, and bilingual English/Arabic content served from the same CMS.",
    ev: ["Permission-based UI", "Responsive design", "EN / AR CMS"],
    proof:
      "Role-scoped dashboards and masked contact fields rendered straight from server permissions.",
  },
  {
    id: "comp",
    band: 1,
    ic: "comp",
    title: "Component architecture",
    sub: "shared library · 5+ views · 3+ apps",
    // CV: Konstant — component library reused across 5+ admin views; Turborepo 3+ apps
    desc: "A shared component library extracted into Turborepo packages — one source of truth reused across 5+ admin views and 3+ applications, so the interface can't drift between products.",
    ev: ["Shared library", "Turborepo packages", "5+ admin views"],
    proof: "One library powering 5+ admin views across 3+ applications.",
  },
  {
    id: "perf",
    band: 1,
    ic: "perf",
    title: "Performance to pixel",
    sub: "SSR · splitting · ~30% lighter",
    // CV: Konstant — ~30% initial bundle cut; Next.js SSR marketing app on Vercel
    desc: "SSR for crawlable marketing surfaces; route-based code-splitting, lazy loading and dependency pruning inside the app — measured against the bundle, never assumed.",
    ev: ["SSR", "Code-splitting", "~30% bundle cut"],
    proof: "Initial bundle cut ~30% on a production marketplace SPA.",
  },
  {
    id: "store",
    band: 2,
    ic: "store",
    title: "Client state",
    sub: "Zustand · scoped stores",
    // CV: Technical skills — Zustand; Konstant — bid/chat surfaces across the SPA
    desc: "Zustand keeps client-side interface state in scoped stores — bid and chat surfaces hold their place across navigation, with selectors that keep re-renders honest.",
    ev: ["Zustand", "Scoped stores", "Optimistic transitions"],
    proof:
      "Bid and chat interface state held client-side across the authenticated SPA.",
  },
  {
    id: "query",
    band: 2,
    ic: "query",
    title: "Server state & data fetching",
    sub: "TanStack Query · REST · rollback",
    // CV: Konstant — optimistic updates that roll back on server rejection
    desc: "TanStack Query owns server state against REST APIs: caching, invalidation, and optimistic updates that roll back cleanly whenever the server rejects a write.",
    ev: ["TanStack Query", "REST caching", "Optimistic + rollback"],
    proof:
      "Bid-to-hire flow: optimistic updates that roll back on server rejection.",
  },
  {
    id: "live",
    band: 2,
    ic: "live",
    title: "Real-time channel",
    sub: "WebSockets · live bids & rosters",
    // CV: Konstant — real-time bid/chat over WebSockets; ~40 seasonal instructors
    desc: "WebSockets push bids, messages and roster changes into open views the moment they happen — live state for buyers, freelancers and ~40 seasonal instructors.",
    ev: ["WebSockets", "Live bid & chat", "Roster pushes"],
    proof: "Shift and availability updates streamed live to ~40 instructors.",
  },
  {
    id: "auth",
    band: 2,
    ic: "auth",
    title: "Auth & access",
    sub: "JWT · RBAC · 4 roles",
    // CV: Konstant — server-enforced RBAC for 4 roles, 5,000+ active users; JWT
    desc: "JWT sessions with role-based access enforced on every endpoint. The interface mirrors exactly what the server allows — it reflects permissions, it never grants them.",
    ev: ["JWT", "RBAC", "4 roles"],
    proof: "4-role model enforced server-side for 5,000+ active users.",
  },
  {
    id: "api",
    band: 3,
    ic: "api",
    title: "API boundary · full-stack",
    sub: "NestJS · Prisma · 20 endpoints",
    // CV: Konstant — 20 NestJS REST endpoints over PostgreSQL with Prisma
    desc: "When the backend is the bottleneck, I ship it: NestJS services over PostgreSQL with Prisma — 20 REST endpoints owned end-to-end, queries and schema changes included.",
    ev: ["NestJS", "Prisma", "PostgreSQL"],
    proof:
      "Commission, reservation and pricing schemas owned alongside the panel.",
  },
  {
    id: "test",
    band: 3,
    ic: "test",
    title: "Testing",
    sub: "Jest · React Testing Library",
    // CV: Konstant/SSTPL — Jest + RTL coverage on 10+ reusable components
    desc: "Jest and React Testing Library coverage on the shared components — so a refactor in the library doesn't quietly break five admin views three weeks later.",
    ev: ["Jest", "React Testing Library", "Shared components"],
    proof: "10+ reusable components shipped under test coverage.",
  },
  {
    id: "ship",
    band: 3,
    ic: "ship",
    title: "Monorepo & delivery",
    sub: "Turborepo · Vercel · CI/CD",
    // CV: Konstant — Turborepo packages across 3+ apps; Vercel; CI/CD maintenance
    desc: "Turborepo task graph, Vercel deployments and CI/CD pipelines maintained as part of the job — shared packages publish once, every application consumes.",
    ev: ["Turborepo", "Vercel", "CI/CD"],
    proof: "Monorepo packages reused across 3+ applications in production.",
  },
];

/** Panel hint — Phase 4 is always manual (no auto-cycle until Phase 5). */
export const WIRING_HINT =
  "Manual mode — ← → keys also move between nodes" as const;

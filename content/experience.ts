import type { ExperienceRole } from "./types";

/**
 * 05 · Experience — sticky summary rail + timeline of the three roles.
 * Product contexts are described by TYPE + REGION only (content policy —
 * client/project names never appear). All facts verbatim from the CV.
 */

export const EXPERIENCE_HEAD = {
  idx: "05",
  title: "Experience",
} as const;

// CV: Summary + Konstant/Freelance bullets
export const EXPERIENCE_LEAD =
  "3.5+ years, continuous since January 2023 — agency delivery for international clients, independent product work, and full-stack ownership in between." as const;

/** Sticky left rail facts. */
export const EXPERIENCE_RAIL = [
  { label: "Currently", value: "Konstant Infosolutions" }, // CV: Konstant Infosolutions, Jul 2024 – present
  { label: "Client products", value: "6 platforms" }, // CV: six client products
  { label: "Own product", value: "1 · end-to-end" }, // CV: freelance — sole developer, end to end
  { label: "Geographies", value: "IN · GCC · AU · JP" }, // CV: India, the GCC, Australia and Japan
] as const;

export const EXPERIENCE_ROLES: ExperienceRole[] = [
  {
    title: "Associate Software Developer",
    company: "Konstant Infosolutions Pvt Ltd", // CV: employer name (allowed)
    place: "Jaipur, India",
    period: "Jul 2024 — Present",
    badge: "Current role",
    current: true,
    contextsLabel: "Product contexts — described by type",
    bullets: [
      // CV: Konstant summary bullet — six client products, regions, stack
      "Frontend and full-stack delivery across **six client products** — marketplaces, admin platforms and operational dashboards for clients in India, the GCC, Australia and Japan — built on React.js, Next.js (App Router, SSR) and TypeScript against NestJS / Express REST APIs on PostgreSQL.",
      // CV: Konstant bullet — RBAC 4 roles, permission-based UI, 5,000+ users
      "Designed a **server-enforced RBAC model for 4 roles** with separate dashboards and permission-based UI rendering, serving **5,000+ active users** on a multi-role operations platform.",
      // CV: Konstant bullets — WebSockets bid/chat w/ rollback, ~40 instructors,
      //     SSR marketing app on Vercel, ~30% bundle cut
      "Built **real-time bid-to-hire and chat flows** over WebSockets with optimistic updates that roll back on server rejection, plus live staff-roster updates for ~40 seasonal instructors; rebuilt a public marketing surface as a separate Next.js SSR app on Vercel and cut an initial bundle **~30%** with route-based code-splitting and lazy loading.",
      // CV: Konstant bullets — component library 5+ views w/ Jest+RTL, Turborepo
      //     3+ apps, 20 NestJS endpoints over PostgreSQL/Prisma
      "Owned UI architecture decisions: a component library reused across **5+ admin views** with Jest + React Testing Library coverage, and shared packages extracted into a **Turborepo monorepo** reused across 3+ applications; shipped 20 NestJS REST endpoints over PostgreSQL with Prisma alongside one panel.",
    ],
    contexts: [
      { name: "Hiring marketplace", sub: "real-time bidding & chat" },
      { name: "Operations platform", sub: "4-role RBAC · 5,000+ users" },
      { name: "B2B procurement marketplace", sub: "Oman / GCC" },
      { name: "Real-estate marketplace", sub: "Oman · EN/AR" },
      { name: "Multi-site café platform", sub: "Western Australia" },
      { name: "Booking & scheduling platform", sub: "Japan" },
    ],
    tech: [
      "React.js",
      "Next.js · App Router",
      "TypeScript",
      "TanStack Query",
      "Zustand",
      "Material-UI",
      "NestJS",
      "Prisma · PostgreSQL",
      "WebSockets",
      "Turborepo",
      "Vercel",
      "Jest · RTL",
    ],
  },
  {
    title: "Freelance Full-Stack Developer",
    titleNote: "(Independent)",
    company: "Own product",
    place: "concurrent with full-time role",
    period: "Jun 2026 — Jul 2026", // CV: freelance dates
    badge: "Own product",
    past: true,
    contextsLabel: "Product context",
    bullets: [
      // CV: Freelance bullet — emotional-support & relationship platform, sole
      //     developer, 8 support categories, panel + site + API, 8 weeks
      "Delivered an **emotional-support & relationship platform** end to end as sole developer — connecting users with listeners and experts across **8 support categories** — taking the React.js admin panel, public site, and Node.js/Express API with JWT authentication to production **within 8 weeks**.",
      // CV: Freelance bullet — AI-assisted workflows (Claude Code, Cursor)
      "Built with **AI-assisted development workflows** (Claude Code, Cursor) handling the mechanical parts, with architecture, product decisions and quality owned directly.",
    ],
    contexts: [
      {
        name: "Support & relationship platform",
        sub: "concept → production, 8 weeks",
      },
    ],
    tech: [
      "React.js",
      "Node.js",
      "Express.js",
      "JWT auth",
      "Claude Code · Cursor",
    ],
  },
  {
    title: "Jr. Full Stack Developer",
    company: "SSTPL — Sehaj Synergy Tech. Pvt. Ltd.", // CV: employer name (allowed)
    place: "Jaipur, India",
    period: "Jan 2023 — Jul 2024", // CV: SSTPL dates — continuous employment since Jan 2023
    past: true,
    contextsLabel: "Product contexts",
    bullets: [
      // CV: SSTPL bullet — RFID check-in/out pipeline, Django ingestion, live
      //     React map dashboard, 500+ events/day, child-safety alerts
      "Built an **RFID check-in / check-out pipeline** — reader events ingested through a Django service and surfaced on a live React.js map dashboard processing **500+ events/day**; extended to a child-safety use case with alerts routed to designated staff.",
      // CV: SSTPL bullet — JWT across 5+ internal tools, 10+ reusable
      //     React/MUI components with Jest+RTL, code reviews, CI/CD
      "Implemented **JWT authentication across 5+ internal tools** and built 10+ reusable React / Material-UI components covered by Jest and React Testing Library tests; contributed to peer code reviews and CI/CD pipeline maintenance.",
      // CV: SSTPL bullet — data-entry forms, ~25% time cut, 50+ staff, 3 teams
      "Shipped data-entry forms that cut manual processing time **~25%** for 50+ operations staff across 3 internal teams.",
    ],
    contexts: [
      { name: "Live attendance dashboard", sub: "RFID · 500+ events/day" },
      { name: "Internal operations tools", sub: "5+ tools · JWT" },
    ],
    tech: [
      "React.js",
      "Material-UI",
      "Django REST",
      "JWT",
      "Jest · RTL",
      "CI/CD",
    ],
  },
];

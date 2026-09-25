import type { IconName } from "@/components/ui/Icon";

/**
 * 01 · Hero — pills, kicker, h1 (line-mask), rotator line, lede, CTAs,
 * link chips, specimen canvas + float chips. Rotator scramble, canvas
 * auto-cycle, parallax and floaty motion are Phase 5; Phase 4 renders
 * the static first state (word[0], super-admin canvas).
 */

export const HERO = {
  pills: [
    { dot: true, text: "Open to opportunities" }, // CV: "Open to opportunities"
    { dot: false, text: "Jaipur, India · Remote / Hybrid / On-site" }, // CV: Location Jaipur + notice/openness line
  ],
  kicker: "Prince Gupta — Frontend Engineer", // CV: name + title line
  /** h1 line-mask: "Frontend" solid, "Engineer" outline + lime period. */
  h1: { line1: "Frontend", line2: "Engineer", period: "." },
  /** Rotator sentence — Phase 4 shows words[0]; Phase 5 scrambles @3.6s. */
  rot: {
    before: "I build ",
    after: " people actually work in.",
    words: [
      "admin platforms",
      "marketplaces",
      "real-time dashboards",
      "internal tools",
      "operational software",
    ],
  },
  // CV: Summary — 3.5+ years; Konstant bullets (RBAC/full-stack/WebSockets)
  lede: "**3.5+ years** shipping production React.js, Next.js and TypeScript products — multi-role admin platforms, marketplaces and real-time operational dashboards, with **NestJS/Express APIs on PostgreSQL** when the work needs a full stack. Server-enforced RBAC, subscription gating, and WebSocket flows with optimistic UI.",
  ctas: [
    {
      label: "Explore the work",
      href: "#expertise",
      variant: "primary",
      icon: "arrow-down",
    },
    {
      label: "Download CV",
      href: "cv",
      variant: "ghost",
      icon: "download" as IconName,
    }, // href resolved to CV_PATH in the component
    {
      label: "Email me",
      href: "mailto",
      variant: "ghost",
      icon: "mail" as IconName,
    },
  ],
  links: [
    {
      label: "github.com/princegupta007",
      href: "https://github.com/princegupta007",
      icon: "github" as IconName,
    }, // CV: GitHub
    {
      label: "linkedin.com/in/princegupta7",
      href: "https://www.linkedin.com/in/princegupta7/",
      icon: "linkedin" as IconName,
    }, // CV: LinkedIn
    {
      label: "+91 99828 44166",
      href: "tel:+919982844166",
      icon: "phone" as IconName,
    }, // CV: phone
  ],
} as const;

/** Floating evidence chips around the specimen canvas (prototype fc-a/b/c). */
export const HERO_FLOAT_CHIPS = [
  {
    pos: "fc-a",
    depth: 34,
    icon: "lock" as IconName,
    b: "4 roles",
    small: "server-enforced RBAC",
    good: false,
  }, // CV: Konstant — 4-role RBAC
  {
    pos: "fc-b",
    depth: 24,
    icon: "bolt" as IconName,
    b: "~30% lighter",
    small: "initial bundle cut",
    good: false,
  }, // CV: Konstant — ~30% bundle cut
  {
    pos: "fc-c",
    depth: 42,
    icon: "broadcast" as IconName,
    b: "Live state",
    small: "WebSockets · optimistic UI",
    good: true,
  }, // CV: Konstant — WebSocket flows
] as const;

/**
 * Specimen canvas — static super-admin state in Phase 4.
 * Nav skeletons: 8 bars (all lit). Contacts visible (mask: false).
 */
export const HERO_CANVAS = {
  badge: "app · permission-based UI specimen",
  role: "super admin",
  scope: "scope · all records",
  /** Nav skeleton bar widths (%) — prototype NAVW; all lit in super-admin state. */
  navSkels: [72, 58, 64, 50, 68, 44, 60, 54],
  rows: [
    { w: "82%", st: "approved", mut: false },
    { w: "64%", st: "in review", mut: true },
    { w: "73%", st: "new", mut: false },
    { w: "56%", st: "queued", mut: true },
  ],
  contact: "+91 •••• ••••",
  footLeft: "rbac.specimen", // Phase 5 appends " — auto-cycling"
  mods: "8/8",
  modsLabel: "modules",
} as const;

/** Phase 5 data — hero canvas auto-cycle (2.9s). Not rendered in Phase 4. */
export const HERO_CANVAS_CYCLE = [
  {
    role: "super admin",
    on: 8,
    scope: "scope · all records",
    mods: "8/8",
    mask: false,
  },
  {
    role: "admin",
    on: 6,
    scope: "scope · all records",
    mods: "6/8",
    mask: false,
  },
  {
    role: "company",
    on: 4,
    scope: "scope · own records",
    mods: "4/8",
    mask: true,
  },
  {
    role: "partner",
    on: 2,
    scope: "scope · read-only",
    mods: "2/8",
    mask: true,
  },
] as const;

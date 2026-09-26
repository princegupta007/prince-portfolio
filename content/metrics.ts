import type { Metric } from "./types";

/**
 * 02 · In numbers — six counters. Phase 4 renders the FINAL formatted
 * values server-side (no count-up animation until Phase 5).
 * Section head: idx "02" · title "In numbers" · meta below.
 */

export const NUMBERS_HEAD = {
  idx: "02",
  title: "In numbers",
  meta: "From shipped work · Jan 2023 – present", // CV: Summary — "3.5+ years (Jan 2023 – present)"
} as const;

export const METRICS: Metric[] = [
  {
    value: 3.5,
    format: { decimals: 1, suffix: "+" },
    label: "Years in production",
    sub: "Continuous since Jan 2023",
    // CV: Summary — "3.5+ years (Jan 2023 – present)"
  },
  {
    value: 8,
    format: {},
    label: "Products delivered",
    sub: "7 client platforms + own product",
    // CV: Konstant — six agency client products; Freelance — one client
    // platform (fitness-sector site) + one own product end to end = 8.
    // Keep in sync with EXPERIENCE_RAIL and the expertise.ts lead.
  },
  {
    value: 5000,
    format: { suffix: "+" },
    label: "Active users served",
    sub: "On platforms built & maintained",
    // CV: Konstant bullet — "serving 5,000+ active users"
  },
  {
    value: 30,
    format: { prefix: "~", suffix: "%" },
    label: "Initial bundle cut",
    sub: "Code-splitting · lazy loading",
    // CV: Konstant bullet — "cut the initial bundle by ~30%"
  },
  {
    value: 4,
    format: {},
    label: "Regions shipped for",
    sub: "India · GCC · Australia · Japan",
    // CV: Konstant bullet — clients across India, the GCC, Australia and Japan
  },
  {
    value: 8,
    format: {},
    label: "Weeks to production",
    sub: "Own product · sole developer",
    // CV: Freelance bullet — "to production within 8 weeks"
  },
];

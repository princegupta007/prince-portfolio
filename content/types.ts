import type { IconName } from "@/components/ui/Icon";
import type { CounterFormat } from "@/lib/format";

/**
 * Typed content contracts (plan §2.5). Every value lives in content/*.ts
 * modules (Phase 4) and must trace to agent/context/cv-source.md or the
 * approved prototype copy. Rich strings use markers parsed by lib/rich.tsx:
 *   **text** → <b> (accent)   __text__ → <u> (good)
 */

export interface Metric {
  value: number;
  format: CounterFormat;
  label: string;
  sub: string;
}

export interface NavItem {
  num: string;
  id: string;
  label: string;
}

export interface WiringNode {
  id: string;
  /** 1 = Interface, 2 = State & data, 3 = Platform (WIRING_BANDS index + 1). */
  band: 1 | 2 | 3;
  ic: IconName;
  title: string;
  /** Mono sub-line shown on the node chip (prototype `s`). */
  sub: string;
  desc: string;
  ev: string[];
  proof: string;
}

export type RoleId = "super" | "admin" | "company" | "partner";

/** Capability matrix column order — indexes RoleSpec.caps. */
export type CapabilityKey =
  "users" | "pricing" | "approve" | "contacts" | "write";

export interface RoleSpec {
  id: RoleId;
  label: string;
  /** Tab sub-line, e.g. "Full control plane". */
  tabSub: string;
  /** Visibility per nav module (1 = visible, 0 = denied). Length 10. */
  nav: number[];
  /** Capability matrix cells, ordered by CAPABILITY_KEYS. */
  caps: Record<CapabilityKey, "yes" | "partial" | "no">;
  scope: string;
  maskContacts: boolean;
  /** "full" | "own" | "none" — write posture (prototype write: true/"own"/false). */
  write: "full" | "own" | "none";
  approveEnabled: boolean;
  /** Mock browser URL shown in the specimen window. */
  path: string;
  /** Mock window title. */
  title: string;
  note: string;
}

export interface ExperienceRole {
  /** Position title, e.g. "Associate Software Developer". */
  title: string;
  /** Muted suffix inside the h3, e.g. "(Independent)". */
  titleNote?: string;
  /** Main line of the .co row (company, or "Own product" for freelance). */
  company: string;
  /** Muted "· …" part of the .co row (location or context). */
  place: string;
  period: string;
  /** Badge next to the period ("Current role" / "Own product"). */
  badge?: string;
  /** Pulsing dot inside the badge (current role only). */
  current?: boolean;
  /** Render the period in the muted "dates past" style. */
  past?: boolean;
  /** Heading above the context chips (varies per role in the prototype). */
  contextsLabel: string;
  contexts: { name: string; sub: string }[];
  bullets: string[];
  tech: string[];
}

export interface StackGroup {
  title: string;
  ic?: IconName;
  /** Highlighted chip-key primaries. */
  keys: string[];
  items: string[];
}

export interface EduItem {
  degree: string;
  field: string;
  school: string;
  place: string;
  years: string;
  /** Mono corner tag ("MCA" / "BCA"). */
  abbr: string;
}

export interface ContactRow {
  kind:
    | "email"
    | "phone"
    | "github"
    | "linkedin"
    | "location"
    | "experience"
    | "focus";
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  copyable?: boolean;
  /** Mono hint shown on hover ("click to copy"). */
  hint?: string;
  /** Render value in the numeric/mono style (phone). */
  numeric?: boolean;
}

export interface BentoTile {
  /** wide = b-feat (span 8), third = b-third (span 4), half = b-half (span 6). */
  span: "wide" | "third" | "half";
  ic: IconName;
  /** Corner code, e.g. "E — 01". */
  code: string;
  title: string;
  desc: string;
  ev: string[];
}

export interface Principle {
  num: string;
  title: string;
  desc: string;
  /** Evidence arrow line under the card. */
  evidence: string;
}

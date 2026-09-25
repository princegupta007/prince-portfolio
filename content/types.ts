import type { IconName } from "@/components/ui/Icon";
import type { CounterFormat } from "@/lib/format";

/**
 * Typed content contracts (plan §2.5). Every value lives in content/*.ts
 * modules (Phase 4) and must trace to agent/context/cv-source.md.
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
  band: 1 | 2 | 3;
  ic: IconName;
  title: string;
  desc: string;
  ev: string[];
  proof: string;
}

export type RoleId = "super" | "admin" | "company" | "partner";

export interface RoleSpec {
  id: RoleId;
  label: string;
  /** Visibility per nav module (1 = visible, 0 = denied). Length 10. */
  nav: number[];
  /** Capability matrix cell per column: "yes" | "partial" | "no". */
  caps: ("yes" | "partial" | "no")[];
  scope: string;
  maskContacts: boolean;
  write: string;
  approveEnabled: boolean;
  note: string;
}

export interface ExperienceRole {
  company: string;
  place: string;
  period: string;
  current?: boolean;
  contexts: { type: string; region: string }[];
  bullets: string[];
  tech: string[];
}

export interface StackGroup {
  title: string;
  ic: IconName;
  keys: string[];
  items: string[];
}

export interface EduItem {
  degree: string;
  field: string;
  school: string;
  place: string;
  years: string;
}

export interface ContactRow {
  kind: "email" | "phone" | "github" | "linkedin" | "location";
  label: string;
  value: string;
  href?: string;
  copyable: boolean;
}

export interface BentoTile {
  span: "wide" | "third" | "half";
  ic: IconName;
  title: string;
  desc: string;
  ev: string[];
}

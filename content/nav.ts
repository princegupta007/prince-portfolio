import type { NavItem } from "./types";

/**
 * Navigation configuration — single source for header nav, mobile menu,
 * dot rail, footer index and the scrollspy (prototype header/menu/rail/footer).
 * Numbers match the section index (02–09); hero is rail-only ("Intro").
 */

export const HEADER_NAV: NavItem[] = [
  { num: "02", id: "numbers", label: "Numbers" },
  { num: "03", id: "expertise", label: "Expertise" },
  { num: "04", id: "exhibit", label: "Exhibit" },
  { num: "05", id: "experience", label: "Experience" },
  { num: "06", id: "principles", label: "Principles" },
  { num: "07", id: "stack", label: "Stack" },
  { num: "09", id: "contact", label: "Contact" },
];

/** Mobile menu + footer index (includes Background). */
export const INDEX_ITEMS: NavItem[] = [
  { num: "02", id: "numbers", label: "Numbers" },
  { num: "03", id: "expertise", label: "Expertise" },
  { num: "04", id: "exhibit", label: "Exhibit" },
  { num: "05", id: "experience", label: "Experience" },
  { num: "06", id: "principles", label: "Principles" },
  { num: "07", id: "stack", label: "Stack" },
  { num: "08", id: "background", label: "Background" },
  { num: "09", id: "contact", label: "Contact" },
];

/** Dot rail — 9 stops incl. hero ("Intro"). */
export const RAIL_ITEMS: NavItem[] = [
  { num: "01", id: "hero", label: "Intro" },
  ...INDEX_ITEMS,
];

/** Scrollspy target order (module-level constant → stable hook dependency). */
export const SECTION_IDS: string[] = RAIL_ITEMS.map((i) => i.id);

/**
 * ⌘K palette navigate entries — prototype CMDS labels verbatim
 * (group renders as "NN · navigate").
 */
export const PALETTE_NAV: NavItem[] = [
  { num: "01", id: "hero", label: "Hero — intro" },
  { num: "02", id: "numbers", label: "In numbers — impact metrics" },
  { num: "03", id: "expertise", label: "What I build — expertise" },
  { num: "04", id: "exhibit", label: "Access control exhibit — live specimen" },
  { num: "05", id: "experience", label: "Experience — timeline" },
  { num: "06", id: "principles", label: "How I work — principles" },
  { num: "07", id: "stack", label: "The toolbox — stack" },
  { num: "08", id: "background", label: "Background — education" },
  { num: "09", id: "contact", label: "Contact — let's talk" },
];

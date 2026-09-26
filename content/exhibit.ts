import type { CapabilityKey, RoleId, RoleSpec } from "./types";

/**
 * 04 · Access control, exhibited — the live specimen. Role switching is an
 * interactive core in Phase 4 (instant state, no animation). Rules are
 * illustrative demo data (as labelled on-page); role facts trace to the CV.
 * Rich markers: ** → <b>, __ → <u> (audit console colours).
 */

export const EXHIBIT_HEAD = {
  idx: "04",
  titleLines: ["Access control,", "exhibited."],
  meta: "Live specimen · illustrative rules",
} as const;

export const EXHIBIT_INTRO =
  "Most of my work is interfaces that change shape depending on who's signed in. Here's the pattern as a **working specimen** — switch the role and watch the navigation, permissions, data and even the audit trail respond. The rules below are illustrative; **the technique is what I ship**." as const;

// CV: Konstant — "server-enforced RBAC model for 4 roles ... 5,000+ active users"
const SUPER_ROLE: RoleSpec = {
  id: "super",
  label: "Super Admin",
  tabSub: "Full control plane",
  nav: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  caps: {
    users: "yes",
    pricing: "yes",
    approve: "yes",
    contacts: "yes",
    write: "yes",
  },
  scope: "All records",
  maskContacts: false,
  write: "full",
  approveEnabled: true,
  path: "app.example.com/admin/overview",
  title: "Operations overview",
  note: "Full module access — pricing configuration, users, roles, CMS content and the audit trail.",
};

const ADMIN_ROLE: RoleSpec = {
  id: "admin",
  label: "Admin",
  tabSub: "Operations · pricing read-only",
  nav: [1, 1, 1, 1, 1, 1, 0, 1, 0, 0],
  caps: {
    users: "yes",
    pricing: "partial",
    approve: "yes",
    contacts: "yes",
    write: "yes",
  },
  scope: "All records",
  maskContacts: false,
  write: "full",
  approveEnabled: true,
  path: "app.example.com/admin/overview",
  title: "Operations overview",
  note: "Operational access across every module. Pricing is read-only; role management and audit stay restricted.",
};

const COMPANY_ROLE: RoleSpec = {
  id: "company",
  label: "Company",
  tabSub: "Own records only · contacts masked",
  nav: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  caps: {
    users: "no",
    pricing: "no",
    approve: "no",
    contacts: "no",
    write: "partial",
  },
  scope: "Own records only",
  maskContacts: true,
  write: "own",
  approveEnabled: true,
  path: "app.example.com/company/orders",
  title: "Company dashboard",
  note: "Sees only its own listings, orders and messages. Counterparty contact details are masked server-side.",
};

const PARTNER_ROLE: RoleSpec = {
  id: "partner",
  label: "Partner",
  tabSub: "Read-only view",
  nav: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  caps: {
    users: "no",
    pricing: "no",
    approve: "no",
    contacts: "no",
    write: "no",
  },
  scope: "Read-only",
  maskContacts: true,
  write: "none",
  approveEnabled: false,
  path: "app.example.com/partner/listings",
  title: "Partner view",
  note: "Read-only view of participation. Contacts hidden, write actions unavailable, everything else denied.",
};

export const EXHIBIT_ROLES: RoleSpec[] = [
  SUPER_ROLE,
  ADMIN_ROLE,
  COMPANY_ROLE,
  PARTNER_ROLE,
];

/** Keyed lookup — avoids index-access undefined under strict TS. */
export const ROLES_BY_ID: Record<RoleId, RoleSpec> = {
  super: SUPER_ROLE,
  admin: ADMIN_ROLE,
  company: COMPANY_ROLE,
  partner: PARTNER_ROLE,
};

export const ROLE_ORDER: RoleId[] = ["super", "admin", "company", "partner"];
export const ROLE_COL_HEADERS = ["SA", "AD", "CO", "PA"] as const;

export const CAPABILITY_KEYS: CapabilityKey[] = [
  "users",
  "pricing",
  "approve",
  "contacts",
  "write",
];

export const CAPABILITY_LABELS: Record<CapabilityKey, string> = {
  users: "Manage users & roles",
  pricing: "Configure pricing",
  approve: "Approve listings",
  contacts: "Counterparty contacts",
  write: "Write actions",
};

/** ✓ full · ◐ read / scoped · — denied */
export const CAP_GLYPH = { yes: "✓", partial: "◐", no: "—" } as const;
export const MATRIX_LEGEND = "✓ full · ◐ read / scoped · — denied" as const;

/** Modules granted per role (tab "x/10" counts). */
export const grantedCount = (role: RoleSpec): number =>
  role.nav.reduce<number>((a, b) => a + b, 0);

/** Mock specimen window — 10 navigation modules. */
export const MOCK_NAV = [
  "Overview",
  "Listings",
  "Orders",
  "RFQs",
  "Messages",
  "Users",
  "Roles",
  "Pricing",
  "Content",
  "Audit",
] as const;

export const MOCK_TABLE = {
  head: ["Record", "Status", "Seller contact"],
  rows: [
    {
      record: "Sale listing · 1042",
      status: "approved",
      contact: "+971 •• ••• ••••",
    },
    {
      record: "Rental listing · 1088",
      status: "in review",
      contact: "+971 •• ••• ••••",
    },
    { record: "RFQ · 2261", status: "new", contact: "+971 •• ••• ••••" },
  ],
  maskedText: "hidden for role",
  wsTag: "WS connected",
  enforcedTag: "Server-enforced",
  approveLabel: "Approve",
  approveDeniedLabel: "Approve · denied",
} as const;

export const AUDIT_HEAD = {
  title: "audit.log — permission events",
  tag: "streaming",
} as const;

/**
 * Audit console lines for a role (prototype pushAudit). `granted` = modules
 * visible. Phase 4 SSR renders the super-admin lines; RoleLens rebuilds them
 * on switch (instant — stagger animation is Phase 5).
 */
export function buildAuditLines(role: RoleSpec): string[] {
  const granted = grantedCount(role);
  const scopeSlug = role.scope
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .replace(/ /g, "-");
  const lines = [
    `**[rbac]** jwt verified · role → **${role.id}**`,
    `**[acl]** modules granted __${granted}/10__ · denied ${10 - granted} re-rendered inert`,
    `**[api]** GET /v1/records · __200__ · scope=${scopeSlug}`,
  ];
  if (role.maskContacts) {
    lines.push(
      "**[ui]** counterparty contacts masked · __3 cells__ · values never sent",
    );
  }
  if (role.write === "none") {
    lines.push(
      "**[ui]** write actions disabled · approve endpoint returns **403** if called",
    );
  }
  if (role.write === "own") {
    lines.push(
      "**[ui]** writes scoped to own records · server re-checks ownership",
    );
  }
  if (role.caps.pricing === "partial") {
    lines.push("**[acl]** pricing module · __read-only__ · mutations rejected");
  }
  lines.push(
    `**[ws]** channel re-subscribed · role:${role.id} · __streaming__`,
  );
  return lines;
}

/** SSR/initial audit lines — first three, per Phase 4 spec. */
export const INITIAL_AUDIT_LINES = buildAuditLines(SUPER_ROLE).slice(0, 3);

export const EXHIBIT_DISCLAIMER =
  "Illustrative demo — not client data. In production, every endpoint re-checks the caller's role before responding; the UI reflects permissions, it never grants them." as const;

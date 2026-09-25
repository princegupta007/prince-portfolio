"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Primitives";
import { parseRich } from "@/lib/rich";
import {
  AUDIT_HEAD,
  CAPABILITY_KEYS,
  CAPABILITY_LABELS,
  CAP_GLYPH,
  EXHIBIT_ROLES,
  MATRIX_LEGEND,
  MOCK_NAV,
  MOCK_TABLE,
  ROLE_COL_HEADERS,
  ROLES_BY_ID,
  ROLE_ORDER,
  buildAuditLines,
  grantedCount,
} from "@/content/exhibit";
import type { RoleId, RoleSpec } from "@/content/types";
import { isReduced } from "@/hooks/useReducedMotion";

/**
 * 04 · Access-control exhibit — interactive core (Phase 5):
 * role tabs (aria-pressed), capability matrix column highlight, mock window
 * (nav grants, url/scope/title/note, approve state, contact masking) and the
 * audit console. SSR + first client render = super-admin lens with the first
 * three audit lines (readable without JavaScript). After mount the console
 * boots like the prototype: lines append one-by-one (150ms stagger, instant
 * under reduced motion) with live timestamps, trimmed to the last 7; every
 * role switch pushes a fresh block the same way.
 */

type AuditLine = { id: number; time: string | null; text: string };

// fixed ids for the SSR block (module state must stay request-independent);
// the client-side sequence starts above it after the console boot.
const INITIAL_AUDIT: AuditLine[] = buildAuditLines(ROLES_BY_ID.super)
  .slice(0, 3)
  .map((text, i) => ({ id: i, time: null, text }));

function hhmmss(): string {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

export function RoleLens() {
  const [roleId, setRoleId] = useState<RoleId>("super");
  const [audit, setAudit] = useState<AuditLine[]>(INITIAL_AUDIT);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lineSeq = useRef(100);
  const role: RoleSpec = ROLES_BY_ID[roleId];
  const activeCol = ROLE_ORDER.indexOf(role.id);

  /**
   * Prototype pushAudit: append with 150ms stagger (instant under reduced
   * motion), timestamp at append, keep the last 7. `replace` resets the
   * console inside the first timer — the boot effect never sets state
   * synchronously (React 19 lint rule).
   */
  const pushAudit = (lines: string[], replace = false) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const step = isReduced() ? 0 : 150;
    lines.forEach((text, i) => {
      timers.current.push(
        setTimeout(() => {
          const line = { id: lineSeq.current++, time: hhmmss(), text };
          setAudit((prev) =>
            i === 0 && replace ? [line] : [...prev, line].slice(-7),
          );
        }, i * step),
      );
    });
  };

  // console boot on load (prototype: setRole("super") runs the stagger once)
  useEffect(() => {
    pushAudit(buildAuditLines(ROLES_BY_ID.super), true);
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const choose = (spec: RoleSpec) => {
    setRoleId(spec.id);
    pushAudit(buildAuditLines(spec));
  };

  return (
    <div className="ex-grid">
      <div className="ex-left reveal">
        <div className="role-tabs" role="group" aria-label="Preview as role">
          {EXHIBIT_ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              className="role-tab"
              data-role={r.id}
              aria-pressed={r.id === role.id}
              onClick={() => choose(r)}
            >
              <span className="rt-main">
                <b>{r.label}</b>
                <small>{r.tabSub}</small>
              </span>
              <span className="rt-count">{grantedCount(r)}/10</span>
            </button>
          ))}
        </div>
        <div className="matrix" aria-label="Capability matrix by role">
          <div className="mx-head">
            <span>Capability</span>
            {ROLE_COL_HEADERS.map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          {CAPABILITY_KEYS.map((cap) => (
            <div className="mx-row" data-cap={cap} key={cap}>
              <span className="mx-cap">{CAPABILITY_LABELS[cap]}</span>
              {ROLE_ORDER.map((rk, i) => {
                const v = ROLES_BY_ID[rk].caps[cap];
                return (
                  <span
                    key={rk}
                    className={
                      i === activeCol ? "mx-cell mx-col-hl" : "mx-cell"
                    }
                  >
                    <span
                      className={
                        v === "yes"
                          ? "mx-dot on"
                          : v === "partial"
                            ? "mx-dot half"
                            : "mx-dot"
                      }
                      data-col={i}
                    >
                      {CAP_GLYPH[v]}
                    </span>
                  </span>
                );
              })}
            </div>
          ))}
          <div className="mx-foot">{MATRIX_LEGEND}</div>
        </div>
      </div>
      <div className="ex-right reveal" style={{ "--d": "120ms" } as CSSProperties}>
        <div className="mock">
          <div className="mock-bar">
            <span className="tl-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="mock-url">{role.path}</span>
            <Tag tone="live">
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: 5,
                  height: 5,
                  borderRadius: 99,
                  background: "var(--good)",
                  marginRight: 6,
                }}
              />
              {MOCK_TABLE.wsTag}
            </Tag>
            <Tag tone="ok">{role.label}</Tag>
          </div>
          <div className="mock-body">
            <div className="mock-side" aria-hidden="true">
              {MOCK_NAV.map((item, i) => {
                const on = role.nav[i] === 1;
                return (
                  <div
                    key={item}
                    className={on ? "mock-nav on" : "mock-nav off"}
                  >
                    <span className="sq" />
                    {item}
                    <span className="lock" aria-hidden="true">
                      {on ? "" : "✕"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mock-main">
              <div className="mock-h">
                <b>{role.title}</b>
                <span className="tagrow">
                  <Tag tone="ok">{MOCK_TABLE.enforcedTag}</Tag>
                  <Tag>{role.scope}</Tag>
                  <button
                    type="button"
                    className={
                      role.approveEnabled ? "mock-act" : "mock-act disabled"
                    }
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Icon
                      name={role.approveEnabled ? "check" : "lock"}
                      size={11}
                      strokeWidth={role.approveEnabled ? 2.6 : 2.4}
                    />
                    {role.approveEnabled
                      ? MOCK_TABLE.approveLabel
                      : MOCK_TABLE.approveDeniedLabel}
                  </button>
                </span>
              </div>
              <table className="mock-tbl">
                <thead>
                  <tr>
                    {MOCK_TABLE.head.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_TABLE.rows.map((r) => (
                    <tr key={r.record}>
                      <td>{r.record}</td>
                      <td>
                        <span
                          className={
                            r.status === "in review"
                              ? "chip-mini wait"
                              : "chip-mini"
                          }
                        >
                          {r.status}
                        </span>
                      </td>
                      <td
                        className={
                          role.maskContacts
                            ? "contact-cell masked"
                            : "contact-cell"
                        }
                      >
                        {role.maskContacts ? MOCK_TABLE.maskedText : r.contact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mock-note">{role.note}</p>
            </div>
          </div>
        </div>
        <div className="audit" aria-hidden="true">
          <div className="audit-bar">
            <span className="tl-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>{AUDIT_HEAD.title}</span>
            <span className="tag">{AUDIT_HEAD.tag}</span>
          </div>
          <div className="audit-body">
            {audit.map((ln) => (
              <div className="ln" key={ln.id}>
                {ln.time && <em>{ln.time}</em>}
                <span>{parseRich(ln.text, "b")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

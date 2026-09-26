"use client";

import { useEffect, useState } from "react";
import { useAutoCycle } from "@/hooks/useAutoCycle";
import { isReduced } from "@/hooks/useReducedMotion";
import { FEATURE_ROLES } from "@/content/expertise";

/**
 * Expertise feature-tile role visual — cycles ONE lit cell every 1.7s
 * (prototype), pausing off-screen / on hidden tab. Reduced motion or no-JS:
 * all four cells stay lit (SSR renders them lit, so the static state is the
 * complete state).
 */
export function RoleVisual() {
  const [lit, setLit] = useState<number | null>(null); // null = all lit (SSR/reduced)
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const reduced = isReduced();

  useAutoCycle(1700, () => setLit((i) => ((i === null ? 0 : i + 1) % FEATURE_ROLES.length)), reduced ? null : host);

  // start the cycle at cell 0 on the next tick (async → lint-clean);
  // reduced motion keeps every cell lit
  useEffect(() => {
    const id = setTimeout(() => setLit(reduced ? null : 0), 0);
    return () => clearTimeout(id);
  }, [reduced]);

  return (
    <div className="roles-vis" id="rolesVis" ref={setHost}>
      {FEATURE_ROLES.map((r, i) => (
        <div className={lit === null || lit === i ? "rv-cell lit" : "rv-cell"} key={r.label}>
          <b>{r.label}</b>
          <small>{r.note}</small>
        </div>
      ))}
    </div>
  );
}

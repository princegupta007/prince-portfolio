import { Icon } from "@/components/ui/Icon";
import type { CSSProperties } from "react";
import { SectionHead } from "@/components/ui/Primitives";
import { RoleLens } from "@/components/interactive/RoleLens";
import { IslandBoundary } from "@/components/interactive/IslandBoundary";
import { parseRich } from "@/lib/rich";
import {
  EXHIBIT_DISCLAIMER,
  EXHIBIT_HEAD,
  EXHIBIT_INTRO,
} from "@/content/exhibit";

/**
 * 04 · Access control, exhibited — two-line masked heading + lede are
 * server-rendered; tabs/matrix/mock window/audit console live in the
 * RoleLens client island (instant state — Phase 4). SSR shows the
 * super-admin lens, so the specimen reads correctly without JavaScript.
 */
export function Exhibit() {
  return (
    <section className="sec" id="exhibit" aria-labelledby="ex-h">
      <div className="wrap">
        <SectionHead
          idx={EXHIBIT_HEAD.idx}
          titleLines={EXHIBIT_HEAD.titleLines}
          meta={EXHIBIT_HEAD.meta}
          hId="ex-h"
        />
        <p className="sec-lede reveal" style={{ "--d": "80ms" } as CSSProperties}>
          {parseRich(EXHIBIT_INTRO)}
        </p>
        <IslandBoundary
          label="exhibit"
          fallback={
            <div className="island-static" aria-label="Feature access matrix (static view)">
              <p className="mono">ACCESS MATRIX — SUPER ADMIN (STATIC)</p>
              <ul role="list">
                <li>Users & roles · enabled</li>
                <li>Billing & subscriptions · enabled</li>
                <li>Audit trail · enabled</li>
              </ul>
            </div>
          }
        >
          <RoleLens />
        </IslandBoundary>
        <p className="exhibit-note">
          <Icon name="info" size={14} />
          {EXHIBIT_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}

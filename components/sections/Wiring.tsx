import { WiringDiagram } from "@/components/interactive/WiringDiagram";
import { IslandBoundary } from "@/components/interactive/IslandBoundary";
import { parseRich } from "@/lib/rich";
import { WIRING_HEAD, WIRING_INTRO } from "@/content/wiring";

/**
 * 03·B · How it's wired — section-head + lede are server-rendered; the
 * diagram + sticky panel live in the WiringDiagram client island (click and
 * ←/→ selection only — auto-cycle is Phase 5). The island SSR-renders node
 * 01 so the panel reads correctly without JavaScript.
 * Rendered inside section#expertise (prototype structure).
 */
export function Wiring() {
  return (
    <div className="wiring reveal" id="wiring" role="region" aria-label="How it is wired — anatomy of a request">
      <div className="wire-head">
        <span className="idx" aria-hidden="true">
          {WIRING_HEAD.idx}
        </span>
        <h3>{WIRING_HEAD.title}</h3>
        <span className="meta">{WIRING_HEAD.meta}</span>
      </div>
      <p className="wire-lede">{parseRich(WIRING_INTRO, "em")}</p>
      <IslandBoundary
        label="wiring"
        fallback={
          <div className="island-static" aria-label="Request anatomy (static view)">
            <p className="mono">REQUEST ANATOMY (STATIC)</p>
            <ul role="list">
              <li>01 · UI action → optimistic update</li>
              <li>02 · Server-authoritative check (RBAC)</li>
              <li>03 · Persist + broadcast (WebSocket)</li>
              <li>04 · UI reconciles to server truth</li>
            </ul>
          </div>
        }
      >
        <WiringDiagram />
      </IslandBoundary>
    </div>
  );
}

"use client";

import { Fragment, useState } from "react";
import type { KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Primitives";
import {
  WIRING_BANDS,
  WIRING_BUS,
  WIRING_HINT_AUTO,
  WIRING_HINT_MANUAL,
  WIRING_NODES,
} from "@/content/wiring";
import { useAutoCycle } from "@/hooks/useAutoCycle";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * 03·B wiring schematic — interactive core (Phase 5):
 * auto-cycles the ten nodes every 4.6s (pausing off-screen at 20% visibility
 * and on hidden tabs); the FIRST click or ←/→ press takes permanent control
 * (handover — the cycle never resumes) and the panel hint swaps to manual
 * mode. The panel body replays its wpIn animation on every node change
 * (key-remount). SSR + first client render show node 01 with the auto hint,
 * so the panel reads correctly without JavaScript; reduced motion keeps it
 * static in manual wording.
 */
export function WiringDiagram() {
  const [idx, setIdx] = useState(0);
  const [userTaken, setUserTaken] = useState(false);
  const [watchEl, setWatchEl] = useState<Element | null>(null);
  const reduced = useReducedMotion();

  const { handoff } = useAutoCycle(
    4600,
    () => setIdx((i) => (i + 1) % WIRING_NODES.length),
    reduced || userTaken ? null : watchEl,
    0.2,
  );

  // idx is always produced by select()/cycle modulo the node count — both lookups are safe.
  const node = WIRING_NODES[idx]!;
  const band = WIRING_BANDS[node.band - 1]!;

  const select = (i: number, byUser = false) => {
    setIdx(
      ((i % WIRING_NODES.length) + WIRING_NODES.length) % WIRING_NODES.length,
    );
    if (byUser && !userTaken) {
      handoff();
      setUserTaken(true);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      select(idx + 1, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      select(idx - 1, true);
    }
  };

  return (
    <div
      className="wire-grid"
      ref={(el) => setWatchEl(el ? el.closest("#wiring") : null)}
    >
      <div
        className="wire-diagram"
        id="wireDiagram"
        role="group"
        aria-label="Frontend engineering anatomy — interactive schematic"
        onKeyDown={onKeyDown}
      >
        {WIRING_BANDS.map((b, bi) => {
          const nodes = WIRING_NODES.map((n, i) => ({ n, i })).filter(
            (x) => x.n.band === bi + 1,
          );
          return (
            <Fragment key={b.title}>
              <div className="w-band-lbl">
                <b>Layer 0{bi + 1}</b> {b.title} — {b.sub}
              </div>
              <div className={`w-band ${nodes.length === 4 ? "c4" : "c3"}`}>
                {nodes.map(({ n, i }) => (
                  <button
                    key={n.id}
                    type="button"
                    className="w-node"
                    data-i={i}
                    aria-pressed={i === idx}
                    onClick={() => select(i, true)}
                  >
                    <span className="wn-top">
                      <span className="wn-ico">
                        <Icon name={n.ic} size={15} strokeWidth={1.7} />
                      </span>
                      <b>{n.title}</b>
                    </span>
                    <small>{n.sub}</small>
                  </button>
                ))}
              </div>
              {bi < WIRING_BANDS.length - 1 && (
                <div className="w-bus" aria-hidden="true">
                  <i />
                  <i />
                  <span>{WIRING_BUS[bi]}</span>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
      <aside className="wire-panel" aria-label="Selected node detail">
        <div className="wp-bar">
          <span>
            node {String(idx + 1).padStart(2, "0")} / {WIRING_NODES.length}
          </span>
          <Tag tone="ok">{band.title}</Tag>
        </div>
        <div className="wp-body anim" key={idx}>
          <h4 className="wp-title">{node.title}</h4>
          <p className="wp-desc">{node.desc}</p>
          <div className="wp-ev">
            {node.ev.map((e) => (
              <span className="ev-chip" key={e}>
                {e}
              </span>
            ))}
          </div>
          <p className="wp-proof">
            <Icon name="check" size={12} strokeWidth={2.6} />
            <span>{node.proof}</span>
          </p>
        </div>
        <div className="wp-hint">
          <Icon name="info" size={12} />
          <span>{userTaken || reduced ? WIRING_HINT_MANUAL : WIRING_HINT_AUTO}</span>
        </div>
      </aside>
    </div>
  );
}

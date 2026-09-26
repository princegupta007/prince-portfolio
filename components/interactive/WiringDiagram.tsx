"use client";

import { Fragment, useState } from "react";
import type { KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Primitives";
import {
  WIRING_BANDS,
  WIRING_BUS,
  WIRING_HINT,
  WIRING_NODES,
} from "@/content/wiring";

/**
 * 03·B wiring schematic — interactive core (Phase 4):
 * click a node or press ←/→ (focus inside the diagram) to move the sticky
 * detail panel. NO auto-cycle (Phase 5). SSR + first client render show
 * node 01, so the panel reads correctly without JavaScript.
 */
export function WiringDiagram() {
  const [idx, setIdx] = useState(0);
  // idx is always produced by select() modulo the node count — both lookups are safe.
  const node = WIRING_NODES[idx]!;
  const band = WIRING_BANDS[node.band - 1]!;

  const select = (i: number) =>
    setIdx(
      ((i % WIRING_NODES.length) + WIRING_NODES.length) % WIRING_NODES.length,
    );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      select(idx + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      select(idx - 1);
    }
  };

  return (
    <div className="wire-grid">
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
                    onClick={() => select(i)}
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
        <div className="wp-body">
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
          <span>{WIRING_HINT}</span>
        </div>
      </aside>
    </div>
  );
}

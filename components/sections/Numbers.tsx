import type { CSSProperties } from "react";
import { SectionHead } from "@/components/ui/Primitives";
import { Counter } from "@/components/interactive/Counter";
import { METRICS, NUMBERS_HEAD } from "@/content/metrics";

/**
 * 02 · In numbers — divided 6-cell strip. SSR renders the FINAL formatted
 * values (3.5+ · 7 · 5,000+ · ~30% · 4 · 8); the Counter island animates
 * the count-up (1.5s easeOutQuart at 50% visibility, once). Reduced motion
 * or no-JS: the final values simply stay.
 */

export function Numbers() {
  return (
    <section className="sec" id="numbers" aria-labelledby="num-h">
      <div className="wrap">
        <SectionHead
          idx={NUMBERS_HEAD.idx}
          title={NUMBERS_HEAD.title}
          meta={NUMBERS_HEAD.meta}
          hId="num-h"
        />
        <div
            className="metrics reveal"
            role="list"
            style={{ "--d": "120ms" } as CSSProperties}
          >
          {METRICS.map((m) => {
            const { decimals = 0, prefix = "", suffix = "" } = m.format;
            return (
              <div className="metric" role="listitem" key={m.label}>
                <div className="m-v num">
                  {prefix && <i>{prefix}</i>}
                  <Counter value={m.value} decimals={decimals} />
                  {suffix && <u>{suffix}</u>}
                </div>
                <div className="m-k">
                  {m.label}
                  <span className="m-s">{m.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

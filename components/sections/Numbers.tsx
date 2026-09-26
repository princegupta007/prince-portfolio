import { SectionHead } from "@/components/ui/Primitives";
import { METRICS, NUMBERS_HEAD } from "@/content/metrics";

/**
 * 02 · In numbers — divided 6-cell strip. Phase 4 renders the FINAL
 * formatted values server-side (3.5+ · 7 · 5,000+ · ~30% · 4 · 8);
 * Phase 5 animates the count-up from 0 against the same data-count hooks.
 */

function grouped(value: number, decimals: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

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
        <div className="metrics" role="list">
          {METRICS.map((m) => {
            const { decimals = 0, prefix = "", suffix = "" } = m.format;
            return (
              <div className="metric" role="listitem" key={m.label}>
                <div className="m-v num">
                  {prefix && <i>{prefix}</i>}
                  <span data-count={m.value} data-dec={decimals || undefined}>
                    {grouped(m.value, decimals)}
                  </span>
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

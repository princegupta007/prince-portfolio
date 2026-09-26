import type { CSSProperties } from "react";
import { Chip, SectionHead } from "@/components/ui/Primitives";
import { STACK_GROUPS, STACK_HEAD } from "@/content/stack";

/**
 * 07 · The toolbox — six group cards; `keys` render as chip-key primaries
 * (with the .sq marker span), the rest as plain chips. Server Component.
 */
export function Stack() {
  return (
    <section className="sec" id="stack" aria-labelledby="st-h">
      <div className="wrap">
        <SectionHead
          idx={STACK_HEAD.idx}
          title={STACK_HEAD.title}
          meta={STACK_HEAD.meta}
          hId="st-h"
        />
        <div className="stack-grid">
          {STACK_GROUPS.map((g, gi) => (
            <div
              className="stack-card reveal"
              style={{ "--d": `${(gi % 3) * 70}ms` } as CSSProperties}
              key={g.title}
            >
              <div className="st-lbl">
                <i aria-hidden="true" />
                <span>{g.title}</span>
              </div>
              <div className="chips" role="list">
                {g.keys.map((k) => (
                  <Chip k key={k}>
                    <span className="sq" aria-hidden="true" />
                    {k}
                  </Chip>
                ))}
                {g.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

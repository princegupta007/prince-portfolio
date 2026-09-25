import type { CSSProperties } from "react";
import { SectionHead } from "@/components/ui/Primitives";
import { PRINCIPLES, PRINCIPLES_HEAD } from "@/content/principles";

/**
 * 06 · How I work — four principle cards with outline numerals and the
 * evidence arrow (.pr-ev::before, hover lift is CSS-only). Server Component.
 */
export function Principles() {
  return (
    <section className="sec" id="principles" aria-labelledby="pr-h">
      <div className="wrap">
        <SectionHead
          idx={PRINCIPLES_HEAD.idx}
          title={PRINCIPLES_HEAD.title}
          meta={PRINCIPLES_HEAD.meta}
          hId="pr-h"
        />
        <div className="pr-grid">
          {PRINCIPLES.map((p, pi) => (
            <article
              className="pr reveal"
              style={{ "--d": `${pi * 80}ms` } as CSSProperties}
              key={p.num}
            >
              <span className="pr-n" aria-hidden="true">
                {p.num}
              </span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <span className="pr-ev">{p.evidence}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Icon } from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/Primitives";
import { parseRich } from "@/lib/rich";
import {
  BACKGROUND_HEAD,
  EDUCATION,
  TRAJECTORY_NOTE,
} from "@/content/education";

/**
 * 08 · Background — two education cards (cap icon, field chip, years + abbr)
 * and the trajectory note. Server Component.
 */
export function Background() {
  return (
    <section className="sec" id="background" aria-labelledby="bg-h">
      <div className="wrap">
        <SectionHead
          idx={BACKGROUND_HEAD.idx}
          title={BACKGROUND_HEAD.title}
          meta={BACKGROUND_HEAD.meta}
          hId="bg-h"
        />
        <div className="edu-grid">
          {EDUCATION.map((e) => (
            <article className="edu" key={e.abbr}>
              <div>
                <h3 className="edu-deg">{e.degree}</h3>
                <span className="chip edu-fld">
                  <span className="sq" aria-hidden="true" /> {e.field}
                </span>
                <p className="edu-org">
                  <Icon name="cap" size={15} strokeWidth={1.8} />
                  {e.school} · {e.place}
                </p>
              </div>
              <div className="edu-yrs">
                <b>{e.years}</b>
                <small>{e.abbr}</small>
              </div>
            </article>
          ))}
        </div>
        <div className="edu-note">
          <span className="spark" aria-hidden="true">
            ✦
          </span>
          <span>{parseRich(TRAJECTORY_NOTE, "b")}</span>
        </div>
      </div>
    </section>
  );
}

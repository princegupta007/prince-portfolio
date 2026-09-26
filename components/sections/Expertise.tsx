import { Icon } from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/Primitives";
import { Wiring } from "@/components/sections/Wiring";
import { CV_PATH } from "@/lib/constants";
import { parseRich } from "@/lib/rich";
import {
  EXPERTISE_HEAD,
  EXPERTISE_INTRO,
  EXPERTISE_TILES,
  FEATURE_ROLES,
} from "@/content/expertise";
import { cn } from "@/lib/cn";

/**
 * 03 · What I build — bento grid (spans 8 · 4/4/4/4 · 6/6) with evidence
 * chips; the feature tile carries the all-lit role mini-grid. The 03·B
 * wiring schematic is part of this section in the prototype (#wiring is a
 * div inside section#expertise) — rendered via <Wiring /> at the end.
 */

const SPAN_CLASS = {
  wide: "b-feat",
  half: "b-half",
  third: "b-third",
} as const;

export function Expertise() {
  return (
    <section className="sec" id="expertise" aria-labelledby="exp-h">
      <div className="wrap">
        <SectionHead
          idx={EXPERTISE_HEAD.idx}
          title={EXPERTISE_HEAD.title}
          meta={EXPERTISE_HEAD.meta}
          hId="exp-h"
        />
        <p className="sec-lede">
          {parseRich(EXPERTISE_INTRO.lead)} {EXPERTISE_INTRO.cvLine.before}
          <a href={CV_PATH} download>
            {EXPERTISE_INTRO.cvLine.link}
          </a>
          {EXPERTISE_INTRO.cvLine.after}
        </p>
        <div className="bento">
          {EXPERTISE_TILES.map((t) => (
            <article className={cn("card", SPAN_CLASS[t.span])} key={t.code}>
              <div className="b-top">
                <span className="b-ico">
                  <Icon name={t.ic} size={21} strokeWidth={1.7} />
                </span>
                <span className="b-num">{t.code}</span>
              </div>
              {t.span === "wide" ? (
                <div className="b-feat-split">
                  <div>
                    <h3 className="b-title">{t.title}</h3>
                    <p className="b-desc" style={{ marginTop: 12 }}>
                      {parseRich(t.desc)}
                    </p>
                    <div className="b-ev">
                      {t.ev.map((e) => (
                        <span className="ev-chip" key={e}>
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="roles-vis" id="rolesVis">
                    {FEATURE_ROLES.map((r) => (
                      <div className="rv-cell lit" key={r.label}>
                        <b>{r.label}</b>
                        <small>{r.note}</small>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="b-title">{t.title}</h3>
                  <p className="b-desc">{parseRich(t.desc)}</p>
                  <div className="b-ev">
                    {t.ev.map((e) => (
                      <span className="ev-chip" key={e}>
                        {e}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
        <Wiring />
      </div>
    </section>
  );
}

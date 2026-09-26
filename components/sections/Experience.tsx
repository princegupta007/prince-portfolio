import { cn } from "@/lib/cn";
import { parseRich } from "@/lib/rich";
import {
  EXPERIENCE_HEAD,
  EXPERIENCE_LEAD,
  EXPERIENCE_RAIL,
  EXPERIENCE_ROLES,
} from "@/content/experience";

/**
 * 05 · Experience — sticky left rail (idx/h2/summary/facts) + timeline of
 * the three roles with diamond bullets, type-only product-context chips and
 * tech tags. The rail fill (#tlFill) is a static line in Phase 4; the
 * scroll-driven fill animation lands in Phase 5. Pure Server Component.
 */
export function Experience() {
  return (
    <section className="sec" id="experience" aria-labelledby="exph-h">
      <div className="wrap">
        <div className="tl">
          <div className="tl-left">
            <span className="idx" aria-hidden="true">
              {EXPERIENCE_HEAD.idx}
            </span>
            <h2 id="exph-h">{EXPERIENCE_HEAD.title}</h2>
            <p className="tl-sum">{EXPERIENCE_LEAD}</p>
            <div className="tl-facts">
              {EXPERIENCE_RAIL.map((f) => (
                <div className="tl-fact" key={f.label}>
                  <span>{f.label}</span>
                  <b>{f.value}</b>
                </div>
              ))}
            </div>
          </div>
          <div className="tl-right" id="tlRight">
            <div id="tlFill" aria-hidden="true" />
            {EXPERIENCE_ROLES.map((r) => (
              <article
                className={cn("role", r.current && "now")}
                key={r.company + r.period}
              >
                <div className="role-head">
                  <div>
                    <h3>
                      {r.title}{" "}
                      {r.titleNote && (
                        <span
                          style={{ color: "var(--ink-3)", fontWeight: 400 }}
                        >
                          {r.titleNote}
                        </span>
                      )}
                    </h3>
                    <p className="co">
                      {r.company} <em>· {r.place}</em>
                    </p>
                  </div>
                  <div className="role-side">
                    <span className={cn("dates", r.past && "past")}>
                      {r.period}
                    </span>
                    {r.badge && (
                      <span className="badge">
                        {r.current && (
                          <span className="dot" aria-hidden="true" />
                        )}
                        {r.badge}
                      </span>
                    )}
                  </div>
                </div>
                <ul>
                  {r.bullets.map((b, i) => (
                    <li key={i}>{parseRich(b)}</li>
                  ))}
                </ul>
                <div className="ctx-row">
                  <div className="ctx-label">{r.contextsLabel}</div>
                  <div className="ctx-chips">
                    {r.contexts.map((c) => (
                      <span className="ctx" key={c.name}>
                        <i /> {c.name} <small>{c.sub}</small>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="role-tech">
                  {r.tech.map((t) => (
                    <span className="tech" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

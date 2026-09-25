"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { HERO_CANVAS, HERO_CANVAS_CYCLE, HERO_FLOAT_CHIPS } from "@/content/hero";
import { useAutoCycle } from "@/hooks/useAutoCycle";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Hero specimen canvas — auto-cycling RBAC demo (prototype parity):
 * super admin → admin → company → partner every 2.9s; nav skeletons light
 * per role, scope/module text swaps, contacts mask below admin, role pill
 * cross-fades (180ms). Pauses off-screen / hidden tab; reduced motion keeps
 * the complete static super-admin state (SSR renders exactly that, so the
 * no-JS page is identical). Decorative — parent .hero-visual is aria-hidden.
 * Contact strings are specimen data (prototype: +91/+971 dials alternate,
 * masked roles see "hidden ·••").
 */
export function HeroCanvas() {
  const reduced = useReducedMotion();
  const [ci, setCi] = useState(0);
  const [pillRole, setPillRole] = useState<string>(HERO_CANVAS_CYCLE[0]!.role);
  const [pillOp, setPillOp] = useState(1);
  const [host, setHost] = useState<HTMLDivElement | null>(null);

  // role pill cross-fade (prototype: opacity 0 → swap text @180ms → 1),
  // driven from the cycle tick so no state is set inside an effect body
  const fadeT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advance = () => {
    setPillOp(0);
    if (fadeT.current) clearTimeout(fadeT.current);
    fadeT.current = setTimeout(() => {
      setCi((i) => {
        const next = (i + 1) % HERO_CANVAS_CYCLE.length;
        setPillRole(HERO_CANVAS_CYCLE[next]!.role);
        return next;
      });
      setPillOp(1);
    }, 180);
  };
  useAutoCycle(2900, advance, reduced ? null : host);
  useEffect(() => {
    const t = () => {
      if (fadeT.current) clearTimeout(fadeT.current);
    };
    return t;
  }, []);

  const c = HERO_CANVAS_CYCLE[ci] ?? HERO_CANVAS_CYCLE[0]!;
  const contactText = c.mask ? "hidden ·••" : ci % 2 ? "+971 •••• ••••" : "+91 •••• ••••";

  return (
    <div className="cv-wrap" data-depth="14">
      <div className="canvas" id="heroCanvas" ref={setHost}>
        <div className="scan" />
        <div className="cv-chrome">
          <span className="tl-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="cv-url">{HERO_CANVAS.badge}</span>
          <span className="cv-role" id="hcRole" style={{ opacity: pillOp }}>
            {pillRole}
          </span>
        </div>
        <div className="cv-body">
          <div className="cv-side" id="hcNav">
            {HERO_CANVAS.navSkels.map((w, i) => (
              <div
                key={i}
                className={i < c.on ? "nav-skel on" : "nav-skel off"}
                style={{ "--w": `${w}%` } as CSSProperties}
              />
            ))}
          </div>
          <div className="cv-main">
            <div className="cv-head">
              <span className="cv-title-bar" />
              <span className="cv-scope" id="hcScope">
                {c.scope}
              </span>
            </div>
            <div className="cv-rows">
              {HERO_CANVAS.rows.map((row) => (
                <div className="cv-row" key={row.st}>
                  <span
                    className="cv-cellbar"
                    style={{ "--w": row.w } as CSSProperties}
                  />
                  <span className={row.mut ? "cv-st mut" : "cv-st"}>
                    {row.st}
                  </span>
                  <span className={c.mask ? "cv-contact hc-contact masked" : "cv-contact hc-contact"}>
                    {contactText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="cv-foot">
          <span>
            {reduced ? HERO_CANVAS.footLeft : `${HERO_CANVAS.footLeft} — auto-cycling`}
          </span>
          <span>
            <b id="hcMods">{c.mods}</b> {HERO_CANVAS.modsLabel}
          </span>
        </div>
      </div>
      {HERO_FLOAT_CHIPS.map((fc) => (
        <div
          key={fc.pos}
          className={`float-chip ${fc.pos}`}
          data-depth={fc.depth}
        >
          <span
            className="fc-ico"
            style={
              fc.good
                ? ({
                    background:
                      "color-mix(in srgb,var(--good) 12%,transparent)",
                    borderColor:
                      "color-mix(in srgb,var(--good) 38%,transparent)",
                    color: "var(--good)",
                  } as CSSProperties)
                : undefined
            }
          >
            <Icon name={fc.icon} size={15} />
          </span>
          <span>
            <b>{fc.b}</b>
            <small>{fc.small}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

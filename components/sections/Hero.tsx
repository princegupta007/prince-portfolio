import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Pill } from "@/components/ui/Primitives";
import { HeroCanvas } from "@/components/interactive/HeroCanvas";
import { CONTACT, CV_PATH } from "@/lib/constants";
import { parseRich } from "@/lib/rich";
import { HERO } from "@/content/hero";
import { MARQUEE_ITEMS } from "@/content/marquee";

/**
 * 01 · Hero — Server Component. Rotator renders words[0] statically
 * (scramble = Phase 5), lede/CTAs/link chips verbatim, decorative specimen
 * canvas via the HeroCanvas island, marquee static (animation = Phase 5).
 */
export function Hero() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-h">
      <div className="hero-bg" aria-hidden="true" />
      <div id="heroGlow" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="status-row">
            {HERO.pills.map((p) => (
              <Pill key={p.text} dot={p.dot}>
                {p.text}
              </Pill>
            ))}
          </div>
          <p className="kicker">{HERO.kicker}</p>
          <h1 className="hero-h lines" id="hero-h">
            <span className="ln">
              <span>{HERO.h1.line1}</span>
            </span>
            <span className="ln">
              <span>
                <em className="outline" style={{ fontStyle: "normal" }}>
                  {HERO.h1.line2}
                </em>
                <span className="per">{HERO.h1.period}</span>
              </span>
            </span>
          </h1>
          <p className="hero-rot">
            {HERO.rot.before}
            <span className="rot" id="rotator">
              {HERO.rot.words[0]}
            </span>
            {HERO.rot.after}
          </p>
          <p className="hero-lede">{parseRich(HERO.lede)}</p>
          <div className="cta-row">
            <Button
              href="#expertise"
              variant="primary"
              magnetic
              iconEnd={
                <svg
                  className="arr arr-d"
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.4}
                  aria-hidden="true"
                >
                  <path d="M12 4v16m0 0 6-6m-6 6-6-6" />
                </svg>
              }
            >
              {HERO.ctas[0].label}
            </Button>
            <Button
              href={CV_PATH}
              download
              variant="ghost"
              magnetic
              icon={<Icon name="download" size={14} strokeWidth={2.2} />}
            >
              {HERO.ctas[1].label}
            </Button>
            <Button
              href={CONTACT.emailHref}
              variant="ghost"
              magnetic
              icon={<Icon name="mail" size={14} strokeWidth={2} />}
            >
              {HERO.ctas[2].label}
            </Button>
          </div>
          <div className="link-row">
            {HERO.links.map((l) => (
              <a
                key={l.label}
                className="link-chip"
                href={l.href}
                {...(l.icon === "phone"
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
              >
                <Icon name={l.icon} size={15} />
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className="hero-visual" id="heroVisual" aria-hidden="true">
          <HeroCanvas />
        </div>
      </div>
      <div className="mq" aria-hidden="true">
        <div className="mq-track" id="mqTrack">
          {[0, 1].map((dup) => (
            <div className="mq-set" key={dup}>
              {MARQUEE_ITEMS.map((item) => (
                <span className="mq-item" key={`${dup}-${item}`}>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

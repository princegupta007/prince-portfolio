import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CopyButton } from "@/components/interactive/CopyButton";
import PortraitLightbox from "@/components/interactive/PortraitLightbox";
import { CONTACT, CV_PATH, PORTRAIT_SRC } from "@/lib/constants";
import { parseRich } from "@/lib/rich";
import {
  BIG_EMAIL,
  CONTACT_AVAIL,
  CONTACT_CTA,
  CONTACT_HEAD,
  CONTACT_LEDE,
  CONTACT_ROWS,
} from "@/content/contact";
import type { ContactRow } from "@/content/types";

/**
 * 09 · Contact — lines h2 (static mask in Phase 4), giant mailto with the
 * split "@" span, CTA row (mailto / CopyButton island / CV download),
 * availability strip and contact rows. The email row is a CopyButton anchor:
 * click copies + toasts (prototype data-copy behaviour, navigation prevented).
 */

function Row({ row }: { row: ContactRow }) {
  const value = (
    <span className={row.numeric ? "v num" : "v"}>{row.value}</span>
  );
  const inner = (
    <>
      <span className="k">{row.label}</span>
      {value}
      {row.hint && <span className="copy-hint">{row.hint}</span>}
      {row.href && (
        <span className="go" aria-hidden="true">
          ↗
        </span>
      )}
    </>
  );
  if (row.copyable && row.href) {
    return (
      <CopyButton
        value={row.value}
        className="crow"
        ariaLabel={`${row.label} — click to copy`}
      >
        {inner}
      </CopyButton>
    );
  }
  if (row.wa) {
    // Two sibling links (tel + WhatsApp) — anchors must not nest, and server
    // components cannot carry event handlers, so the row is a plain div.
    return (
      <div className="crow">
        <span className="k">{row.label}</span>
        <span className="v num">{row.value}</span>
        <span className="row-acts">
          <a href={row.href} title="Call" aria-label={`Call ${row.value}`}>
            <Icon name="phone" size={14} />
          </a>
          <a
            href={row.wa}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp — same number"
            aria-label="Chat on WhatsApp, same number"
          >
            <Icon name="whatsapp" size={15} />
          </a>
        </span>
      </div>
    );
  }
  if (row.href) {
    return (
      <a
        className="crow"
        href={row.href}
        {...(row.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {inner}
      </a>
    );
  }
  return <div className="crow">{inner}</div>;
}

export function Contact() {
  const { start, copy, cv } = CONTACT_CTA;
  return (
    <section className="sec contact" id="contact" aria-labelledby="ct-h">
      <div className="wrap ct-grid">
        <div className="reveal">
          <div className="sec-head" style={{ marginBottom: 26 }}>
            <span className="idx" aria-hidden="true">
              {CONTACT_HEAD.idx}
            </span>
            <span className="meta" style={{ transform: "none" }}>
              {CONTACT_HEAD.meta}
            </span>
          </div>
          <h2 className="ct-h lines" id="ct-h" style={{ "--ld": "60ms" } as CSSProperties}>
            <span className="ln">
              <span>{CONTACT_HEAD.titleLines[0]}</span>
            </span>
            <span className="ln">
              <span>
                <em className="outline" style={{ fontStyle: "normal" }}>
                  {CONTACT_HEAD.titleLines[1]}
                </em>
              </span>
            </span>
          </h2>
          <p className="ct-lede" style={{ marginTop: 26 }}>
            {parseRich(CONTACT_LEDE)}
          </p>
          <a className="mailto-big" href={CONTACT.emailHref}>
            {BIG_EMAIL.user}
            <span className="at">{BIG_EMAIL.at}</span>
            {BIG_EMAIL.domain}
          </a>
          <div className="cta-row" style={{ marginTop: 30 }}>
            <Button
              href={CONTACT.emailHref}
              variant={start.variant}
              magnetic
              icon={<Icon name={start.icon} size={14} />}
            >
              {start.label}
            </Button>
            <CopyButton
              value={CONTACT.email}
              className="btn btn-ghost magnetic"
            >
              <Icon name={copy.icon} size={14} strokeWidth={1.9} />
              {copy.label}
            </CopyButton>
            <Button
              href={CV_PATH}
              download
              variant={cv.variant}
              magnetic
              icon={<Icon name={cv.icon} size={14} strokeWidth={2.2} />}
            >
              {cv.label}
            </Button>
          </div>
        </div>
        <div className="ct-card reveal" style={{ "--d": "120ms" } as CSSProperties}>
          {PORTRAIT_SRC && (
            <div className="ct-id">
              <PortraitLightbox
                src={PORTRAIT_SRC}
                name={CONTACT.name}
                roleLine={`${CONTACT.role} · Jaipur, India`}
              />
              <span className="ct-id-txt">
                <b>{CONTACT.name}</b>
                <small>{CONTACT.role} · Jaipur, India</small>
              </span>
            </div>
          )}
          <div className="ct-avail">
            <span className="dot" aria-hidden="true" />
            <span>
              <b>{CONTACT_AVAIL.b}</b>
              <small>{CONTACT_AVAIL.small}</small>
            </span>
          </div>
          {CONTACT_ROWS.map((row) => (
            <Row row={row} key={row.kind} />
          ))}
        </div>
      </div>
    </section>
  );
}

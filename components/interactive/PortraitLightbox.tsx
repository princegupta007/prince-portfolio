"use client";

/**
 * PortraitLightbox — ID-badge thumbnail + accessible lightbox dialog.
 * Prototype parity: zoom-in thumbnail button; dialog with blurred backdrop,
 * framed 1:1 portrait, caption bar and pulsing availability dot.
 * Closes via ✕ / backdrop / ESC; focus returns to the trigger; body scroll
 * locked while open; entrance animation collapses under reduced motion (CSS).
 */
import { useEffect, useRef, useState } from "react";

export default function PortraitLightbox({
  src,
  name,
  roleLine,
}: {
  src: string;
  name: string;
  roleLine: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [on, setOn] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    setMounted(true);
    requestAnimationFrame(() => setOn(true));
    document.body.style.overflow = "hidden";
  };
  const hide = () => {
    setOn(false);
    document.body.style.overflow = "";
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => setMounted(false), rm ? 0 : 320);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (mounted) closeRef.current?.focus();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted]);

  useEffect(() => () => {
    document.body.style.overflow = "";
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="ct-id-btn"
        title="View profile photo"
        aria-haspopup="dialog"
        aria-label={`View profile photo of ${name}`}
        onClick={show}
      >
        {/* The square intrinsic box matches the responsive CSS crop → CLS 0. */}
        <img
          src={src}
          alt={`Portrait of ${name}`}
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
        />
      </button>

      <div
        className={`lb${on ? " on" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Profile photo — ${name}`}
        hidden={!mounted}
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("lb-bg")) hide();
        }}
      >
        <div className="lb-bg" aria-hidden="true" />
        <figure className="lb-card" style={{ margin: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- single embedded asset, no layout shift */}
          <img src={src} alt={`Portrait of ${name}`} width={520} height={520} />
          <figcaption className="lb-cap">
            <span>
              <b>{name}</b>
              <small>{roleLine}</small>
            </span>
            <span className="dot" aria-hidden="true" />
          </figcaption>
          <button
            ref={closeRef}
            type="button"
            className="lb-x"
            aria-label="Close photo view"
            onClick={hide}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </figure>
      </div>
    </>
  );
}

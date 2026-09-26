"use client";

import type { MouseEvent, ReactNode } from "react";
import { useToast } from "@/components/ui/Toast";

/**
 * Copy-to-clipboard control (prototype [data-copy] behaviour):
 * navigator.clipboard → hidden-textarea execCommand fallback → toast via the
 * single ToastProvider (rule 40). Renders <a> when `href` is given (click is
 * intercepted — the prototype's copy rows never navigate), else <button>.
 */
export function CopyButton({
  value,
  href,
  className,
  children,
  ariaLabel,
}: {
  value: string;
  href?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const { show } = useToast();

  const copy = (e: MouseEvent) => {
    e.preventDefault();
    const ok = () => show(`Copied · ${value}`);
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        ok();
      } catch {
        show(`Copy failed — ${value}`);
      }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(ok, fallback);
    } else {
      fallback();
    }
  };

  if (href) {
    return (
      <a
        href={href}
        className={className}
        onClick={copy}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={className}
      onClick={copy}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

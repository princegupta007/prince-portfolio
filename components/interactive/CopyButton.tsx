"use client";

import type { MouseEvent, ReactNode } from "react";
import { useToast } from "@/components/ui/Toast";

/**
 * Copy-to-clipboard control (prototype [data-copy] behaviour):
 * navigator.clipboard → hidden-textarea execCommand fallback → toast via the
 * single ToastProvider (rule 40). Always a <button>: copy rows never navigate
 * (phase-07 button-vs-link correctness — links are for navigation only).
 */
export function CopyButton({
  value,
  className,
  children,
  ariaLabel,
}: {
  value: string;
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

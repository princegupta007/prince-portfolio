import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Mono micro-label chip. `k` = highlighted key chip (chip-key). */
export function Chip({
  children,
  k = false,
  className,
}: {
  children: ReactNode;
  k?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("chip", k && "chip-key", className)}>{children}</span>
  );
}

/** Uppercase status pill; `dot` renders the pulsing availability dot. */
export function Pill({
  children,
  dot = false,
  className,
}: {
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("pill", className)}>
      {dot && <span className="dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** Surface card with pointer-glow slot (--mx/--my set by InteractionLayer in Phase 5). */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("card", className)}>{children}</div>;
}

/** Small mono tag; tone maps to .tag-ok / .tag-live modifiers. */
export function Tag({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "ok" | "live";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "tag",
        tone === "ok" && "tag-ok",
        tone === "live" && "tag-live",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Section heading row: idx chip + h2 + rule + meta (prototype .sec-head). */
export function SectionHead({
  idx,
  title,
  meta,
  className,
}: {
  idx: string;
  title: string;
  meta?: string;
  className?: string;
}) {
  return (
    <div className={cn("sec-head", className)}>
      <span className="idx" aria-hidden="true">
        {idx}
      </span>
      <h2>{title}</h2>
      <span className="rule" aria-hidden="true" />
      {meta && <span className="meta">{meta}</span>}
    </div>
  );
}

/**
 * Number formatting for the 02·Numbers counters.
 * Phase 1: static formatting (server-rendered final values).
 * Phase 5: animated counting via useCountUp — format contract stays identical.
 * Spec: agent/context/prototype-notes.md §B row 9
 *   3.5+ (1 decimal) · 7 · 5,000+ (grouped) · ~30% (prefix) · 4 · 8
 */

export interface CounterFormat {
  /** Fraction digits (default 0). */
  decimals?: number;
  /** Rendered before the number, e.g. "~". */
  prefix?: string;
  /** Rendered after the number, e.g. "+" or "%". */
  suffix?: string;
  /** Thousands grouping (default true). */
  group?: boolean;
}

export function formatCounter(
  value: number,
  format: CounterFormat = {},
): string {
  const { decimals = 0, prefix = "", suffix = "", group = true } = format;
  const formatted = group
    ? value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : value.toFixed(decimals);
  return `${prefix}${formatted}${suffix}`;
}

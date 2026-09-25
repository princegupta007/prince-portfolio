/**
 * In-house class-name joiner (plan §1: no clsx/tailwind-merge dependency).
 * Deliberately minimal — conditional classes are passed as `false`/`undefined`.
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

import type { ReactNode } from "react";

/**
 * Tiny rich-text parser for content/*.ts strings (server + client safe).
 *   **text**  → <b>   (accent-coloured emphasis, prototype <b>)
 *   __text__  → <u>   (good-coloured emphasis, prototype <u> — audit lines)
 * Everything else renders as plain text. No HTML is ever injected —
 * content modules stay data, components stay in control of markup.
 */

const RICH_RX = /\*\*(.+?)\*\*|__(.+?)__/g;

/**
 * `boldTag` picks the element the prototype styled per context:
 *   strong — prose (hero lede, bento desc, timeline bullets, ct-lede)
 *   em     — .wire-lede accent words
 *   b      — audit console + edu-note
 */
export function parseRich(
  text: string,
  boldTag: "strong" | "em" | "b" = "strong",
): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  RICH_RX.lastIndex = 0;
  while ((m = RICH_RX.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(
        boldTag === "em" ? (
          <em key={key++} style={{ fontStyle: "normal" }}>
            {m[1]}
          </em>
        ) : boldTag === "b" ? (
          <b key={key++}>{m[1]}</b>
        ) : (
          <strong key={key++}>{m[1]}</strong>
        ),
      );
    } else out.push(<u key={key++}>{m[2]}</u>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Convenience: true when the string contains no rich markers. */
export function isPlain(text: string): boolean {
  RICH_RX.lastIndex = 0;
  return !RICH_RX.test(text);
}

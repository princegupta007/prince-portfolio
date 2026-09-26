import type { ReactNode, SVGProps } from "react";

/**
 * In-house icon registry — every glyph ported 1:1 from the frozen prototype
 * (inline <svg> usage + its IC{} map). No icon packages (rule 30).
 * Stroke icons: fill=none stroke=currentColor; `fill` glyphs: github/linkedin.
 */
type Glyph = { sw?: number; fill?: boolean; body: ReactNode };

const GLYPHS = {
  search: {
    sw: 2.2,
    body: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
  },
  moon: {
    sw: 1.8,
    body: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
  },
  sun: {
    sw: 1.8,
    body: (
      <>
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
      </>
    ),
  },
  download: {
    sw: 2.2,
    body: <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 20h16" />,
  },
  "arrow-down": { sw: 2.4, body: <path d="M12 4v16m0 0 6-6m-6 6-6-6" /> },
  "arrow-up": { sw: 2.2, body: <path d="M12 20V4m0 0-6 6m6-6 6 6" /> },
  "arrow-right": {
    sw: 2.1,
    body: <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />,
  },
  mail: {
    sw: 2,
    body: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 5.5L20 7" />
      </>
    ),
  },
  whatsapp: {
    fill: true,
    body: (
      <path d="M12 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.1 4.4c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.5-.6c.1-.2.2-.3.3-.5v-.5L9.4 8.6c-.2-.4-.4-.4-.5-.4Z" />
    ),
  },
  github: {
    fill: true,
    body: (
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .26.18.57.69.48A10 10 0 0 0 12 2Z" />
    ),
  },
  linkedin: {
    fill: true,
    body: (
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.5 4.76 5.76V21h-4v-5.6c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.2 1.46-2.2 2.97V21h-4V9Z" />
    ),
  },
  phone: {
    sw: 1.9,
    body: (
      <path d="M5 4h4l1.6 4.2-2.2 1.6a13.6 13.6 0 0 0 5.8 5.8l1.6-2.2L20 15v4a1.5 1.5 0 0 1-1.7 1.5A16.6 16.6 0 0 1 3.5 5.7 1.5 1.5 0 0 1 5 4Z" />
    ),
  },
  lock: {
    sw: 1.9,
    body: (
      <>
        <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" />
        <path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7" />
      </>
    ),
  },
  bolt: {
    sw: 1.9,
    body: <path d="M13 2 4.5 13.5H11L9.8 22 19 10h-6.4L13 2Z" />,
  },
  broadcast: {
    sw: 1.9,
    body: (
      <>
        <path d="M4.5 12a7.5 7.5 0 0 1 15 0M7.8 12a4.2 4.2 0 0 1 8.4 0" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        <path d="M12 13.4V20" />
      </>
    ),
  },
  shield: {
    sw: 1.7,
    body: (
      <>
        <path d="M12 2.8 4.8 5.6v5.6c0 4.4 3 8.3 7.2 9.9 4.2-1.6 7.2-5.5 7.2-9.9V5.6L12 2.8Z" />
        <path d="m9.2 11.8 2 2 3.6-3.8" />
      </>
    ),
  },
  grid: {
    sw: 1.7,
    body: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
      </>
    ),
  },
  bag: {
    sw: 1.7,
    body: (
      <>
        <path d="M3.5 9 7 4.5h10L20.5 9M3.5 9h17M3.5 9v9.5a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5V9" />
        <path d="M9.5 13.2a2.6 2.6 0 0 0 5 0" />
      </>
    ),
  },
  store: {
    sw: 1.7,
    body: (
      <>
        <path d="M4 7h10M18.5 7H20M4 17h4M12.5 17H20" />
        <circle cx="16.2" cy="7" r="2.3" />
        <circle cx="10.2" cy="17" r="2.3" />
      </>
    ),
  },
  signal: {
    sw: 1.7,
    body: (
      <>
        <path d="M4.8 12.5a7.2 7.2 0 0 1 14.4 0" />
        <path d="M7.8 12.5a4.2 4.2 0 0 1 8.4 0" />
        <circle cx="12" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
        <path d="m12 12.5 4-3M12 13.8V20M9 20h6" />
      </>
    ),
  },
  sliders: {
    sw: 1.7,
    body: (
      <>
        <path d="M4 7h10M18.5 7H20M4 17h4M12.5 17H20" />
        <circle cx="16.2" cy="7" r="2.3" />
        <circle cx="10.2" cy="17" r="2.3" />
      </>
    ),
  },
  db: {
    sw: 1.7,
    body: (
      <>
        <ellipse cx="12" cy="5.8" rx="7.5" ry="3" />
        <path d="M4.5 5.8v12.4c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V5.8" />
        <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
      </>
    ),
  },
  info: {
    sw: 2,
    body: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 7.6v.1" />
      </>
    ),
  },
  check: { sw: 2.6, body: <path d="m5 12.5 4.5 4.5L19 7" /> },
  cap: {
    sw: 1.8,
    body: (
      <>
        <path d="M12 3 2.8 7.4 12 11.8l9.2-4.4L12 3Z" />
        <path d="M6.5 9.6v5.2c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9V9.6M21.2 7.4v6" />
      </>
    ),
  },
  copy: {
    sw: 1.9,
    body: (
      <>
        <rect x="9" y="9" width="11" height="11" rx="2.4" />
        <path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H16" />
      </>
    ),
  },
  /* IC{} map glyphs (wiring nodes / bento) */
  ui: {
    sw: 1.7,
    body: (
      <>
        <rect x="3" y="4" width="18" height="15" rx="2.4" />
        <path d="M3 9.2h18M9.2 9.2V19" />
      </>
    ),
  },
  comp: {
    sw: 1.7,
    body: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.7" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.7" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.7" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.7" />
      </>
    ),
  },
  perf: {
    sw: 1.7,
    body: <path d="M13 2.5 4.8 13.8h5.6L10 21.5l8.6-11.6h-5.9l.3-7.4Z" />,
  },
  query: {
    sw: 1.7,
    body: (
      <>
        <ellipse cx="12" cy="5.8" rx="7.5" ry="3" />
        <path d="M4.5 5.8v12.4c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V5.8" />
        <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
      </>
    ),
  },
  live: {
    sw: 1.7,
    body: (
      <>
        <path d="M4.8 12.5a7.2 7.2 0 0 1 14.4 0" />
        <path d="M7.8 12.5a4.2 4.2 0 0 1 8.4 0" />
        <circle cx="12" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
        <path d="M12 13.8V20M9 20h6" />
      </>
    ),
  },
  auth: {
    sw: 1.7,
    body: (
      <>
        <path d="M12 2.8 4.8 5.6v5.6c0 4.4 3 8.3 7.2 9.9 4.2-1.6 7.2-5.5 7.2-9.9V5.6L12 2.8Z" />
        <path d="m9.2 11.8 2 2 3.6-3.8" />
      </>
    ),
  },
  api: {
    sw: 1.7,
    body: (
      <>
        <path d="m8 6-5 6 5 6M16 6l5 6-5 6" />
        <path d="M13.4 4.2 10.6 19.8" />
      </>
    ),
  },
  test: {
    sw: 1.7,
    body: (
      <>
        <path d="M9.5 3h5M10.5 3v5.2L5 17a2.1 2.1 0 0 0 1.8 3.2h10.4A2.1 2.1 0 0 0 19 17l-5.5-8.8V3" />
        <path d="M7.3 14.5h9.4" />
      </>
    ),
  },
  ship: {
    sw: 1.7,
    body: (
      <>
        <path d="M6.8 17.5a4.4 4.4 0 1 1 .9-8.7 6 6 0 0 1 11.5 1.7 3.6 3.6 0 0 1-1 7" />
        <path d="M12 12.5V21m0-8.5-3 3m3-3 3 3" />
      </>
    ),
  },
} as const;

export type IconName = keyof typeof GLYPHS;

type IconProps = {
  name: IconName;
  size?: number;
} & Omit<SVGProps<SVGSVGElement>, "name">;

export function Icon({ name, size = 16, ...rest }: IconProps) {
  const glyph: Glyph = GLYPHS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={glyph.fill ? "currentColor" : "none"}
      stroke={glyph.fill ? "none" : "currentColor"}
      strokeWidth={glyph.sw ?? 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {glyph.body}
    </svg>
  );
}

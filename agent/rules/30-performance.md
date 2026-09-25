# Rule 30 — Performance (first-class requirement)

## Budgets (plan §5 — measured, not hoped for)

| Metric                             | Budget                                              |
| ---------------------------------- | --------------------------------------------------- |
| Initial client JS (`/`, gz)        | **≤ 70 KB** (lazy palette chunk counted separately) |
| LCP (lab, mobile 4G/4×CPU)         | < 1.8 s                                             |
| CLS                                | 0                                                   |
| INP                                | < 200 ms                                            |
| Long tasks during scroll journey   | none > 50 ms (4× throttle)                          |
| Lighthouse mobile (median of 3)    | ≥ 95 in all four categories                         |
| Phase motion layer delta (Phase 5) | ≤ +12 KB gz                                         |

## Rendering strategy

- Server Components by default; `"use client"` only at island roots (island map: plan §2.3, analysis artifact §2). Single static route `/` — prerendered; zero serverless functions/middleware(proxy)/cron/DB.
- Content must be complete without JS (Phase 4 no-JS contract): counters at final values, wiring panel node 01, exhibit super-admin state.

## Dependencies & third parties

- Runtime deps: `next, react, react-dom` only. Every proposed addition = owner approval + written justification.
- Zero third-party runtime scripts/styles. Fonts self-hosted via `next/font`. Sole future exception: Vercel Speed Insights beacon (Phase 12, free tier).
- No images at launch except `public/og.png` (static, Phase 8) + `favicon.svg` + CV PDF.

## Motion & DOM discipline

- Animate transform/opacity only; no width/height/top/left/margin animations.
- One shared IntersectionObserver for reveals; one delegated `pointermove` for glow/magnetism (InteractionLayer); rAF-throttled scroll handlers; passive listeners.
- Auto-cycles pause when off-screen (IO) AND on `document.hidden`; clear intervals on unmount.
- `will-change` limited to hero canvas + float chips. No parallax/magnetism on `pointer:coarse`.
- Hydration must not shift layout (CLS 0): reserve counter width (tabular-nums), preloader is a fixed overlay, reveal hidden-state is no-JS-safe.

## Caching & delivery

- `/_next/static/*`: `public, max-age=31536000, immutable` (Phase 9, vercel.json).
- `/cv/*.pdf`: 1d + SWR 7d; `/og.png`, `/favicon.svg`: 7d (Phase 9).
- Measure with: `pnpm agent:bundle-check` (Phase 9), Lighthouse CLI on `next start`, Playwright traces.

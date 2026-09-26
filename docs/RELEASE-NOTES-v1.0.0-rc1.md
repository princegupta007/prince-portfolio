# Release Notes — v1.0.0-rc1 (launch candidate)

Cut from `develop` after Phase 12. Tag: `v1.0.0-rc1` (local; owner pushes).

## What ships
- Single-page portfolio, 9 indexed sections + styled 404, dark/light themes
  (cookie-persisted, no flash), reduced-motion parity throughout.
- Interactive islands: role-based access-matrix exhibit, animated wiring
  schematic, hero particle canvas, ⌘K command palette (15 commands), counters,
  scramble title, magnetic CTA, scrollspy rail, preloader (first view only).
- Content truth: CV + profile only; company names limited to Konstant
  Infosolutions / SSTPL; zero invented claims; project names never appear
  (enforced by content-scan in CI).
- Accessibility: WCAG 2.1 AA, axe 0 violations across 10 states, keyboard-complete
  (skip link, roving tabindex islands, dialog semantics, focus return).
- SEO: metadata, OpenGraph/Twitter cards, JSON-LD Person, robots.txt,
  sitemap.xml, canonical; 404 returns real 404 status with styled page.
- Performance: first-load JS 184.47 KB gz (budget 190), all chunks 189.88 KB gz
  (budget 200), agent-code leakage into client bundles 0 (budget 350 cap unused);
  CLS 0.000; fonts self-hosted; immutable caching on /_next/static.
- Resilience: route error boundary, global error shell, streaming loading shell,
  per-island static fallbacks, clipboard-denied fallback, storage try/catch.
- Security headers (CSP enforced, nosniff, referrer policy, frame DENY,
  permissions policy) single-sourced in next.config.ts; x-powered-by off.

## Validation at RC (all on built app, local :3100)
vitest 18/18 · e2e smoke journeys 10/10 · responsive 22/22 (11 viewports ×
2 themes) · SEO 11/11 · axe 0/10 states · phase-5 suite 44/44 · phase-6 suite
24/24 · content-scan 68 files clean · link-check green · bundle budgets within ·
prod smoke green.

## Known limitations (documented, accepted)
- Lighthouse performance ≈84–85 in this sandbox is a lab artifact (slow CI
  CPU); real-network runs expected 95+ (see agent/context/decisions.md D38).
- CSP script-src includes 'unsafe-inline' — required by App Router inline flight
  data; a nonce would need a serverless function (out of scope, D39).
- Bundle budget conflict D35: prototype motion fidelity vs 150 KB target —
  resolved at 190/200 with owner-visible rationale.

## Not in scope (by design)
No backend, database, auth, analytics, email service, CMS, or serverless
functions. Contact actions are mailto:/clipboard/links only.

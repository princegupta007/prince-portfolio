# Workflow · Performance audit (regression)

1. `pnpm agent:bundle-check` — first-load JS (SSR script set, gz) vs budget.json;
   agent/ leakage = 0; total chunk envelope. FAILS on regression (D35).
2. Lighthouse (production build + `next start`):
   mobile ×3 median + desktop ×1, all categories:
   `CHROME_PATH=<chromium> pnpm dlx lighthouse <url> --form-factor=mobile --screenEmulation.mobile --output=json ...`
   Targets (prod, Vercel edge): perf/a11y/BP/SEO ≥95, LCP <1.8s, CLS 0, TBT <150ms.
   Lab-on-sandbox overstates LCP/TBT (shared CPU, no CDN, TTFB-bound) — see D38;
   always record `server-response-time` alongside to separate env from app.
3. Long tasks: DevTools/CDP trace at 4× throttle, scroll hero→exhibit→contact;
   flag tasks >50ms (batch DOM writes; single delegated listeners; rAF throttles).
4. Animation grep: `transition:`/`@keyframes` with layout props (width/height/top/left/margin)
   → transform/opacity or justified in decisions.md; will-change allow-list = canvas/chips.
5. Fonts: 3 self-hosted families, latin subsets; verify single subset download per family
   (network panel / lighthouse font audit).
6. CSS: built chunk size in report; unused keyframes = 0 (grep @keyframes vs animation:).
7. Third-party: zero runtime external scripts; Speed Insights beacon (Phase 12) is the
   single allowed addition — re-verify here after any deploy change.
8. Caching: `curl -I` on /_next/static/*, /cv/*.pdf, /og.png post-deploy (vercel.json).

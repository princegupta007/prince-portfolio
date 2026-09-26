# Decisions Log (durable — survives artifact expiry)

Format: `D# · date · decision · rationale · source`.

- **D1 · 2026-09-25 · Theme persistence via cookie `pg-theme`, read in `app/layout.tsx` at SSR.** Deviation from prototype's localStorage; eliminates first-paint theme flash. Approved in IMPLEMENTATION-PLAN rev 1.1 (deviation #1). Source: plan §2.3, prototype-notes §C.
- **D2 · 2026-09-25 · Command palette ships as lazy chunk (`next/dynamic`, mounted on first intent).** Keeps initial JS ≤ 70 KB gz budget. Approved deviation #2. Source: plan §2.3/§5.
- **D3 · 2026-09-25 · Build executor = Arena.ai agent ("Option A"), not Antigravity.** Owner decision after comparing workflows. The phase prompts in `agent/prompts/` remain the canonical execution contract; commit trailer adapts to `Agent: Arena-Agent (phase-NN)`; rule text "Antigravity-specific files" applies to any coding agent. Owner pushes to GitHub; agent never holds credentials. Source: owner chat decision.
- **D4 · 2026-09-25 · Branch model: `main` = production (untouched during build), `develop` = integration, `phase/NN-<slug>` branches cut from and squash-merged into `develop`, deleted after merge; releases via `develop → main` PR + tag (Phase 12 launch candidate, Phase 13 `v1.0.0`).** Source: agent/prompts/README.md "Git branch model".
- **D5 · 2026-09-25 · Repo baseline: `develop` (4dedf32, README+LICENSE+.gitignore) is 1 commit ahead of `main` (7221b5d). All phase work bases on `develop`; the existing root `.gitignore` is kept and extended (agent/artifacts, agent/scratch), never replaced.** Source: clone inspection.
- **D6 · 2026-09-25 · `agent/artifacts/` + `agent/scratch/` are gitignored; durable knowledge lives in `agent/context/` and `docs/`.** Phase evidence is reviewed by owner in the workspace/PR description before push. Source: plan §2.13 isolation guarantees.
- **D7 · 2026-09-25 · Prototype and CV frozen by hash:** `docs/prototype/index.html` sha256 `839584ca06cb0db53d0e92425a7cc2b4e867ebf23aece238e8b2a60ac0ca8f5e`; `docs/cv/Prince_Gupta_Frontend_Engineer.pdf` sha256 `b5cdf31ff436c510f28bafef2ec8e7091245a4e4d793ab1a99ff7f4840bf457a`. Any change to these files invalidates Phase 0 analysis and requires owner re-approval. Source: this phase.
- **D8 · 2026-09-25 · Phase 2 porting notes:** tokens/keyframes/component CSS copied verbatim from prototype `:root` / `html[data-theme="light"]` / rule set (no invented hex). Three micro-rules had no extractable prototype source and were implemented to match the design language, to be confirmed in the Phase 6 visual-parity pass: `.pill .dot` pulse ring, `.marquee` edge mask, `.sec-head .idx` chip styling; `.toast` host styling likewise (Phase 4 wires usage). Source: extraction session 2026-09-25.
- **D9 · 2026-09-25 · Icon registry = 33 glyphs ported 1:1** from prototype inline `<svg>` usage + its `IC{}` map (names: search…ship incl. fill-based github/linkedin). Single `<Icon>` component, no icon package. Source: prototype svg audit.
- **D10 · 2026-09-25 · Next 16 font axes:** `wght` is implicit for variable fonts; `axes` lists extras only (`["opsz","wdth"]` for Bricolage Grotesque) — TS enforces this. Source: next/font types + bundled docs.
- **D11 · 2026-09-25 · Route `/` is on-demand SSR (`ƒ`), not static:** reading `pg-theme` via `cookies()` in `layout.tsx` (D1, no-FOUC) opts the route out of prerendering. Accepted for now (single route, Hobby runtime handles it); Phase 9 must measure TTFB/LCP and evaluate mitigation (e.g. edge caching headers or accepting dynamic). Zero API/serverless *functions* remain — SSR of the page route is runtime rendering, not a function endpoint. Source: Next 16 build output + plan §7.
- **D12 · 2026-09-25 · Phase-4 copy trims motion promises:** wiring head meta renders "Select a node · ← → keys also move" and the hero canvas footer "rbac.specimen" (prototype's "or let it cycle" / "— auto-cycling" return with the Phase-5 auto-cycle). No dead promises in no-JS/SSR state.
- **D13 · 2026-09-25 · Audit timestamps client-only:** SSR + first client paint render the super-admin audit lines WITHOUT hh:mm:ss stamps (server time would mismatch hydration); stamps appear on role-switch events, which is when the console rebuilds. Stagger animation stays Phase 5.
- **D14 · 2026-09-25 · Responsive matrix verbatim:** the filtered media-query subset dropped bare selectors (`.tl`, `.bento`, `.matrix`, `.pr`, `.edu`, …) causing 567px min-width overflow at 390vw; replaced with the prototype RESPONSIVE block verbatim (shell rules duplicate Phase-3's identical rules — harmless).
- **D15 · 2026-09-25 · Token alias block:** Phase 2 renamed palette tokens to Tailwind v4 `--color-*`; ported section CSS speaks prototype names. `:root` now aliases `--ink/--line/--panel/--accent*/--good/--r-*/…` → `--color-*`, so the light-theme override block re-themes everything through the aliases.
- **D16 · 2026-09-25 · Registry + primitive growth:** icon registry gained `bag` (E-03 tile glyph); `SectionHead` gained `hId` + `titleLines` (line-mask headings, static in P4); rich text lives in `lib/rich.tsx` (`**bold**`/`__good__`, boldTag strong|em|b per prototype context).
- **D17 · 2026-09-25 · check-layout back-to-top polls:** the page is now ~9 viewports tall; smooth scroll to top exceeds the fixed 1.2s wait — the check polls up to 8s instead.
- **D18 · 2026-09-25 · Phase-4 JS delta +6.12 KB gz** (172.77 → 178.89 KB gz initial scripts, measured against develop @ 98626b4 via hardlink worktree build) — inside the ≤ +8 KB budget. Islands: HeroCanvas, WiringDiagram, RoleLens, CopyButton.
- **D19 · 2026-09-26 · Pre-paint boot script gates ALL motion hidden-states:** an inline `<head>` script (layout.tsx) adds `html.js` always and `html.pg-pre` only when `sessionStorage` has no `pg-seen` (then sets it). CSS hides `#loader` unless `.pg-pre`, and reveal/line-mask hidden states are `.js`-scoped — so no-JS visitors, search crawlers and revisits see the complete static page with zero flash; `<html>` carries `suppressHydrationWarning` (next-themes pattern). sessionStorage wrapped in try/catch for private mode. Source: prototype loader/reveal JS + plan §5 reduced-motion guarantee.
- **D20 · 2026-09-26 · Palette DOM/CSS is prototype-verbatim (`li[role=option] > button.sel` + `.ic`/`.g` spans) and its triggers are DELEGATED:** `PaletteHost` listens for ⌘K/Ctrl+K, clicks on any `[data-open-cmd]` element and pointer-over (220ms hover-intent = chunk preload without opening). The server-rendered header button therefore needs no client code; focus restore is native `<dialog>`. Source: prototype palette CSS/JS audit.
- **D21 · 2026-09-26 · Hero canvas keeps the prototype's decorative dial quirk:** the specimen shows `+91` for odd phases and `+971` for even (ci%2), and `hidden ·••` when the role masks contacts. It is sample data inside an aria-hidden permission demo, not a claim about Prince; reproducing it keeps visual parity with the approved prototype. Source: prototype cycle JS `ci%2?"971":"91"`.
- **D22 · 2026-09-26 · Toast stays the single context provider (rule 40):** Phase 5 adds enter/exit animation via `.toast.on` (opacity/transform transition, mount→rAF→on, unmount delayed past the exit) instead of a new event bus; `CopyButton`/palette/`ThemeToggle` all call `useToast().show`. Source: rule 40 (one aria-live region).
- **D23 · 2026-09-26 · Audit console now APPENDS with 150ms stagger, trimmed to the last 7 lines (prototype pushAudit); lines carry stable ids** (SSR block fixed 0–2, client sequence from 100) so the trim-from-front never re-triggers the `audIn` animation via index-key shifts. Boot replays once on mount (timestamps-on-load), replacing the SSR preview block inside the first stagger timer (React-19 lint: no sync setState in effect bodies). Source: prototype pushAudit JS.
- **D24 · 2026-09-26 · Phase-5 JS delta +5.13 KB gz** (178.89 → 184.02 KB gz initial scripts) — inside the ≤ +12 KB budget; the palette chunk is excluded by design (D2) and its lazy fetch on first ⌘K is asserted in check-phase05. New islands: Preloader, Reveal, InteractionLayer, HeroFx, ScrambleWord, Counter, RoleVisual, TimelineFill, PaletteHost(+lazy CommandPalette). Source: this phase, measured via SSR script tags.

### D25 · Visual-grid harness + triple assertion (phase-06)
Responsive verification is automated via `agent/tools/screenshot-grid.ts` (script
`agent:screenshot-grid`): 2 themes × 11 widths, full-page + section clips + `overflow.json`.
Three assertion classes: (1) document scrollWidth overflow, (2) fixed layers escaping the
viewport, (3) **clipped** elements wider than the viewport outside approved scrollers
(`.role-tabs`, `.mock-side`, `.cmd-list`) / marquee — added after F-01 proved `overflow:hidden`
parents hide clipping from scrollWidth. Playwright added as a devDependency: test/verification
only, zero runtime JS/CSS impact (bundle budget unaffected).

### D26 · Canvas nav: wrap, don't scroll (phase-06)
The prototype's ≤760 `.cv-side` row scroller conflicts with the phase restriction (two approved
scrollers only). Replaced with a 4×2 wrapped grid (`repeat(4, minmax(0,1fr))`, `gap:6px`,
`.nav-skel{min-width:0}` to drop the scroller-era 96px floor). All eight skeletons stay visible
at every width; no new scroll axis introduced.

### D27 · Hero P0 fix via flex-wrap, not ellipsis-only (phase-06)
`.cv-chrome`'s nowrap intrinsic min-content (419px) stretched the hero track at ≤414. Ellipsis +
`min-width:0` fix used width but not intrinsic size; the row now wraps at ≤640
(`flex-wrap:wrap`) alongside global `min-width:0`/ellipsis and ≤640 row compression. Documented
in findings F-01.

### D28 · Coarse-pointer & keyboard parity (phase-06)
`@media (pointer:coarse)` enforces ≥44px interactive targets (menu links, role tabs, work rows,
palette options, icon buttons, burger, kbd chips). Copy hints gain `:focus-visible`/`:focus-within`
parity. Approved scrollers get thin scrollbars + edge-fade masks as scroll affordances.

### D29 · Contrast token deltas (phase-07)
WCAG AA fixes via tokens only (before → after, ratio on theme bg):
dark `--color-ink-3` #696f7b → #7b8290 (3.85 → 5.10); light `--color-ink-3` #868c98 →
#5f6670 (3.07 → 5.27); `.audit-body .ln em` hardcoded #5a6170 → #7b8290 (console is
dark-surfaced in both themes, 3.4 → 4.9); `.f-nav a em` opacity .7 removed (diluted olive
3.9 → 5.27); `.mock-nav.off` container opacity .3 → dim only `.sq`/`.lock` (text stays at
ink-3, 2.0 → 4.9/5.2). Full table: artifacts contrast-table.md (0 AA misses).

### D30 · Semantic markup upgrades (phase-07)
Real list markup (`ul>li`) inside all three nav landmarks + Stack chips/Experience ctx as
role=list/listitem; CopyButton always `<button>` (copy is an action; links navigate only —
CSS `a.crow` → `.crow` + button reset); exhibit mock table gets `aria-label`; per-role
SR summary `p.sr-only[aria-live=polite]` in RoleLens; wiring section `role=region` +
aria-label; hero canvas stays aria-hidden via `.hero-visual` with an SR-only description
outside it; `.sr-only` utility added.

### D31 · Focus management + e2e infra (phase-07)
MobileMenu focuses first sheet link on open (Esc already restored burger). Command palette
keeps native dialog trap. `tests/e2e/` specs run via `pnpm test:e2e [filter]` through tsx
(run.ts) — no @playwright/test runner dependency added; @axe-core/playwright is the only
new devDep. Reduced-motion kill-list extended: mq-track, canvas .scan, w-bus i, wp-body
anim, audit ln.

### D32 · Canonical origin resolution (phase-08)
SITE_ORIGIN = NEXT_PUBLIC_SITE_URL → VERCEL_URL (previews canonicalise to their own
host, no prod leak) → placeholder https://princegupta.dev (local). metadataBase,
canonical, sitemap and OG all derive from it. OG image generated once via Playwright
screenshot of agent/scratch/og-template.html (no new deps; scratch gitignored, PNG committed).

### D33 · Link reachability semantics (phase-08)
HEAD 403/405/999 = host alive but bot-gated (LinkedIn) → treated as reachable with a log
note; true 4xx/5xx fail. External hosts allow-list: github + linkedin only; mailto/tel
verified verbatim; target=_blank must carry noopener.

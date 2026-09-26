# Portfolio — Technical Implementation Plan
**Project:** prince-gupta-portfolio · **Reference artifacts:** `portfolio-redesign/index.html` (approved prototype, v2.1) · `DESIGN-SYSTEM.md` · `Prince_Gupta_Frontend_Engineer.pdf` (content source of truth)
**Rev:** 1.1 — adds the `agent/` architecture for Antigravity (§2.13, wired into §2.2, §3, §10, §12, §13, §14)
**Status:** planning complete — implementation not started (by design)

Hard constraints carried into implementation:
1. **No project names anywhere** (enforced by an automated content-policy test + CI grep).
2. **CV is the only source of truth** for experience, metrics, skills, companies, dates.
3. **Prototype = visual/UX spec.** Any deviation must be listed in §3 (P4) before being made.
4. **Performance & a11y are requirements, not polish** (§5, §4).
5. **Vercel Hobby (free) tier only** (§7).
6. **Strict app/agent separation** (§2.13): all Antigravity instructions, playbooks, automation and generated artifacts live in `agent/` and never enter the production bundle, routes, or public assets.

---

## 1. Final Tech Stack

| Layer | Choice | Why | Rejected alternative & reason |
|---|---|---|---|
| Framework | **Next.js 15+ (App Router, current stable at kickoff)** | SSG/SSR for SEO + zero-config Vercel deploy; `metadata` API, `sitemap.ts`, `robots.ts`, route-level error/not-found; `next/font` self-hosting. Portfolio is 1 route → App Router overhead is ~zero and gains are real. | Vite SPA — loses SSR/SEO ergonomics & Vercel-native features for no benefit. |
| Language | **TypeScript (strict)** | Content contracts (`Metric`, `RoleNode`, `WiringNode`…) catch drift; matches professional profile. | JS — no. |
| Styling | **Tailwind CSS v4** (CSS-first `@theme`) | Design tokens from `DESIGN-SYSTEM.md` map 1:1 into `@theme` (colors, fonts, radii, easings, custom breakpoints); utility-first keeps component CSS near zero; `prettier-plugin-tailwindcss` keeps class order sane. | CSS Modules — duplicates token plumbing; Tailwind v3 — v4's CSS-first tokens are a better fit for an existing token sheet. |
| Animation | **No animation library.** CSS transitions/keyframes + ~7 small in-house hooks (`useReveal`, `useCountUp`, `useScramble`, `useAutoCycle`, `usePointerGlow`, `useScrollSpy`, `useReducedMotion`) | Every effect in the prototype (line-mask reveals, counters, scramble, marquee, scanline, bus-flow, parallax, magnetic) is CSS + IntersectionObserver + rAF. A library would add 30–80 KB gz for zero visual gain — and "performance is measured, not assumed" is literally portfolio content. | Motion/Framer — unjustified bytes; GSAP — heavier, license nuance. |
| Icons | **In-house `<Icon name>` registry** (inline SVG path map extracted from prototype, ~30 glyphs, `stroke=currentColor`) | Zero dependency, exact visual identity, tree-shakes to used glyphs (~0.4 KB gz total). | lucide-react — acceptable fallback if maintenance preference wins (tree-shakes ~1–2 KB/icon), but identity drifts. |
| Images | **None at launch.** All visuals are CSS/SVG. `next/image` wired but unused; static `og.png` (1200×630) in `/public`. | Eliminates the entire image-optimization problem class. | next/og dynamic OG — optional later; runs on Edge (free) but static asset is simpler. |
| Forms | **None at launch.** Contact = `mailto:` + clipboard copy (as prototype). Optional later path documented in §6. | No backend, no spam surface, no serverless functions. | Formspree/Resend — external dependency + free-tier limits for a need that doesn't exist. |
| Analytics | **Vercel Speed Insights (free on Hobby)** only. No third-party analytics scripts. | CWV/traffic monitoring from the platform we deploy on, ~2 KB, cookieless. Behavioral event analytics: skip unless Hobby allowance confirmed free at kickoff (§7). | GA/Plausible/Umami — extra script bytes or extra ops for a 1-page portfolio. |
| Testing | **Vitest + React Testing Library** (unit/component), **Playwright** (e2e smoke + axe a11y + responsive screenshots), **CI build validation** | Mirrors his shipped skillset (Jest/RTL pattern knowledge transfers), Playwright already proven in this sandbox for visual QA. | Jest — fine but Vitest is faster & config-light with Next 15; Cypress — heavier. |
| Lint/format | **ESLint 9 flat config + `eslint-config-next` + typescript-eslint**, **Prettier + prettier-plugin-tailwindcss** | Standard, CI-enforced. | Biome — viable, but eslint-config-next coverage is worth more here. |
| Package manager / runtime | **pnpm + Node 20+** | Fast, strict lockfile, Vercel-native. | npm/yarn — no strong reason. |

Dependency budget (runtime): `next`, `react`, `react-dom`. **That's it.** Everything else is dev-only. Client JS target ≤ 70 KB gz initial (Appendix B).

---

## 2. Architecture

### 2.1 Principles
- **One route, many islands.** `/` is a Server-Component page composing section components; interactivity lives in small `"use client"` leaves. Server renders 100% of content (SEO + no-JS readability).
- **Content is data, components are dumb.** All copy lives in typed `content/*.ts` modules; sections map over it. Rewording never touches components.
- **Tokens before classes.** Colors/spacing/easings/breakpoints exist once, in `@theme`; components consume semantic utilities (`bg-panel`, `text-ink-2`, `ease-atelier`).
- **Delegate, don't multiply.** Pointer-driven effects (card glow, magnetic buttons) use ONE delegated listener in a single `InteractionLayer` client component, not per-element handlers.
- **Fail gracefully, ship static.** No runtime data fetching → the only failure modes are asset/CDN/client-hydration, all covered by `error.tsx`/`global-error.tsx`/`not-found.tsx`.

### 2.2 Folder structure
```
portfolio/
├── app/
│   ├── layout.tsx              # S: fonts, html[data-theme] from cookie, metadata, JSON-LD, Noise, Toast provider
│   ├── page.tsx                # S: composes sections in prototype order
│   ├── globals.css             # Tailwind v4 import + @theme tokens + base + keyframes
│   ├── error.tsx               # C: styled error boundary (section-safe fallback)
│   ├── global-error.tsx        # C: last-resort shell (no design-system dependency)
│   ├── not-found.tsx           # S: 404 in design language + path suggestions
│   ├── loading.tsx             # S: reserved for future dynamic routes (trivial shell today)
│   ├── sitemap.ts              # S: / + canonical
│   ├── robots.ts               # S: allow all + sitemap ref
│   └── cv/route.ts             # S: redirect/serve PDF with cache headers (or plain /public/cv/*.pdf)
├── components/
│   ├── layout/  Header.tsx(S+islands)  MobileMenu.tsx(C)  DotRail.tsx(C)  ScrollProgress.tsx(C)  Footer.tsx(S)
│   ├── sections/ Hero.tsx(S)  Numbers.tsx(S)  Expertise.tsx(S)  Exhibit.tsx(C)  Experience.tsx(S)
│   │             Principles.tsx(S)  Stack.tsx(S)  Background.tsx(S)  Contact.tsx(S)
│   ├── interactive/ HeroCanvas.tsx(C) ScrambleWord.tsx(C) Counter.tsx(C) RoleLens.tsx(C)
│   │                WiringDiagram.tsx(C) CommandPalette.tsx(C, lazy) Preloader.tsx(C) ThemeToggle.tsx(C)
│   │                CopyButton.tsx(C) BackToTop.tsx(C) TimelineFill.tsx(C) InteractionLayer.tsx(C)
│   ├── ui/  Button.tsx  Chip.tsx  Pill.tsx  Card.tsx  SectionHead.tsx  Tag.tsx  Icon.tsx  Reveal.tsx(C)  Toast.tsx(C)
│   └── seo/  JsonLd.tsx(S)
├── content/
│   ├── types.ts  profile.ts  nav.ts  metrics.ts  expertise.ts  wiring.ts
│   ├── experience.ts  principles.ts  stack.ts  education.ts  contact.ts  exhibit.ts
├── hooks/  useReveal.ts  useCountUp.ts  useScramble.ts  useAutoCycle.ts  usePointerGlow.ts
│           useScrollSpy.ts  useReducedMotion.ts  useTheme.ts  useCopy.ts
├── lib/  cn.ts  format.ts  seo.ts  constants.ts
├── public/  cv/Prince_Gupta_Frontend_Engineer.pdf  og.png  favicon.svg  robots fallback
├── docs/  prototype/index.html (frozen reference)  DESIGN-SYSTEM.md  IMPLEMENTATION-PLAN.md
├── tests/  e2e/(smoke.spec.ts a11y.spec.ts responsive.spec.ts)  content-policy.test.ts
├── agent/                      # Antigravity agent workspace — dev-only, never bundled (§2.13)
│   ├── README.md               # how Antigravity sessions and humans use this folder
│   ├── rules/                  # always-on constraints (00-project … 50-code-style)
│   ├── workflows/              # named repeatable playbooks (implement-section, release, …)
│   ├── prompts/                # per-phase task seeds (phase-1-foundation … phase-8-launch)
│   ├── tools/                  # dev-only automation via `pnpm agent:*` (tsx, devDependency)
│   ├── context/                # cv-source.md · prototype-notes.md · decisions.md
│   └── artifacts/  scratch/    # agent-generated output — gitignored
├── next.config.ts  eslint.config.mjs  prettier.config.mjs  tsconfig.json  vercel.json  vitest.config.ts
├── playwright.config.ts
└── AGENTS.md                   # thin root pointer for agentic IDEs → agent/rules/*
```

### 2.3 Server vs Client components (island map)
| Component | Type | Notes |
|---|---|---|
| `layout`, `page`, all section shells, `Footer`, `SectionHead`, cards/chips | **Server** | Pure render from `content/*`. |
| `Reveal` (IO line-mask/fade) | Client | ~40 lines; wraps children, adds `.in`. |
| `Counter`, `ScrambleWord`, `HeroCanvas`, `TimelineFill` | Client | rAF/IO driven; auto-pause off-screen. |
| `RoleLens` (exhibit), `WiringDiagram` | Client | Stateful specimens; data from `content/exhibit.ts` / `wiring.ts` passed as props (still server-fetched). |
| `CommandPalette` | Client, **lazy** | `next/dynamic` on first ⌘K / click / hover-intent → not in initial bundle. |
| `ThemeToggle` + layout cookie read | Server read + client toggle | Cookie `pg-theme` read in `layout.tsx` → `data-theme` at SSR = **no FOUC, no inline script** (CSP-friendly deviation from prototype's localStorage). |
| `InteractionLayer` | Client | ONE delegated `pointermove` for card glow (`--mx/--my`) + magnetic buttons; `pointer:fine` gated. |
| `ScrollProgress`, `DotRail`, `MobileMenu`, `Preloader`, `CopyButton`, `BackToTop`, `Toast` | Client | Small; scroll handlers rAF-throttled. |

### 2.4 Layout architecture
`layout.tsx` renders: `<Preloader/>` → `<ScrollProgress/>` → skip-link → `<Header/>` → `<DotRail/>` → `<MobileMenu/>` → `{children}` → `<Footer/>` → `<Toast/>` → `<JsonLd/>`. Fixed layers (`noise`, progress) are CSS-only. `scroll-padding-top` token = header height + 18px (anchor offset).

### 2.5 Content / data structure
Typed modules, e.g.:
```ts
// content/types.ts
export interface Metric { value: number; decimals?: 0|1; prefix?: string; suffix?: string; label: string; sub: string }
export interface WiringNode { id: string; band: 0|1|2; icon: IconName; title: string; mono: string; desc: string; ev: string[]; proof: string }
export interface RoleSpec { id: RoleId; label: string; desc: string; nav: number[]; scope: string; mask: boolean; write: boolean|"own"; path: string; title: string; note: string; caps: Record<CapId, 0|1|2> }
export interface ExperienceRole { title: string; company: string; location: string; dates: string; current?: boolean; badge?: string; bullets: React-free string[]; contexts: {name:string; meta?:string}[]; tech: string[] }
```
Rules: strings only (no JSX in content), every number traceable to CV, `FORBIDDEN_PROJECT_NAMES` list lives in `tests/content-policy.test.ts` and asserts no content module contains any of them (case-insensitive) — **the content rule becomes a failing test, not a promise.**

### 2.6 Design-system structure
`globals.css`: `@import "tailwindcss";` then `@theme` mirroring `DESIGN-SYSTEM.md` §2–4:
```css
@theme {
  --color-bg:#0A0B0D; --color-bg-2:#0E1014; --color-bg-3:#131519; --color-term:#0B0C0F;
  --color-ink:#F2F1EA; --color-ink-2:#A7ACB6; --color-ink-3:#696F7B;
  --color-accent:#CBF24C; --color-accent-2:#DFF98A; --color-accent-fg:#CBF24C; --color-accent-ink:#0A0B0D;
  --color-good:#79DFA2;
  --font-display:"Bricolage Grotesque",…; --font-sans:"Inter",…; --font-mono:"JetBrains Mono",…;
  --radius-xl:24px; --radius-lg:18px; --radius-md:12px; --radius-sm:8px;
  --ease-atelier:cubic-bezier(.22,.72,.2,1); --ease-out-expo:cubic-bezier(.16,1,.3,1);
  --breakpoint-xs:26.25rem; /*420*/ --breakpoint-sm:40rem; /*640*/ --breakpoint-md:47.5rem; /*760*/
  --breakpoint-lg:67.5rem; /*1080*/ --breakpoint-xl:80rem; /*1280*/
}
[data-theme="light"] { …token overrides… }   /* same values as prototype light block */
```
Component classes that are genuinely reused (`.btn-primary` shine sweep, `.chip-key`, noise overlay, marquee keyframes, `busflow`, `scan`) live in `@layer components` once; everything else is utilities. `cn()` = 8-line in-house joiner (no clsx/tailwind-merge deps).

### 2.7 Animation architecture
- Keyframes/tokens in CSS; hooks only toggle classes/vars. All durations/easings from tokens.
- `useReveal`: single shared IntersectionObserver per page (module-level singleton), threshold .12 / rootMargin `-6%`.
- `useAutoCycle(interval, {pauseOffScreen, handoverOnInteract})`: used by `HeroCanvas` (2.9 s) and `WiringDiagram` (4.6 s, permanent handover on first user click — prototype behavior).
- `usePointerGlow`: delegated; writes `--mx/--my`; `matchMedia("(pointer:fine)")` gated.
- `useReducedMotion`: every hook + CSS `@media (prefers-reduced-motion:reduce)` collapse (prototype §6 rules).
- Preloader: once per session (`sessionStorage` flag, try/catch), skipped under reduced motion.

### 2.8 SEO architecture
`metadata` in `layout.tsx` (title template, description, canonical `NEXT_PUBLIC_SITE_URL`, OG/Twitter from prototype head, `theme-color` per scheme); `JsonLd.tsx` emits the prototype's Person schema (no project names); `sitemap.ts` + `robots.ts`; semantic landmarks & single `h1` (hero) → `h2` per section → `h3` per card/role; all interactive specimens have text equivalents (SR-readable tables/lists); PDF linked with `download` + descriptive text.

### 2.9 Error / loading / not-found
- `error.tsx`: design-system card, "Something broke on this screen", retry via `reset()`; sections are independently wrapped so one island failure never blanks the page (wrap `RoleLens`, `WiringDiagram`, `CommandPalette`, `HeroCanvas` in `<ErrorBoundary>`-style section errors using route-level `error.tsx` + per-island try/catch fallbacks that render the static variant).
- `global-error.tsx`: unstyled-safe minimal shell with reload button.
- `not-found.tsx`: 404 in design language, mono index, links to all 9 sections.
- `loading.tsx`: reserved (page is fully static; kept for future dynamic routes).
- Missing assets: CV link 404s → `not-found` styling + CI link-check prevents. External service failures: only clipboard (guarded fallback showing the address in a toast) and fonts (`next/font` fallback metrics, `font-display:swap`-free since self-hosted + preloaded).

### 2.10 Environment configuration
`.env.example`: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL` (public by nature), nothing secret. Vercel env vars mirrored per environment (preview/prod) — preview uses `VERCEL_URL` fallback for canonical/OG when no custom domain.

### 2.11 Utilities / types / assets
`lib/format.ts` (counter formatting: decimals, `toLocaleString("en-US")`, prefix/suffix), `lib/seo.ts` (JSON-LD builder), `lib/constants.ts` (links, nav, breakpoints). Assets: PDF + `og.png` + `favicon.svg` in `/public`; noise texture stays an inline data-URI in CSS (no request).

### 2.12 Future extensibility
Adding a section = 1 content module + 1 section component + nav entry (data-driven nav array). Adding a case-study route later = `app/work/[slug]/page.tsx` over `content/case-studies.ts` (type-based titles, still no project names) — architecture already route-ready; a writing section would follow the same pattern via `app/writing/`. No re-architecture needed.

### 2.13 Agent architecture (Antigravity)

**Purpose & responsibility.** `agent/` is the versioned home for everything the Antigravity agentic IDE
needs to work well in this repo: always-on rules, repeatable workflows, task-seed prompts, dev-only
automation tools, curated context, and generated artifacts. It makes agent behavior **reproducible and
reviewable** — any session (human- or agent-started) loads the same constraints and playbooks — and it
owns **zero runtime behavior**. Application code stays in `app/ components/ content/ lib/ hooks/`;
agent code stays in `agent/`; the two meet only through git branches, CI, and public surfaces (dev/preview
URLs, build output).

**Structure & naming conventions.**
```
agent/
├── README.md                 # folder contract: what goes where, session start checklist
├── rules/                    # ALWAYS-ON constraints, loaded every session (NN- = priority order)
│   ├── 00-project.md         # identity, stack, reference pointers, branch/commit conventions
│   ├── 10-content-policy.md  # no project names; CV = sole source of truth; verification steps
│   ├── 20-design-system.md   # prototype = visual spec; token usage; approved-deviations list
│   ├── 30-performance.md     # JS/CWV budgets; "no new runtime deps" rule + exception path
│   ├── 40-accessibility.md   # a11y acceptance criteria per component class
│   └── 50-code-style.md      # TS strict, naming, no dead code, app→agent import ban
├── workflows/                # repeatable playbooks, verb-first kebab-case, each with DoD + evidence list
│   ├── implement-section.md      # prototype → content → component → DoD pipeline
│   ├── visual-parity-check.md    # screenshot grid vs docs/prototype + diff review
│   ├── a11y-pass.md  perf-audit.md  seo-checklist.md
│   ├── release.md                # pre-merge checks, PR body, tagging
│   └── rollback.md               # promote previous deployment + post-rollback verification
├── prompts/                  # task seeds per phase: phase-1-foundation.md … phase-8-launch.md
├── tools/                    # dev-only automation; run via `pnpm agent:*`; NEVER imported by app code
│   ├── content-scan.ts       # forbidden project-name scan over content/ + app strings
│   ├── screenshot-grid.ts    # 9-viewport × 2-theme grid vs prototype (Playwright)
│   ├── link-check.ts         # internal anchors + external links + CV asset
│   ├── bundle-check.ts       # asserts zero agent/ modules in build manifest + JS budget
│   └── secret-scan.ts        # no secrets/env values inside agent/ or docs/
├── context/                  # curated reference material agents may trust
│   ├── cv-source.md          # CV text extract (source of truth, line-referenced)
│   ├── prototype-notes.md    # behavior spec notes + approved deviations log
│   └── decisions.md          # ADR-lite log (promoted artifact conclusions live here)
├── artifacts/                # Antigravity task lists / plans / walkthroughs  → gitignored
└── scratch/                  # throwaway experiments                        → gitignored
```
Conventions: rules `NN-topic.md` (number = load priority); workflows/tools verb-first kebab-case;
prompts `phase-N-slug.md`; artifacts `YYYY-MM-DD-<slug>/`; agent-authored commits carry the trailer
`Agent: Antigravity (<session-id>)`.

**Interaction with the main application.**
- **Entry point:** root `AGENTS.md` is a *thin pointer* (≤ 30 lines: repo identity, top-10 rules,
  "read `agent/README.md` + `agent/rules/*` first") — the open convention agentic IDEs (Antigravity
  included) auto-load. All substance stays in `agent/` → exactly one source of truth.
- **Session flow:** load `AGENTS.md` → `agent/rules/*` → pick a `workflows/*` playbook (or a
  `prompts/phase-N` seed from Agent Manager) → execute on a feature branch → run the relevant
  `agent/tools` + phase DoD → open a PR naming the workflow and linking `agent/artifacts/<…>`.
- **Tools touch the app only through public surfaces:** dev/preview server URL (screenshots, links),
  filesystem reads (content scan), build manifest (bundle check). They never import app modules, so
  they run standalone (`pnpm agent:screenshot-grid`) and cannot create coupling. `tsx` is a devDependency.
- **One-directional dependency:** app code may never import `agent/` — ESLint `no-restricted-imports`
  glob `agent/**` for `app/ components/ lib/ content/ hooks/` + CI grep backstop + `bundle-check.ts`.

**Task ownership.**
| Antigravity agents handle | Humans keep |
|---|---|
| Scaffolding, token ports, section implementation from the prototype, test authoring, running parity/a11y/perf/seo workflows, PR drafting, release-checklist execution, rollback drills | Design judgement & final visual approval, content truth-validation against the CV, merge / production-promotion decisions, scope changes, edits to rules & workflows |

**Isolation guarantees.** (1) *Bundle:* no import-graph edge app→agent; `bundle-check.ts` asserts zero
`agent/` modules in the Next build manifest. (2) *Serving:* `agent/` is not under `public/` and no route
references it → never served. (3) *Repo:* `artifacts/` + `scratch/` gitignored; rules/workflows/tools/
context tracked (they are team assets). (4) *Tooling:* ESLint flat config gives `agent/tools/**` a Node
env override (exempt from `eslint-config-next` browser rules) while the shared tsconfig still type-checks
them (desirable for dev scripts). (5) *Deployment:* Vercel builds only the Next app — `agent/` contributes
zero output bytes (verified by `bundle-check.ts` in CI). (6) *Secrets:* rules forbid secrets/env values in
agent files; `secret-scan.ts` enforces in CI.

**Development-workflow integration.** Each workflow run happens on its own phase branch (`phase/NN-<slug>`, cut
from `develop` by the agent, commit trailer as above; squash-merged back into `develop`; `main` is production and
is only updated via `develop → main` release PRs or `hotfix/*`). PR template gains three fields: *workflow used*, *artifact path*,
*DoD evidence* (screenshots/test output). Antigravity Agent Manager artifacts (task list, implementation
plan, walkthrough) are exported to `agent/artifacts/<date>-<slug>/` and linked from the PR; durable
conclusions are promoted into `agent/context/decisions.md`, the rest expires via gitignore. CI must be
green and a human must approve; agents never push to protected `main`.

---

## 3. Implementation Phases

> Order is dependency-driven. Estimates are solo-focus hours.
> Agent assistance: every phase lists the Antigravity workflows/prompts that drive it (§2.13).
> Agents execute inside these playbooks; humans approve every merge and visual sign-off.

### Phase 1 — Project foundation (2–3 h)
- `create-next-app` (TS, Tailwind v4, ESLint, App Router, pnpm, `src/` off), Node 20+, repo init, branch protection on `main`.
- `tsconfig` strict + `noUncheckedIndexedAccess`; ESLint flat + `eslint-config-next`; Prettier + tailwind plugin; `.editorconfig`.
- Folder skeleton per §2.2; `docs/` receives frozen prototype + DESIGN-SYSTEM.md.
- `next/font/google`: Bricolage Grotesque (opsz/wdth/wght variable), Inter, JetBrains Mono → CSS vars wired into `@theme --font-*`.
- `globals.css`: full token set (Appendix A), base styles, selection/scrollbar/focus-visible, keyframes (`pulse`, `mq`, `scan`, `floaty`, `busflow`, `ldPop`, `wpIn`, `audIn`), reduced-motion collapse block.
- `vercel.json` skeleton (headers §8, cache §5).
- **Agent scaffold (from day one, §2.13):** create `agent/` with `README.md`, `rules/00–50` (ported from
  this plan's constraints), `context/cv-source.md` + `prototype-notes.md`, root `AGENTS.md` pointer;
  `.gitignore` entries for `agent/artifacts/` + `agent/scratch/`; ESLint import-ban (`agent/**` from app
  code) + Node-env override for `agent/tools/**`; `package.json` script stubs `agent:*`;
  `agent/prompts/phase-1-foundation.md` seed.
- **DoD:** `pnpm lint && pnpm tsc --noEmit && pnpm build` green on Vercel preview; fonts self-hosted (network tab: zero font CDN requests); tokens render in a scratch page matching prototype hex values; a fresh Antigravity session smoke-test recites the content policy, budgets and branch conventions from `agent/rules/*` without extra prompting.

### Phase 2 — Core UI system (4–6 h)
- `ui/` primitives: `Button` (primary/ghost/sm, shine sweep, magnetic via InteractionLayer), `Chip`/`chip-key`, `Pill` (pulse dot), `Card` (glow vars), `Tag`, `SectionHead` (idx chip + lines h2 + rule + meta), `Icon` registry (all ~30 glyphs ported), `Reveal`, `Toast` provider.
- Layout primitives: `Header` (stuck state, nav from `content/nav.ts`, search/CV/theme/burger), `MobileMenu` (clip-path circle, staggered links), `DotRail`, `ScrollProgress`, `Footer`, skip-link.
- Theme system: cookie-read in layout + `useTheme` toggle (persist cookie 1y + state), light token overrides.
- **DoD:** every primitive visually diffed against prototype screenshots (Playwright snapshot script from sandbox reused); keyboard tab order correct; theme survives reload with no flash; Lighthouse a11y ≥ 95 on scratch page.

### Phase 3 — Content layer (2 h)
- Port all copy from prototype into `content/*.ts` with types (§2.5); exhibit role matrix + audit-line templates; wiring nodes/bands/buses; nav; contact rows.
- `tests/content-policy.test.ts` (forbidden names) + CV-traceability comment per metric (`// CV: "cut initial bundle ~30%"`).
- **Agent tasks:** implement `agent/tools/content-scan.ts` (forbidden-name scan over `content/` + app strings) and wire it as a CI step alongside the Vitest policy test; author `agent/prompts/phase-3-content.md`; seed `context/cv-source.md` line references used by the port.
- **DoD:** content test green; `grep -riE` forbidden list over `content/` empty; every rendered string originates in content modules (no literals in components).

### Phase 4 — Main sections, prototype-faithful (10–14 h)
Implement in prototype order; each section server-rendered, islands attached:
1. **Hero** — status pills, kicker, line-mask `h1` (solid + outline word filling lime on hover), `ScrambleWord` rotator (5 words, 3.6 s), lede, CTA hierarchy (Explore → CV → Email), link chips; `HeroCanvas` (8-skeleton sidebar, role cycle 2.9 s super→admin→company→partner, scope/mods/mask swaps, scanline), 3 float chips with parallax depths (14/24/34/42), hero pointer glow; marquee (duplicated set, 42 s, pause on hover, edge mask).
2. **Numbers** — divided 6-cell strip; `Counter` (1.5 s easeOutQuart; `3.5` 1-dec; `5,000` grouped; `~`/`%`/`+` accent glyphs); hover top-bar wipe.
3. **Expertise** — 12-col bento spans (8/4 · 4·4·4 · 6/6), icon tiles, evidence chips, feature tile role-grid cycler (1.7 s); **then `WiringDiagram` (03·B)** — confirmed valuable in prototype review: 3 bands (3/4/3), bus chips + flow dots, master–detail sticky panel, auto-cycle 4.6 s with permanent handover, ←/→ keys, `aria-pressed` nodes.
4. **Exhibit** — `RoleLens`: role tabs (left lime bar, counts 10/7/5/2), capability matrix (✓/◐/—, column highlight), mock window (10-module nav with ✕ denied, URL/scope/title/note per role, approve button denied state, masked contact cells), audit console (staggered 150 ms lines, max 7, dark in both themes), illustrative-disclaimer note.
5. **Experience** — sticky left rail (facts table), timeline with scroll-filled lime line (`TimelineFill`), diamond bullets, context chips ("described by type"), tech tags, current-role pulse.
6. **Principles** — 4 cards, giant outline numerals, evidence arrow row.
7. **Stack** — 6 group cards, `chip-key` primaries.
8. **Background** — 2 education cards + trajectory note.
9. **Contact** — lines h2, highlighter-hover giant mailto, CTA row, availability strip, contact rows with copy-hint + `CopyButton` (clipboard → textarea fallback → toast).
- **Agent tasks:** each section is built by one run of `agent/workflows/implement-section.md` (branch per section or section-pair, PR per run); implement `agent/tools/screenshot-grid.ts` here and attach its output as DoD evidence; deviations discovered mid-port are logged in `agent/context/prototype-notes.md` before being coded.
- **Approved deviations from prototype (explicit):** theme persistence cookie instead of localStorage (no FOUC, CSP-safe); CommandPalette lazy-mounted; everything else pixel/behavior-faithful.
- **DoD:** side-by-side screenshots (1440/834/390, both themes) match prototype within visual-review tolerance; zero console errors; all anchors/scrollspy correct; content test green.

### Phase 5 — Advanced interactions & motion pass (6–8 h)
- Port remaining micro-interactions: preloader (000→100 + curtain, once/session), magnetic buttons, card spotlight glow (delegated), nav underline wipes, chip lifts, hover states audit against prototype §6 list.
- `CommandPalette` (lazy): commands = 9 sections + CV + copy email + theme + GitHub/LinkedIn/mailto; ↑↓↵esc, filter, empty state.
- Interaction QA matrix: mouse / touch / keyboard / reduced-motion / slow-CPU (4× throttle) — auto-cycles pause off-screen, no jank (all animations transform/opacity only).
- **DoD:** Playwright interaction specs green (role switch, wiring handover, palette open/exec, copy toast, menu); reduced-motion run shows fully static, complete page; INP < 200 ms in lab throttle.

### Phase 6 — Responsive design (4–6 h)
Per-component behavior (not desktop-shrink):
| Component | ≥1280 | 1080–1279 | 760–1079 | ≤759 | ≤419 |
|---|---|---|---|---|---|
| DotRail | visible | hidden | hidden | hidden | hidden |
| Header nav | inline | inline | burger | burger (search hidden, brand sub hidden) | + CTAs full-width |
| Hero | 2-col + parallax | 2-col tighter | stacked, canvas flat | chips repositioned, fc-c hidden | pills wrap |
| Metrics | 6-col | 6→3 | 3-col | 2-col borders recomputed | 2-col |
| Bento | 8/4·4³·6² | feat 12 | halves 6 | all 12 | all 12 |
| Wiring | diagram+panel | panel below | bands c4→2col | bands 1col | 1col |
| Exhibit | 2-col | tabs scroll-x | mock sidebar→top scroller | same | table compress |
| Timeline | sticky rail | stacked | stacked | rail 30px | rail 30px |
| Contact | 2-col | 1-col | 1-col | mailto wraps (break-all) | CTAs stack |
- Touch targets ≥44 px, `scroll` containers get `scrollbar-width:thin` + visible affordance, no horizontal overflow asserted at 320/360/390/414/768/834/1024/1280/1440 (Playwright).
- **Agent tasks:** run `agent/workflows/visual-parity-check.md` at all 9 viewports × 2 themes using `screenshot-grid.ts`; agent fixes overflow/affordance findings, human signs off the grid.
- **DoD:** responsive spec green; screenshot grid reviewed against prototype mobile shots.

### Phase 7 — SEO, performance, hardening (3–4 h)
- Metadata/OG/Twitter/canonical, JSON-LD, `sitemap.ts`, `robots.ts`, heading audit, anchor-text audit, `og.png` export.
- Perf work per §5; security headers per §8; `vercel.json` cache rules; dependency audit in CI.
- **Agent tasks:** execute `agent/workflows/perf-audit.md` and `seo-checklist.md`; add `agent/tools/link-check.ts`, `bundle-check.ts`, `secret-scan.ts` and wire all three into CI.
- **DoD:** Lighthouse (mobile, 4G throttle) ≥ 95/95/95/95; CWV lab: LCP < 1.8 s, CLS 0, INP < 200 ms; Rich-Results test passes; sitemap/robots fetch 200 on preview.

### Phase 8 — Testing, CI, deployment, launch (4–6 h)
- Unit/component/e2e/a11y specs (§9), GitHub Actions (lint+type+test+build), Vercel project link, production deploy, post-deploy checklist (§12), Speed Insights on.
- **Agent tasks:** wire every `agent/tools/*` script into GH Actions; execute `agent/workflows/release.md` for launch and `rollback.md` once as a drill; archive the launch walkthrough to `agent/artifacts/`; promote durable conclusions to `agent/context/decisions.md`; author `agent/prompts/phase-8-launch.md` retrospective notes for future sessions.
- **DoD:** CI green on `main`; production URL passes post-deploy checklist; rollback drill executed once (promote previous deployment); PR template carries workflow/artifact/DoD-evidence fields and the `Agent: Antigravity` trailer convention is live.

**Total: ~35–49 h.** Critical path: P1 → P2 → P4 → P6 → P8. P3 can parallel P2; P5 slots between P4 and P6; P7 overlaps P6.

---

## 4. Accessibility Strategy
- **Semantics:** landmarks (`header/nav/main/footer/aside`), one `h1`, section `aria-labelledby`, lists as lists, tables as tables (exhibit mock is a real `<table>`), buttons vs links honored (role tabs = `button[aria-pressed]`, nav = links).
- **Keyboard:** full tab order (skip-link → header → sections → footer), palette ↑↓↵esc, wiring ←/→, exhibit tabs tabbable, menu esc-close + focus return to burger, focus trap in palette/menu, `:focus-visible` lime ring tokens, no focus loss on lazy palette mount.
- **ARIA minimal:** only where HTML can't express (dialog for palette, `aria-pressed`, `aria-expanded` menu, `aria-live=polite` toast only). Specimens: audit console `aria-hidden` (decorative duplicate of stated rules); matrix gets an SR-only textual summary per role change.
- **Contrast:** token pairs verified (ink/bg 15:1; ink-2/bg 7:1; accent-fg dark 12:1; light-theme olive `#546E0B` on paper 5.4:1; lime button text 14:1); lime never used as text on light.
- **Motion:** everything collapses under `prefers-reduced-motion` (reveals shown, cycles static-all-lit, marquee stopped, preloader skipped); auto-cycles also pause off-screen and on `document.hidden`.
- **Forms:** none → no label/error-pattern debt; if added later: visible labels, `aria-describedby` errors, no placeholder-as-label.
- Targets: axe-core 0 violations (Playwright-axe), Lighthouse a11y ≥ 95, manual NVDA/VoiceOver spot-check of hero + exhibit + contact.

## 5. Performance Strategy
- **Rendering:** fully static prerender (no runtime fetches) → Vercel CDN serves HTML at edge; SSR/SSG SEO-friendly; hydration islands only.
- **JS budget (Appendix B):** initial ≤ 70 KB gz (React+Next runtime + islands); palette lazy; no animation/icon/form libs.
- **Fonts:** `next/font` self-hosted, variable subsets, `preload`, fallback metrics auto → CLS 0; 3 families, 1 weight axis each where possible.
- **Images:** none at launch (CSS/SVG visuals); `og.png` only social crawlers fetch. Noise = data-URI.
- **CSS:** Tailwind purged; critical CSS inlined by Next; keyframes transform/opacity only; `will-change` only on canvas/chips.
- **CWV targets:** LCP < 1.8 s (hero headline text, font-preloaded), CLS = 0 (no late-inserted layout: preloader is fixed overlay; counters reserve width via `font-variant-numeric:tabular-nums` + fixed min-width), INP < 200 ms (delegated listeners, rAF throttle, no long tasks > 50 ms — audit console batches via single append).
- **Caching:** `/_next/static/*` immutable 1y; `/cv/*.pdf` `cache-control: public, max-age=86400, stale-while-revalidate=604800`; HTML `s-maxage=31536000, stale-while-revalidate` via Vercel CDN (static); fonts immutable.
- **Third-party:** zero at runtime except optional Speed Insights beacon (~2 KB, deferred).
- **Monitoring:** Speed Insights CWV on production; re-run Lighthouse in CI on PRs touching `app/` or `components/` (budget file `budget.json`: script 80 KB, total 350 KB).

## 6. Error-Handling Strategy (matrix)
| Failure | Surface | Behavior |
|---|---|---|
| Island runtime error (RoleLens/Wiring/Palette/Canvas) | section-level boundary | static fallback variant renders (e.g., wiring shows all nodes + first-node panel; canvas shows frozen super-admin frame); rest of page unaffected |
| Route-level render error | `app/error.tsx` | design-language card + Retry (`reset()`) + mailto escape hatch |
| Shell/layout crash | `global-error.tsx` | minimal unstyled shell + reload |
| Unknown route | `not-found.tsx` | styled 404 + section index links |
| CV asset missing | link-check in CI + 404 styling | prevented pre-merge; graceful 404 post |
| Clipboard denied/insecure ctx | `CopyButton` | textarea fallback → toast shows literal address |
| Font load failure | `next/font` fallback stack | metrics-adjusted system fallback, no CLS |
| sessionStorage/localStorage throw (sandboxed frames) | try/catch wrappers | preloader/theme degrade silently |
| External link dead | `rel="noopener noreferrer"` + quarterly link-check CI job | n/a at runtime |
No forms → no submission failures. If a contact form is ever added: server action with zod validation, inline field errors, rate-limit via Vercel edge middleware (free), honeypot, and mail delivery via Resend free tier (3k/mo) — documented, not built now.

## 7. Vercel Free-Tier (Hobby) Strategy
| Feature | Use | Hobby limit (verify at kickoff) | Design note |
|---|---|---|---|
| Deployments + preview URLs | every PR/branch | unlimited previews, 1–2 concurrent builds | portfolio content is public → previews left open; no Deployment Protection (Pro) needed |
| Production deploys + instant rollback | `main` auto-promote; rollback = promote previous deployment | included | drill once in P8 |
| Edge CDN + SSL + custom domain | serve static portfolio; `princegupta.dev` canonical (registrar cost only) | 100 GB/mo transfer | ~2–4 MB/visit ⇒ tens of thousands of visits/mo headroom |
| Static prerender (no functions) | whole site | 100 GB-Hr fn/mo **unused** | zero serverless functions by design |
| Build minutes | CI + previews | 6,000 min/mo | ~1–2 min/build ⇒ trivial |
| Speed Insights | CWV monitoring | free on Hobby | only "analytics" adopted |
| Vercel Analytics (events) | skip unless confirmed free on Hobby | plan-dependent | portfolio needs no event funnel |
| Image Optimization | unused (no images) | 1k sources/mo | headroom if case-study screenshots land later |
| `next/og` Edge OG | optional later | Edge invocations 1M/mo | static `og.png` preferred now |
| Cron / Blob / Postgres / KV | **not used** | — | no backend surface exists |
| Middleware/Edge Functions | not used (redirects via `vercel.json`) | — | keeps execution at zero |
Staying free is structural: static site + zero functions + zero DB + one tiny beacon.

## 8. Security
- **Headers (`vercel.json`):** `X-Content-Type-Options:nosniff`, `Referrer-Policy:strict-origin-when-cross-origin`, `Permissions-Policy:camera=(),mic=(),geolocation=()`, `X-Frame-Options:DENY` (or CSP `frame-ancestors 'none'`), `Strict-Transport-Security` (auto on Vercel domains), pragmatic CSP: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://va.vercel-scripts.com; base-uri 'self'; form-action 'self'` — inline styles only (CSS vars), no inline scripts (theme via cookie).
- **Secrets:** none exist; env vars public-only; `.env*` gitignored; no keys in repo (audit in CI with `gitleaks` optional).
- **Links:** all external `rel="noopener noreferrer"`, `https` only.
- **Dependencies:** lockfile committed, `pnpm audit --audit-level=high` in CI, runtime deps = 3 packages ⇒ tiny attack surface; Dependabot/Renovate off (manual monthly bump is enough at this size).
- **Input:** only palette filter string (rendered as text, never HTML) + clipboard; no URLs/params rendered → no injection surface; `next.config` `poweredByHeader:false`.
- **Supply chain:** prototype's Cloudflare-scraped email obfuscation removed — plain mailto (his address is public on CV).

## 9. Testing Strategy (practical pyramid)
| Level | Tool | What | Count guide |
|---|---|---|---|
| Unit | Vitest | `lib/format.ts` (counter formats), content-policy forbidden-names scan, nav/anchor integrity | ~10 |
| Component | Vitest + RTL | `RoleLens` (role→nav/mask/matrix/assert states), `WiringDiagram` (select/handover/keys), `CommandPalette` (filter/exec/esc), `CopyButton` fallback, `Reveal` | ~15 |
| A11y | Playwright + `@axe-core/playwright` | full-page scan both themes; keyboard journey spec (tab→palette→exhibit→menu) | 2 specs |
| Responsive | Playwright | 9 viewports × overflow assertion + screenshot grid vs prototype | 1 spec |
| e2e smoke | Playwright | load→no console errors→nav anchor→exhibit switch→wiring handover→copy toast→CV link 200 | 1 spec |
| Build/CI | GH Actions | lint, typecheck, unit, e2e, `next build`, Lighthouse budget on preview URL | per PR |
Not built: visual-regression diffing (screenshot grid reviewed manually per phase), load testing (static CDN), form tests (no forms).

## 10. Code Quality
Strict TS everywhere (`content` types forbid `any`), ESLint flat + next rules + `no-console` warn, Prettier single source of formatting, tailwind class order plugin, component props typed & minimal, no prop-drilling beyond 1 level (content passed at section level), hooks single-purpose & tested via components, naming: `ui/` primitives noun-named, `interactive/` behavior-named, sections route-named; no dead code (prototype scraps never ported), no abstraction without 2+ use sites; PR template includes "prototype reference screenshot" field.
Agent hygiene (§2.13): agent-authored commits carry `Agent: Antigravity (<session>)` trailers; PRs name the workflow + artifact path; changes to `agent/rules|workflows` land in their own PRs (they govern all future sessions); `agent/artifacts/` content never appears in application diffs.

## 11. Content Architecture (no project names)
Identity-first hierarchy: **Hero (role + positioning) → Numbers (impact) → Expertise (capabilities) → 03·B Wiring (engineering model) → Exhibit (signature technique) → Experience (companies/titles/dates + product *types*) → Principles → Stack → Background → Contact.** Product references always type+region+fact ("B2B procurement marketplace — Oman/GCC", "8 order + 6 RFQ statuses"); companies/titles/dates/metrics verbatim CV; enforcement = content-policy test + CI grep + PR checklist item. Source map: every content module header lists CV line references.

## 12. Deployment Workflow
```
┌─ Antigravity lane (§2.13) ────────────────────────────────────────────────────┐
│ AGENTS.md → agent/rules/* → workflow/prompts seed → implement on phase branch │
│ → agent/tools checks + phase DoD → artifacts/ exported → PR (workflow named)  │
└───────────────────────────────────────────────────────────────────────────────┘
local dev (pnpm dev) → phase/NN branch (from develop) → PR → GH Actions (lint/type/test/agent-tools/build)
        → Vercel preview URL (auto) → manual QA + agent visual-parity artifact
        → human approve → squash-merge to develop → staging preview verified
        → release: develop → main PR + tag → Vercel production deploy (auto)
        → post-deploy verification (release workflow) → rollback path: vercel promote
```
- **Git:** `main` protected (PR + green CI required); conventional commits; tags `v1.0.0` at launch; agents never push to `main` directly.
- **Agent lane:** every non-trivial change starts from a `agent/prompts/phase-N` seed or a named workflow; the PR body links the Agent Manager artifact (`agent/artifacts/<date>-<slug>/`) and pastes DoD evidence; reviewers check the workflow's evidence list, not just the diff.
- **Env:** Vercel project env (`NEXT_PUBLIC_SITE_URL` per environment); preview falls back to `VERCEL_URL`.
- **Rollback:** Vercel dashboard/CLI `vercel promote <prev>` (instant, CDN-level); documented in README runbook.
- **Post-deploy checks:** 200 on `/`, `/sitemap.xml`, `/robots.txt`, CV PDF; JSON-LD validator; OG debugger; Lighthouse mobile ≥95; Speed Insights streaming; axe scan on prod; theme/reduced-motion spot check; link sweep.

## 13. Deliverable Map (your 18 items → sections)
1 stack §1 · 2 architecture §2 · 3 folder §2.2 · 4 components §2.3 · 5 design system §2.6 · 6 responsive §3-P6 · 7 animation §2.7+P5 · 8 SEO §2.8+P7 · 9 a11y §4 · 10 performance §5 · 11 errors §6 · 12 testing §9 · 13 Vercel §7 · 14 security §8 · 15 deploy §12 · 16 phases §3 · 17 order §3 (critical path) · 18 DoD per phase in §3 · 19 agent architecture (Antigravity) §2.13 + phase agent-tasks in §3 + lane in §12.

## 14. Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Prototype behaviors lost in port | frozen prototype in `docs/` + screenshot-grid DoD per phase |
| Tailwind v4 token drift vs DESIGN-SYSTEM | Appendix A mapping committed; visual diff in P2 DoD |
| Hydration mismatch (theme/cookie) | cookie read server-side only; islands mount client-only state post-hydration |
| Auto-cycle jank on low-end | transform/opacity only, off-screen pause, 4×-throttle QA gate |
| Scope creep (forms, blog, CMS) | §2.12 extension paths documented but out of v1 scope |
| Free-tier surprise | §7 table verified at kickoff; zero-function architecture caps exposure |
| Agent drifts from prototype/spec | `agent/rules/20` (prototype = spec) + `visual-parity-check` workflow as a DoD gate; human visual sign-off mandatory per phase |
| Agent writes forbidden content or leaks secrets | content-policy Vitest + `content-scan.ts` + `secret-scan.ts` in CI; rules 10/50 forbid both at authoring time |
| Agent automation couples into production code | one-directional dependency enforced by ESLint import-ban, CI grep, and `bundle-check.ts` manifest assertion |
| Artifact bloat in repo | `artifacts/` + `scratch/` gitignored; promotion path to `context/decisions.md` keeps only durable knowledge |

---

### Appendix A — token port checklist (prototype → `@theme`)
colors (bg/bg-2/bg-3/term/panel/panel-2/panel-solid/line/line-2/grid/ink/ink-2/ink-3/accent/accent-2/accent-fg/accent-ink/accent-dim/accent-line/glow/glow-2/good/glass) ×2 themes · radii xl/lg/md/sm · shadows lg/sm · easings atelier/out · breakpoints xs/sm/md/lg/xl (§3-P6 table) · noise data-URI · keyframes list §P1.

### Appendix B — client-JS budget (gz est.)
React+Next runtime ~52 KB · Reveal/IO 1.0 · Counters 0.6 · Scramble 0.8 · HeroCanvas+parallax 1.6 · RoleLens 2.4 · Wiring 2.2 · ScrollSpy/Progress/Rail/Menu/Theme/Preloader 2.2 · Toast/Copy/BackToTop 0.9 · InteractionLayer 0.7 · **initial ≈ 64 KB** · CommandPalette +3.0 (lazy, post-interaction).

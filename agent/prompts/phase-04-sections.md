# PHASE 4 — Portfolio Sections (server-rendered, content-complete)

> Paste this entire file into Antigravity as one task. Phase 3 must be approved. Do not start Phase 5 until the Definition of Done is met and the owner approves the Final Report.

## CRITICAL AGENT RULES (binding for this phase)

1. Do not blindly implement. First inspect the existing project state and relevant files.
2. Do not overwrite working code unnecessarily.
3. Do not introduce unnecessary dependencies.
4. Do not invent information from my CV or profile.
5. Do not display project names anywhere on the portfolio.
6. Follow the approved prototype as the primary UI/UX reference.
7. If the prototype and implementation plan conflict, identify the conflict before making a major architectural change.
8. Keep the code production-ready.
9. Keep Server Components as the default in Next.js and use Client Components only when interaction requires them.
10. Treat performance as a first-class requirement.
11. Treat accessibility as a first-class requirement.
12. Do not use paid Vercel features without explicit approval.
13. Keep the application architecture clean and maintainable.
14. Keep Antigravity-specific files isolated inside the `agent` folder.
15. Do not move to the next phase until the current phase passes its validation and Definition of Done.
16. If something is unclear or potentially destructive, stop and ask for clarification instead of guessing.
17. After implementation, run the relevant checks and fix issues found during validation.

## 1. Objective

Port ALL content into typed modules and implement every section (01 Hero → 09 Contact + 03·B Wiring) server-rendered and content-complete, with the essential interactive cores functional **without motion** (state changes instant). After this phase the portfolio reads correctly with JavaScript disabled.

## 2. Context

Phases 1–3 delivered shell + tokens + primitives. Content source: `agent/context/cv-source.md` (verbatim facts) and prototype copy. Motion (reveals, counters animation, cycles, marquee animation, parallax, preloader) is explicitly Phase 5 — in Phase 4 render final/static states. Interactive cores in scope now: Exhibit role switching, Wiring node selection (+←/→ keys), copy-email, theme (done), menu (done).

## 3. Tasks

- [ ] **Content modules** (`content/`): `metrics.ts` (6), `expertise.ts` (7 bento tiles), `wiring.ts` (10 nodes/3 bands/2 buses), `exhibit.ts` (4 RoleSpecs: nav arrays 10/7/5/2, caps matrix, scope/mask/write/path/title/note + audit line templates), `experience.ts` (3 roles with bullets/contexts/tech), `principles.ts` (4), `stack.ts` (6 groups with key flags), `education.ts` (2), `contact.ts` (rows + availability + notice). Every metric carries a `// CV:` traceability comment.
- [ ] `tests/content-policy.test.ts` (Vitest): fails if any forbidden project name (Match Creatorz, Fivra, EinfraSouq, Aqar360, TPGE, Hakuba, Listeners Connect, case-insensitive) appears in `content/` or `app/` or `components/`.
- [ ] `agent/tools/content-scan.ts` + wire `pnpm agent:content-scan` (same scan, CI-ready); scope excludes `agent/context/` but asserts nothing imports cv-source.
- [ ] `agent/workflows/implement-section.md`: the repeatable playbook (read prototype section → content module → server component → primitives → base hover/focus → no-JS check → screenshot).
- [ ] Implement sections via one playbook run each (branch commits per section-pair):
  - **01 Hero**: pills, kicker, h1 (solid "Frontend" + outline "Engineer" + lime period; outline fill-on-hover CSS only), rotator line rendered with FIRST word static (scramble = P5), lede, CTA row (Explore primary / Download CV / Email ghost), link chips; `HeroCanvas` client island rendering the skeleton product window in **static super-admin state** (8 nav skels on, scope "all records", 8/8 modules, contacts visible) + 3 float chips positioned per prototype.
  - **Marquee**: duplicated tech set, overflow+mask, **animation off** (P5).
  - **02 Numbers**: divided 6-cell strip; counters render FINAL formatted values server-side (`3.5+`, `7`, `5,000+`, `~30%`, `4`, `8` with sub-labels).
  - **03 Expertise**: bento spans 8/4 · 4/4/4 · 6/6; icons from registry; evidence chips; feature tile role-grid rendered all-lit static.
  - **03·B Wiring**: `WiringDiagram` client island: bands/nodes/buses rendered; click + ←/→ select updates sticky panel (index/band/title/desc/ev/proof); **no auto-cycle** (P5); panel SSR-renders node 01 for no-JS.
  - **04 Exhibit**: `RoleLens` client island: role tabs (`aria-pressed`), capability matrix (✓/◐/— + column highlight), mock window (10-module nav with ✕ denied, url/scope/title/note/approve-state/masked contacts per role), audit console renders initial 3 lines static (stagger = P5), illustrative note.
  - **05 Experience**: sticky left rail facts; timeline with rail line (fill animation = P5, line static now); 3 roles with diamond bullets, context chips (type+region only), tech tags; current-role pulse badge.
  - **06 Principles**: 4 cards, outline numerals, evidence arrows (hover lift CSS only).
  - **07 Stack**: 6 group cards, `chip-key` primaries.
  - **08 Background**: 2 edu cards + trajectory note.
  - **09 Contact**: lines h2 (static mask reveal now), highlighter-hover giant mailto, CTA row, availability strip, contact rows with `CopyButton` (clipboard → textarea fallback → toast) and hover copy-hint.
  - **Footer content** already Phase 3 — verify index matches sections.
- [ ] Replace Phase 3 section stubs with real sections; remove placeholder page content.
- [ ] Base hover/focus states everywhere (CSS transitions only, no JS).

## 4. Technical Requirements

- Sections = Server Components; islands exactly: `HeroCanvas`, `WiringDiagram`, `RoleLens`, `CopyButton` (+ Phase 3 islands). List final island map in PR.
- No-JS: `curl` HTML must contain every section's text content (counters final values, wiring node 01 panel, exhibit super-admin state).
- Copy strings verbatim from prototype/CV; product references only as type+region+fact.
- Keep client JS of this phase ≤ +8 KB gz over Phase 3 baseline (measure in PR).

## 5. Files / Folders

Create/modify: `content/*.ts` (9 modules), `components/sections/*.tsx` (9), `components/interactive/{HeroCanvas,WiringDiagram,RoleLens,CopyButton}.tsx`, `tests/content-policy.test.ts`, `agent/tools/content-scan.ts`, `agent/workflows/implement-section.md`, `app/page.tsx` (compose sections).
Do not touch: layout shell (except stub removal), tokens, `docs/`.

## 6. Agent Folder

**Modified:** new tool `content-scan.ts`, workflow `implement-section.md`, artifact export with per-section screenshots + island map + JS delta.

## 7. Restrictions

- Do NOT add motion/reveals/counters animation/auto-cycles/preloader/parallax/magnetic/palette (Phase 5).
- Do NOT invent metrics, dates, companies, or product names; do NOT render cv-source content beyond CV-public facts.
- Do NOT make islands larger than their state logic (no animation code yet).
- Do NOT skip no-JS readability for any section.

## 8. Validation

- `pnpm lint && pnpm tsc --noEmit && pnpm build && pnpm test` green (policy test included).
- `pnpm agent:content-scan` exit 0.
- `curl -s localhost:3000 | grep -c` checks: each section id present; counter final strings present; wiring panel node-01 text present.
- Playwright: click each exhibit role → nav/mask/matrix/note/assert-state correct; wiring select + arrow keys update panel; copy button toasts; zero console errors.
- Screenshot each section at 1440 dark+light → owner visual review vs prototype.

## 9. Definition of Done

- [ ] All 9 sections + 03·B content-complete, server-rendered, interactive cores functional.
- [ ] Policy test + scan green; island map + JS delta in PR.
- [ ] Owner visual approval per section (screenshot grid).
- [ ] PR approved with Final Report.

## 10. FINAL REPORT (fill in and return)

- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (expected: none)
- Important technical decisions: …
- Validation performed (commands + results): …
- Remaining issues: …
- Requires my approval: …
- Artifact path: agent/artifacts/<date>-phase-04/

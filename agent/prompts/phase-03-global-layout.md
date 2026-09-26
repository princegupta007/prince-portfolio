# PHASE 3 — Global Layout

> Paste this entire file into Antigravity as one task. Phase 2 must be approved. Do not start Phase 4 until the Definition of Done is met and the owner approves the Final Report.

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

Implement the global shell exactly as the prototype: root layout (theme-from-cookie, noise, skip link, toast host), fixed header with stuck-state + scrollspy-active nav, mobile clip-path menu, dot rail, scroll progress bar, footer — all responsive and keyboard-complete. Sections themselves come in Phase 4.

## 2. Context

Phases 1–2 delivered app + tokens + primitives. Prototype reference: header (brand monogram PG lime, name + mono subtitle, 7 nav links with underline wipe + active state, ⌘K search button, theme icon button, lime CV button, burger ≤1080), mobile menu (full-screen clip-path circle from burger, staggered big links 02–09 + CTA row + meta), dot rail (fixed right, 9 dots, hover labels, active lime ring, hidden <1280), scroll progress (2px lime top bar), footer (brand col + 2-col section index + socials + back-to-top + bottom bar colophon "Typeset in Bricolage Grotesque, Inter & JetBrains Mono"). Theme: dark default, light "paper"; persisted; **no flash on reload** (cookie read at SSR — approved deviation).

## 3. Tasks

- [ ] `content/nav.ts`: nav items (numbers, expertise, exhibit, experience, principles, stack, contact) + rail items (+hero, background) + footer index (02–09).
- [ ] `content/profile.ts`: name, title, location, email, phone, github, linkedin, availability line, notice line (verbatim CV/prototype).
- [ ] `app/layout.tsx`: read theme cookie (`pg-theme`) server-side → `<html data-theme>`; mount `<Noise/>` (CSS-only), `<ScrollProgress/>`, skip link, `<Header/>`, `<DotRail/>`, `<MobileMenu/>`, `{children}`, `<Footer/>`, `<ToastHost/>`; body class handling without inline scripts.
- [ ] `components/layout/Header.tsx` (server shell) + client islands: `useScrolled` stuck state (blur+border after 10px), `ScrollSpy` (rAF-throttled; sets active on nav + rail), `ThemeToggle` (sets cookie 1y + state; swaps sun/moon; toast "Dark theme · engineering hours" / "Light theme · paper mode"), `MobileMenu` (clip-path circle at burger, staggered links via `--i`, esc closes, focus returns to burger, body scroll lock, `aria-expanded/hidden`).
- [ ] `components/layout/DotRail.tsx` (client; labels on hover; hidden <1280 via CSS).
- [ ] `components/layout/ScrollProgress.tsx` (client; passive scroll + rAF; width % of scrollable height).
- [ ] `components/layout/Footer.tsx` (server): brand col, index nav, socials (github/linkedin/mail icons), back-to-top button (smooth, reduced-motion aware), bottom bar with dynamic year.
- [ ] Command palette BUTTON only in header (⌘K kbd chip); the palette itself is Phase 5 (lazy).
- [ ] Anchor behavior: `scroll-behavior: smooth` (auto under reduced motion) + `scroll-padding-top` token; all nav/footer/rail anchors target section ids that will exist in Phase 4 (create empty placeholder `<section id>` stubs ONLY if needed for scrollspy testing, removed in Phase 4).
- [ ] Header responsive degradation per plan §3-P6 matrix: ≤1080 burger; ≤760 search hidden + brand subtitle hidden + CV icon-only; ≤420 CTAs full width.

## 4. Technical Requirements

- Server Components default; client islands minimal and listed in PR description (island map per plan §2.3).
- No layout shift: header fixed height token (72px / 64px ≤760); menu overlay fixed inset.
- Keyboard: tab order skip→brand→nav→actions; menu trap not required (full-screen nav) but focus return mandatory; all controls ≥38px target (44px on touch via padding).
- Theme cookie name/path/httpflags: JS-readable (`httpOnly: false` required for toggle), `SameSite=Lax`, `Path=/`.

## 5. Files / Folders

Create/modify: `app/layout.tsx`, `components/layout/{Header,MobileMenu,DotRail,ScrollProgress,Footer}.tsx`, `components/interactive/{ThemeToggle,ScrollProgress… as applicable}`, `hooks/{useScrolled,useScrollSpy,useTheme}.ts`, `content/{nav,profile}.ts`.
Do not touch: tokens, primitives, `docs/`, `agent/rules`.

## 6. Agent Folder

**No structural changes.** Export phase artifact (island list + keyboard-test notes) to `agent/artifacts/<date>-phase-03/`.

## 7. Restrictions

- Do not implement page sections or content modules beyond nav/profile (Phase 4).
- Do not implement the command palette body (Phase 5) — button + lazy mount point only.
- Do not use localStorage for theme (cookie-only, approved deviation).
- Do not add global state libraries.

## 8. Validation

- `pnpm lint && pnpm tsc --noEmit && pnpm build` green.
- Manual+Playwright: reload in light theme → first paint already light (no flash); scroll → header stuck + progress bar width grows; scrollspy active link follows stub sections; burger opens/closes menu, esc + link click close, focus returns; dot rail hover labels; back-to-top works; tab order screenshot of focus rings.
- Zero console errors; zero horizontal overflow at 390px.

## 9. Definition of Done

- [ ] All shell components committed with island map documented in PR.
- [ ] Theme persistence + no-FOUC verified in both themes.
- [ ] Keyboard journey (skip → nav → menu → footer → top) passes.
- [ ] Owner approved PR + Final Report.

## 10. FINAL REPORT (fill in and return)

- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (expected: none)
- Important technical decisions: …
- Validation performed (commands + results): …
- Remaining issues: …
- Requires my approval: …
- Artifact path: agent/artifacts/<date>-phase-03/

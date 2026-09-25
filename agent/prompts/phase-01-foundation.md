# PHASE 1 — Project Foundation

> Paste this entire file into Antigravity as one task. Phase 0 must be approved. Do not start Phase 2 until the Definition of Done is met and the owner approves the Final Report.

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

Initialize the Next.js application from scratch at repo root with the exact toolchain, config, fonts, folder skeleton and `agent/` governance scaffold defined in IMPLEMENTATION-PLAN §1–§2.2/§2.13 (Phase 1). End state: a green build serving a placeholder page, with fonts self-hosted and agent rules loadable.

## 2. Context

Phase 0 delivered `docs/` + `agent/context/` + analysis. Repo currently has no app code. Stack (plan §1): Next.js 15+ App Router, React 19, TypeScript strict, Tailwind CSS v4, ESLint 9 flat + eslint-config-next, Prettier + prettier-plugin-tailwindcss, pnpm, Node 20+. Runtime dependencies must remain `next, react, react-dom` only.

## 3. Tasks

- [ ] `pnpm create next-app` at repo root (App Router, TS, Tailwind, ESLint, no src dir, import alias `@/*`); delete starter boilerplate (`app/page.tsx` content replaced by a minimal placeholder, remove starter css/assets).
- [ ] `tsconfig.json`: `strict: true`, `noUncheckedIndexedAccess: true`, paths alias.
- [ ] ESLint flat config: `eslint-config-next` + typescript-eslint; add `no-restricted-imports` rule banning `agent/**` imports inside `app/ components/ lib/ content/ hooks/`; add Node-env override for `agent/tools/**`.
- [ ] Prettier config + `prettier-plugin-tailwindcss`; `.editorconfig`.
- [ ] `next/font/google`: Bricolage Grotesque (variable opsz/wdth/wght), Inter, JetBrains Mono → export CSS variables; wire into `globals.css` as `--font-display/--font-sans/--font-mono` placeholders (full tokens land in Phase 2).
- [ ] Create folder skeleton per plan §2.2: `components/{layout,sections,interactive,ui,seo}`, `content/`, `hooks/`, `lib/`, `public/cv/` (copy CV PDF from `docs/cv/`), `tests/e2e/`.
- [ ] `lib/cn.ts` (in-house ~8-line joiner; no clsx/tailwind-merge), `lib/constants.ts` (links: github.com/princegupta007, linkedin.com/in/princegupta7, mailto + phone verbatim from CV), `lib/format.ts` stub.
- [ ] `.env.example` with `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`; `.env*` gitignored.
- [ ] `vercel.json` skeleton: only security headers for now (plan §8); no redirects/caching yet (Phase 9/10).
- [ ] Git: verify repo state — `main` (production; stays untouched during build) and `develop` (integration) exist; do ALL Phase 1 work on `phase/01-foundation` cut from `develop`; PR target is `develop`; document (do not apply) protected-branch settings for owner on `main` (require PR + green CI).
- [ ] **Agent scaffold (plan §2.13 / Phase 1):** create `agent/rules/00-project.md`, `10-content-policy.md`, `20-design-system.md`, `30-performance.md`, `40-accessibility.md`, `50-code-style.md` (port constraints verbatim from plan + this prompt's rules); root `AGENTS.md` thin pointer (≤30 lines); `.gitignore` += `agent/artifacts/`, `agent/scratch/`; `package.json` scripts: `agent:content-scan`, `agent:screenshot-grid`, `agent:link-check`, `agent:bundle-check`, `agent:secret-scan` (stub `echo "implemented in later phase"` until each tool lands); add `tsx` as devDependency (only dev dep allowed for agent tooling).
- [ ] Placeholder `app/page.tsx`: server component rendering `<h1>Portfolio — foundation check</h1>` + font specimen paragraph (used by validation, replaced in Phase 3/4).

## 4. Technical Requirements

- Zero runtime deps beyond next/react/react-dom; devDeps limited to create-next-app defaults + prettier plugins + tsx.
- Fonts must be self-hosted by `next/font` (no `fonts.googleapis.com` request at runtime).
- `pnpm lint && pnpm tsc --noEmit && pnpm build` must pass before commit.

## 5. Files / Folders

Create/modify: repo root configs (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `prettier.config.mjs`, `.editorconfig`, `.env.example`, `vercel.json`, `.gitignore`), `app/{layout.tsx,page.tsx,globals.css}`, `lib/*`, folder skeleton, `public/cv/*.pdf`, `agent/rules/*`, `AGENTS.md`, `package.json`.
Do not touch: `docs/`, `agent/context/`, `agent/prompts/`.

## 6. Agent Folder

**Modified:** rules 00–50 authored, `AGENTS.md` pointer added, gitignore entries, `agent:*` script stubs. Application config carries only the isolation enforcement (ESLint ban) — that is app-side policy, not agent content.

## 7. Restrictions

- Do not implement design tokens, components, or sections (Phase 2–4).
- Do not add any UI/animation/icon/form library.
- Do not configure Vercel project or deploy (Phase 12).
- Do not edit `docs/prototype/*` (frozen).
- Do not commit `.env` files or secrets.

## 8. Validation

- `pnpm lint`, `pnpm tsc --noEmit`, `pnpm build` → exit 0.
- `pnpm dev` + browser network tab: zero requests to font CDNs; fonts served from `/_next/static/media/`.
- `grep -r "agent/" app components lib content hooks` for import statements → zero hits (ban rule also tested by intentionally adding+reverting a violating import in a scratch file, lint must flag it).
- Fresh Antigravity session smoke test: with only repo access, agent answers "list the content-policy rules and the JS budget" correctly from `AGENTS.md` + `agent/rules/*` without extra prompting.

## 9. Definition of Done

- [ ] All §3 tasks checked; build green; fonts self-hosted; import ban proven.
- [ ] `agent/rules/*` + `AGENTS.md` committed; artifacts/scratch gitignored.
- [ ] PR `phase/01-foundation` → `develop` opened with workflow name + Final Report; squash-merged after owner approval; branch deleted.

## 10. FINAL REPORT (fill in and return)

- Completed: …
- Files created: …
- Files modified: …
- Dependencies added: … (justify each; expect dev-only)
- Important technical decisions: …
- Validation performed (commands + results): …
- Remaining issues: …
- Requires my approval: …
- Artifact path: agent/artifacts/<date>-phase-01/

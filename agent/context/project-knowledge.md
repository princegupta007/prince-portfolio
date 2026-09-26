# Prince Gupta Portfolio - Project Knowledge Base

## 1. Project Overview
Personal portfolio of **Prince Gupta – Frontend Engineer** (React.js, Next.js, TypeScript). This is a single-page marketing site with no backend, auth, forms, or database. The primary goal is for recruiters to understand capabilities in under 60 seconds with exceptional performance (Lighthouse ~100) and zero client/project name leaks (strictly enforced).

## 2. Technology Stack
- **Framework:** Next.js 16.x App Router (single static route), React 19.
- **Language:** TypeScript (strict + `noUncheckedIndexedAccess`).
- **Styling:** Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.ts`).
- **Dependencies:** Exclusively `next`, `react`, and `react-dom`. **No** third-party animation libraries (like Framer Motion), icon packages, component libraries, or state libraries are allowed.
- **Tooling:** pnpm, Node 20+, ESLint 9 (flat config), Prettier.

## 3. Architecture & Folder Structure
- **`app/`**: Next.js App Router (SPA architecture). Contains `page.tsx` (composition of sections), `layout.tsx` (shell, providers), and error handling boundaries.
- **`components/sections/`**: Pure Server Components composing the main page (`Hero`, `Experience`, `Stack`, etc.).
- **`components/interactive/`**: The "Islands" where `'use client'` interactivity lives (`HeroCanvas`, `CommandPalette`, etc.). Minimal client JS.
- **`components/layout/`**: Shell elements (`Header`, `Footer`, `ThemeToggle`).
- **`components/ui/`**: Low-level, reusable UI primitives (`Button`, `Icon` - custom registry).
- **`agent/`**: AI coding agent workspace (isolated from app code). Contains rules, decisions, prompts, workflows, and validation tools. **Crucially, app code never imports from `agent/`.**

## 4. State Management
No third-party libraries (Redux, Zustand) are used. State is managed entirely via:
- **React Context:** `NavProvider` (shared scroll state), `ToastProvider`.
- **Custom Hooks (`hooks/`):** Isolated logic (e.g., `useScrollSpy`, `useScrolled`, `useReducedMotion`).

## 5. Styling / Design System
- **Tailwind v4:** Uses the native `@theme` block inside `app/globals.css`.
- **Themes:** Dark (default) and Light ("Paper"). Theme persistence is handled via a `pg-theme` cookie read during SSR (in `app/layout.tsx`) to prevent Flash of Unstyled Content (FOUC).
- **Design rules:** Restricted color usage (e.g., lime is never used as text on light backgrounds). 
- **Typography:** Self-hosted `next/font/google` (Bricolage Grotesque, Inter, JetBrains Mono).

## 6. UI/UX, Animations, and Responsiveness
- **Layout:** Continuous scrolling narrative with a sticky Header/Nav, `DotRail` scroll indicator, and `InteractionLayer`.
- **Animations:** Driven entirely by high-performance CSS transitions and keyframes (`transform` and `opacity` only). A robust reduced-motion strategy (`useReducedMotion` hook) automatically pauses ambient loops.
- **Responsive:** Adheres strictly to predefined Tailwind breakpoints (`xs:`, `sm:`, `md:`, `lg:`, `xl:`). No ad-hoc pixel media queries.

## 7. Performance & SEO
- **First-load Budget:** Strictly monitored via `agent/tools/bundle-check.ts` (tracked in `budget.json`).
- **SEO & Metadata:** Configured deeply in `app/layout.tsx`, `app/robots.ts`, and `app/sitemap.ts`. Includes structured data (`<JsonLd />`). 
- **Headers & Security:** Handled in `next.config.ts` (CSP, Cache-Control, etc.) ensuring localized testing and bypassing the need for `vercel.json`.

## 8. Error Handling & Quality Assurance
- **Error Boundaries:** Comprehensive coverage with `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`, and `app/loading.tsx`. Island runtime crashes use `IslandBoundary` for static variants.
- **Testing:** Vitest for fast unit tests, Playwright for e2e smoke testing (`tests/e2e/`), and `@axe-core/playwright` for accessibility (zero-violation policy).

## 9. Important Development Rules (Enforced)
- **Content Policy:** Specific client/project names (e.g., Match Creatorz, Fivra, Aqar360) are **banned** from rendered output. They must be replaced with their product types. CV facts (`agent/context/cv-source.md`) are frozen and must not be hallucinated.
- **Git workflow:** Work only on `phase/NN-<slug>` branches cut from `develop`. No direct commits to `main` or `develop`.
- **Isolation:** `eslint-config-next` enforces that app code never imports from `agent/`.

## 10. Technical Debt & Potential Risks
- **CI Pipeline Guard:** While `agent:bundle-check` exists, if Vercel deployment runs only `pnpm build` without the bundle check, bundle-size regressions could deploy undetected.
- **Lab vs. Prod Lighthouse:** Local lab LCP is TTFB-bound due to the dev environment; absolute performance must be measured on Vercel Edge.

## 11. Recommended Areas for Future Work
- Validate that the CI/CD pipeline on Vercel strictly executes the validation scripts (like `agent:bundle-check` and `agent:content-scan`) before allowing a deployment to production.
- Regular audits of the CSS animations against the reduced-motion preferences to ensure complete compliance.

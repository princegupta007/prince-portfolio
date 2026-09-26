# Rule 50 — Code Style & Conventions

## TypeScript

- `strict` + `noUncheckedIndexedAccess` (tsconfig — never weaken). No `any` in app code (`agent/tools` exempt). No non-null `!` to silence real edge cases — handle them.
- Route files (`page/layout/error/not-found/loading`) use default exports (Next requires); **everything else named exports**.
- Layout/page props: explicit `{ children }: { children: ReactNode }` (avoids dependency on generated `LayoutProps` route types for standalone `tsc --noEmit`).
- Content modules (`content/*.ts`) export frozen typed arrays satisfying `content/types.ts` interfaces; every metric/claim carries a `// CV:` traceability comment.

## React / Next

- `"use client"` only at island roots; islands receive serializable props; no island reaches into another island's state (lift to the nearest server parent or use DOM events).
- Hooks live in `hooks/` (`useReveal`, `useCountUp`, `useScramble`, `useAutoCycle`, `usePointerGlow`, `useScrollSpy`, `useReducedMotion`); each cleans up listeners/intervals/observers on unmount.
- Event listeners on scroll/pointer: `passive: true` + rAF throttle.
- Class names via `cn()` from `lib/cn.ts`; no string-concat class logic.

## Files & naming

- Components: `PascalCase.tsx` in `components/{layout,sections,interactive,ui,seo}/`. Hooks: `useCamelCase.ts`. Content/lib: `camelCase.ts` or `kebab-case.ts` (match existing files in the dir). Tests: mirror path under `tests/` (`*.test.ts`, `*.spec.ts`).
- Comments explain WHY, not what; reference plan/rule sections for non-obvious decisions (`// plan §2.3`, `// D1`).
- No dead code, no commented-out blocks, no TODO without a phase reference. Temporary routes (e.g. `/dev/tokens`) are deleted before their phase ends.

## Tooling

- Prettier is the formatter (`pnpm format`); `.prettierignore` protects `docs/` (frozen) — never reformat the prototype. ESLint flat config; the `no-restricted-imports` agent-ban block must never be weakened.
- Validation triad before every commit: `pnpm lint && pnpm exec tsc --noEmit && pnpm build` (plus `pnpm test` once suites exist).

## Commits & PRs

- Commit style: `type(scope): imperative summary` — types: feat/fix/docs/test/chore/perf/a11y/release; scope = section or area (`hero`, `wiring`, `phase-02`). Trailer: `Agent: Arena-Agent (phase-NN)` (D3).
- PR body must include: workflow used, artifact path (`agent/artifacts/<date>-phase-NN/`), DoD evidence (command outputs/screenshots), and the filled Final Report.
- One phase = one branch = one PR = one squash commit on `develop`.

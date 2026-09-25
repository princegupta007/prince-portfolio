# Workflow — implement-section (Phase 4 playbook)

Repeatable procedure for porting ONE prototype section into the Next.js app.
Run once per section (01 Hero → 09 Contact, plus 03·B Wiring). Each run ends
in a green build and a commit; sections are committed in pairs where small.

## Inputs

- `docs/prototype/index.html` — frozen visual/copy reference (hash-pinned, D7).
- `agent/context/cv-source.md` — fact source (NEVER imported by app code,
  NEVER rendered beyond CV-public facts, project names banned).
- `content/types.ts` — typed contracts; `lib/rich.tsx` — `**bold**`/`__good__` markers.
- `app/globals.css` — tokens + components + ported section CSS (motion stripped).

## Steps

1. **Read the prototype section.** Extract: section head (idx/title/meta),
   every string verbatim, class structure, icon names (map to
   `components/ui/Icon.tsx` registry), data-* hooks, and any JS behaviour.
   Note which behaviours are Phase 5 (motion/reveals/cycles/counters) and
   which are Phase 4 interactive cores (exhibit roles, wiring selection,
   copy, theme, menu).
2. **Write the content module** (`content/<section>.ts`) BEFORE any markup:
   typed exports, copy verbatim, every CV fact carrying a `// CV:` comment.
   Rich emphasis as `**…**` / `__…__` markers (parsed by `lib/rich.tsx`).
   No project names — products described by type + region + fact only.
3. **Write the server component** (`components/sections/<Section>.tsx`):
   - Server Component by default; interactivity ONLY via the sanctioned
     islands (`HeroCanvas`, `WiringDiagram`, `RoleLens`, `CopyButton`).
   - Compose primitives (`SectionHead`, `Chip`, `Pill`, `Tag`, `Card`,
     `Button`, `Icon`) before raw markup; raw markup uses the ported
     prototype class names so the CSS applies unchanged.
   - SSR must render the COMPLETE readable state: final counter values,
     wiring panel node 01, exhibit super-admin lens, first audit lines.
     A visitor with JavaScript disabled loses decoration, never content.
4. **Base hover/focus states** — CSS transitions only (already in
   globals.css). No JS-driven hover, no motion beyond transitions.
5. **Policy + no-JS check**:
   - `pnpm test` (content-policy) and `pnpm agent:content-scan` green.
   - `pnpm build && (next start) && curl -s localhost:3100 | grep -c "<string>"`
     for 3–5 signature strings of the section (must all be ≥ 1).
6. **Screenshot** at 1440 dark + light into `agent/artifacts/<date>-phase-04/`
   (and mirror to `/home/user/handoff/evidence/phase-04/`), compare against
   the prototype rendering, fix drift.
7. **Commit** (`section: NN <name> — content module + component`), keep the
   working tree green: `pnpm lint && pnpm typecheck && pnpm build`.

## Guardrails

- Do not add dependencies. Do not touch layout shell / tokens / docs.
- Islands stay minimal: state + handlers only; animation code is Phase 5.
- If prototype and IMPLEMENTATION-PLAN conflict: stop, record the conflict
  in `agent/context/decisions.md`, ask before architectural changes.
- Client JS budget for the whole phase: ≤ +8 KB gz over Phase 3 baseline.

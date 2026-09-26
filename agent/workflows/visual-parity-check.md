# Workflow · Visual Parity Check (responsive + theme)

Purpose: catch layout regressions that DOM/spec assertions cannot see — clipped content inside
`overflow:hidden` parents, theme-only breakage, and breakpoint behaviour drift from the frozen
prototype (`docs/prototype/index.html`).

## When to run
- After ANY change to `app/globals.css` layout rules, breakpoint blocks, or component markup.
- Before opening a phase PR that touches UI (phases with visual scope: 01, 02, 06, and any fix/*).
- After content edits that lengthen text (longer strings change min-content widths).

## Steps
1. **Build & serve** (production build — dev server differs):
   `pnpm exec next build` then `pnpm exec next start -p 3100`.
   Verify freshness: `curl -s localhost:3100 | grep -o '/_next/static/[^"]*\.css'` then grep the
   served chunk for a rule you just changed. Stale `.next` is the #1 false-negative source.
2. **Run the grid harness**: `pnpm agent:screenshot-grid`.
   Outputs to `agent/artifacts/<date>-<phase>/grid/`: `{theme}-{width}-full.png`,
   `{theme}-{width}-{section}.png`, `overflow.json`, exit 1 on findings.
   Assertions: document overflow · fixed-layer escape · **clipped elements** (right edge beyond
   viewport outside `.role-tabs,.mock-side,.cmd-list,.mq`).
3. **Eyeball the extremes**: open `dark-320-hero.png`, `light-320-*`, `*-1920-full.png`.
   Element clips catch what numbers miss (kerning, orphans, canvas chrome).
4. **Matrix diff**: for every row in the phase binding matrix, confirm computed style at one
   narrow + one wide viewport (see `agent/tools/check-phase06.py` §A for the pattern).
5. **Touch/keyboard pass** (coarse pointer emulation): targets ≥44px; approved scrollers
   keyboard-reachable (focus + ArrowRight changes `scrollLeft`); hover-only hints have focus
   parity.
6. **Record**: append findings to `agent/artifacts/<date>-<phase>/findings.md`
   (symptom → root cause → fix → verification), decisions to `agent/context/decisions.md`.

## False-negative traps (learned phase-06)
- `overflow:hidden` ancestors hide clipped children from `scrollWidth` → always run the clipped
  assertion or inspect element screenshots.
- Flex rows with `white-space:nowrap` children keep full intrinsic min-content even with
  `min-width:0` + ellipsis → wrap the row at small breakpoints instead.
- Grid `1fr` tracks floor at item min-content → use `minmax(0,1fr)` when children can shrink.
- `pkill next` inside the same shell command that starts the server kills the new server too —
  split kill / build / start into separate commands.

# Workflow · Accessibility Pass (regression checklist)

Run after any markup, ARIA, token or motion change. Commands assume the repo root
and a production build served on :3100 (`pnpm exec next build && pnpm exec next start -p 3100`).

## 1. Automated scans
- `pnpm test:e2e a11y` — axe-core (wcag2a/aa + 2.1a/aa) over 5 states × 2 themes
  (default, palette-open, exhibit-role2, mobile-default, mobile-menu-open). Target **0**.
  Reports: `agent/artifacts/<date>-phase-07/axe/*.json`. Never suppress; fix at source.
- `pnpm test:e2e keyboard` — keyboard journey (skip link first, header order, deep reach,
  palette trap+restore, menu esc+restore, wiring arrows, exhibit Enter, back-to-top),
  focus-ring visibility grid (both themes, screenshots in `focus-grid/`), reduced-motion
  (parallax inert, marquee/scan/busflow stopped, preloader absent) and coarse-pointer tilt off.
- `pnpm exec tsx agent/tools/sr-dump.ts` — heading order, landmark uniqueness, table/list
  semantics, unnamed-control scan + SR name dump (`sr-dump.md`).
- `python3 agent/tools/contrast-table.py` — WCAG ratios for every token pair, both themes
  (`contrast-table.md`). AA: 4.5:1 normal, 3:1 ≥24px. Fix via tokens only, log deltas.

## 2. Manual/spot checks (each UI phase)
- Open states hide most violations: menu sheet, palette, exhibit after role switch — always scan open.
- `overflow:hidden` ancestors: focus rings must not be clipped inside bento/tabs/scrollers
  (tab to an item mid-scroller and screenshot).
- New interactive element? Decide button vs link (action = button, navigation = link),
  give it a visible focus ring and a name (aria-label for icon-only).
- New decorative motion? Add it to the reduced-motion kill-list AND gate tilt/parallax on
  `(pointer: fine)`.
- New text token pair? Add it to `contrast-table.py` PAIRS.

## 3. Traps learned (phase-07)
- `opacity` on a container dilutes text contrast — dim non-text parts instead.
- Hardcoded hexes bypass theme tokens (audit console) — prefer tokens or per-theme vars.
- `li[role=option]` wrapping a `<button>` = nested-interactive; put `option` on the button,
  `role="none"` on the li.
- tsx serializes `page.evaluate` callbacks with keep-names: **no named inner functions**
  inside evaluate bodies (use `$$eval` or anonymous arrows) or the page throws `__name`.
- Native `<dialog showModal>` gives trap+restore for free; custom sheets must focus-in on
  open and restore on close (MobileMenu pattern).

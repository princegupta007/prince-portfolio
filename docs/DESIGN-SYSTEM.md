# Portfolio Redesign — Design System & Visual Direction
**Prince Gupta · Frontend Engineer** — prototype v2.0 · single-file HTML/CSS/JS (`index.html`)

---

## 1. Concept — "Engineering Atelier"

The portfolio is positioned as a **precision instrument catalogue for a frontend engineer**: an editorial,
studio-grade surface with engineering artefacts embedded in it. The signature story is
**"permission-driven interfaces"** — the thing Prince actually ships — expressed three times:

1. **Hero** — an auto-cycling, skeleton "product canvas" where modules, scopes and masked contact
   cells change as the role cycles (teaser).
2. **Exhibit (§04)** — the same pattern as a *fully interactive specimen*: role tabs, capability
   matrix, live mock app and a streaming audit console (payoff).
3. **Copy** — "the UI reflects permissions, it never grants them" as a recurring principle.

Nothing is template-derived: asymmetric bento, outline display type, acid-lime markers and a
terminal panel give it an identity a recruiter remembers.

## 2. Colour system

| Token | Dark (default) | Light ("paper") | Use |
|---|---|---|---|
| `--bg` | `#0A0B0D` near-black | `#F5F4ED` warm paper | canvas |
| `--bg-2 / --bg-3` | `#0E1014 / #131519` | `#FBFAF4 / #EEEDE2` | panels, chrome |
| `--ink` | `#F2F1EA` warm ivory | `#15161A` | primary text |
| `--ink-2 / --ink-3` | `#A7ACB6 / #696F7B` | `#4B505C / #868C98` | secondary / meta |
| `--accent` | `#CBF24C` acid lime | `#C6F04E` | fills, markers, primary CTA |
| `--accent-fg` | `#CBF24C` | `#546E0B` olive | accent **text** (contrast-safe per theme) |
| `--accent-dim / --accent-line` | lime @ 11% / 34% | lime @ 20% / olive @ 40% | tints, borders |
| `--good` | `#79DFA2` | `#1F8A4C` | live/available states |
| `--term` | `#0B0C0F` (fixed) | same | audit console stays dark in both themes |

Rules: lime is **never body text on light** (olive is); primary buttons are lime with near-black
text in both themes (≈14:1); hairlines `rgba` white/black 8–16%; noise overlay (SVG `feTurbulence`,
data-URI) at 4–5% for print texture; fine 58px grid masked radially in the hero only.

## 3. Typography

| Role | Family | Scale |
|---|---|---|
| Display (h1/h2/h3, buttons, big numerals) | **Bricolage Grotesque** 600–800 | h1 `clamp(3.3rem,8.4vw,6.6rem)` lh .94, tracking −.035em; h2 `clamp(1.85rem,3.7vw,2.9rem)` |
| Body / UI | **Inter** 400–600 | 0.92–1.1rem, lh 1.6–1.78 |
| Technical (labels, chips, logs, kickers) | **JetBrains Mono** 400–600 | 0.56–0.78rem, tracking +.06…+.24em, mostly uppercase |

Signature moves: **outline stroke words** (`-webkit-text-stroke`, filled lime on hero hover),
line-mask reveals, tabular numerals for metrics, mono index chips (`02`), `E — 01` tile numbers.
Fallbacks: system-ui / ui-monospace stacks so the file degrades gracefully offline.

## 4. Layout & spacing

* Container `--maxw:1240px`, inline padding `clamp(20px,4.5vw,52px)`.
* Section rhythm `padding-block: clamp(84px,11vw,140px)` + 1px top border (continuous "spec sheet").
* Grids: 12-col bento (8/4 · 4/4/4 · 6/6), 6-col metrics strip with divided cells,
  sticky 290px left rail for the timeline, 2-col exhibit (tabs+matrix | mock+console).
* Radii: 24 / 18 / 12 / 8px + full pills; shadows long & soft (`0 44px 100px −44px`).

## 5. Component inventory

Pills (pulse-dot availability) · magnetic buttons (primary lime / ghost) with shine sweep ·
tech chips + `chip-key` highlighter · evidence chips · bento cards with pointer-follow glow ·
role tabs (left lime bar) · capability matrix (✓ / ◐ / — + column highlight) · mock app window
(chrome, sidebar, table, masked cells) · always-dark audit console · timeline with scroll-filled
rail + diamond bullets · context chips ("described by type") · principle cards with giant outline
numerals · education cards with hover spine · contact rows with copy-hint & slide arrow ·
dot-rail scrollspy · ⌘K command palette · toast · preloader (000→100 + curtain) · marquee ticker.

## 5·B. "03·B — How it's wired" interactive schematic (added v2.1)

**Evaluation verdict: included, in scoped form.** Value: it is the only place in the portfolio that
shows *systems thinking* — how the engineering layers connect — which prose cards cannot carry, and
every node is backed by shipped CV evidence (no invented claims, no project names).

Rejected variants and why: click-to-expand-in-place / modals (layout jumps, "click 10 boxes"
homework), generic boxes-and-arrows (cliché), interaction-required content (gimmick risk), a new
numbered section (page bloat).

Shipped design decisions:
* **Master–detail, not expand-in-place** — diagram fully legible at rest; selecting a node swaps a
  sticky side panel (index, layer tag, description, evidence chips, "shipped proof" line).
* **Layered signal-flow schematic** — 3 bands (Interface / State & data / Platform), 10 nodes
  (3/4/3), animated flow buses between layers (`busflow` dots + mono bus labels).
* **Passive-friendly** — auto-cycles every 4.6s, pauses off-screen (IntersectionObserver), stops
  permanently on first user click ("Manual mode — ← → keys also move between nodes"),
  disabled under `prefers-reduced-motion`.
* **Accessible** — nodes are real `<button aria-pressed>`, arrow-key navigation on the diagram,
  panel labelled as a region; no layout shift on selection.
* Responsive: panel drops below diagram ≤1080; band c4 → 2 cols; all bands 1 col ≤640; verified
  zero horizontal overflow at 390px.

## 6. Motion system

`--ease:cubic-bezier(.22,.72,.2,1)` / `--ease-out:cubic-bezier(.16,1,.3,1)`.
Reveals: fade-rise 0.8s + stagger `--d`; headings: 1.0s line-mask. Counters: 1.5s easeOutQuart.
Scramble-decode rotating hero word (3.6s cycle). Canvas: 7.5s float, 6s scanline, 2.9s role cycle
(paused off-screen). Micro: pointer glow (`--mx/--my`), magnetism, chip lift, underline wipes,
audit lines staggered 150ms. **All motion collapses under `prefers-reduced-motion`.**

## 7. Responsive strategy

* **≥1280** full experience incl. right dot-rail.
* **≤1080** nav → burger + full-screen clip-path menu; hero stacks; bento 12/6; timeline single
  column (rail preserved); role tabs become horizontal scroller; mock sidebar → top scroller.
* **≤760** metrics 2-col; all bento 12; tables compress; header sheds search/labels.
* **≤420** CTAs full-width. No horizontal overflow at 390px (verified; grid children carry
  `min-width:0` where scrollers live).

## 8. Accessibility & recruiter UX

Skip link · semantic landmarks & list roles · `aria-pressed` role tabs · focus-visible lime rings ·
contrast-safe accent per theme · `aria-live` toast · keyboard ⌘K palette (↑↓ ↵ esc) · CV button
persistent in header, hero, palette and contact · every fact traceable to the CV.

## 9. Content rule (hard constraint)

**Zero project names.** Products appear only as *types + facts*: "hiring marketplace — real-time
bidding & chat", "B2B procurement marketplace — Oman/GCC", "multi-site café platform — Western
Australia", etc. Companies (Konstant Infosolutions, SSTPL), titles, dates, metrics and stack are
verbatim from the CV. Verified by automated scan (0 matches).

## 10. Files

```
portfolio-redesign/
├── index.html                      ← the prototype (self-contained; fonts via Google Fonts CDN)
├── cv/Prince_Gupta_Frontend_Engineer.pdf   ← wired to every "Download CV" action
└── DESIGN-SYSTEM.md                ← this document
```

**Next stage (not built yet, per brief):** port this direction into the production app
(Next.js + Tailwind tokens from §2–4), keep the exhibit as an isolated interactive component.

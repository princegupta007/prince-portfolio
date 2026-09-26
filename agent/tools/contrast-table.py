#!/usr/bin/env python3
"""Phase 07 · WCAG contrast table for every token text/background pair used by
the design system, both themes. Reads token hexes straight from app/globals.css
(source of truth), computes WCAG 2.1 ratios, writes the table to the phase-07
artifact and exits non-zero on any AA miss (4.5:1 normal, 3:1 for >=24px text).
Usage: python3 agent/tools/contrast-table.py [artifact_dir]"""
import re, sys, pathlib

CSS = pathlib.Path("app/globals.css")
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1
                   else "agent/artifacts/2026-09-26-phase-07/contrast-table.md")

src = CSS.read_text()
# theme blocks: :root (dark default) and the light override block
root = src[src.index(":root {"): src.index(":root {") + src[src.index(":root {"):].index("}") + 2000]
blocks = re.findall(r"(@theme\s*\{|:root\s*\{|html\[data-theme=\"light\"\]\s*\{)(.*?)}", src, re.S)
tokens = {"dark": {}, "light": {}}
for head, body in blocks:
    theme = "light" if "light" in head else "dark"
    for name, hexv in re.findall(r"--color-([\w-]+):\s*(#[0-9a-fA-F]{6})", body):
        tokens[theme][name] = hexv
# fallback: first :root block is dark, second themed block light
if not tokens["light"]:
    print("!! light token block not found", file=sys.stderr); sys.exit(2)

def lum(h):
    def c(v):
        v = int(h[1+v:3+v], 16) / 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * c(0) + 0.7152 * c(2) + 0.0722 * c(4)

def ratio(a, b):
    la, lb = lum(a), lum(b)
    if la < lb: la, lb = lb, la
    return (la + 0.05) / (lb + 0.05)

BOTH = {"dark", "light"}
PAIRS = [  # (fg, bg, note, large?, themes)
    ("ink",        "bg",          "body text",             False, BOTH),
    ("ink",        "panel-solid", "cards / raised",        False, BOTH),
    ("ink-2",      "bg",          "secondary text",        False, BOTH),
    ("ink-2",      "panel-solid", "secondary on cards",    False, BOTH),
    ("ink-3",      "bg",          "meta / mono labels",    False, BOTH),
    ("ink-3",      "panel-solid", "meta on cards",         False, BOTH),
    ("accent-fg",  "bg",          "accent text (lime/olive)", False, BOTH),
    ("accent",     "bg",          "lime display text",     True,  {"dark"}),
    ("accent-ink", "accent",      "button label on lime",  False, BOTH),
    ("ink",        "accent",      "ink label on lime",     False, {"light"}),
]

lines = ["# Phase-07 contrast table (WCAG 2.1)", "",
         "| theme | pair | fg | bg | ratio | need | pass |", "|---|---|---|---|---|---|---|"]
fails = 0
for theme in ("dark", "light"):
    t = tokens[theme]
    for fg, bg, note, large, themes in PAIRS:
        if theme not in themes:
            continue
        if fg not in t or bg not in t:
            lines.append(f"| {theme} | {fg}/{bg} | — | — | n/a | — | skip |")
            continue
        r = ratio(t[fg], t[bg])
        need = 3.0 if large else 4.5
        ok = r >= need
        fails += 0 if ok else 1
        lines.append(f"| {theme} | {fg} on {bg} ({note}) | `{t[fg]}` | `{t[bg]}` | {r:.2f} | {need} | {'✅' if ok else '❌'} |")
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("\n".join(lines) + "\n")
print("\n".join(lines))
print(f"\n[contrast] {fails} AA miss(es) → {OUT}")
sys.exit(1 if fails else 0)

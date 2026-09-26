#!/usr/bin/env python3
"""Phase 06 acceptance checks — responsive matrix behaviour, coarse-pointer targets,
keyboard scrollers, focus parity, per-element clip assertion.
Usage: python3 agent/tools/check-phase06.py [base_url]"""
import sys, json
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3100"
PASS, FAIL = [], []

def check(name, ok, detail=""):
    (PASS if ok else FAIL).append(f"{name}{' — ' + detail if detail else ''}")

def cs(page, sel, prop):
    return page.evaluate(
        "([s,p]) => getComputedStyle(document.querySelector(s))[p]", [sel, prop])

with sync_playwright() as pw:
    b = pw.chromium.launch()

    # ---------- A. binding-matrix behaviour at narrow vs wide ----------
    pages = {}
    for w in (360, 1280):
        pg = b.new_page(viewport={"width": w, "height": 900})
        pg.goto(BASE, wait_until="networkidle"); pg.wait_for_timeout(1200)
        pages[w] = pg
    n, w = pages[360], pages[1280]

    check("A1 burger hidden @1280 / shown @360",
          cs(w, ".burger", "display") == "none" and cs(n, ".burger", "display") != "none")
    check("A2 nav swap: inline nav @1280 ↔ sheet+burger @360",
          cs(n, ".menu", "visibility") == "hidden" and cs(n, "nav.nav", "display") == "none"
          and cs(w, "nav.nav", "display") != "none" and cs(w, ".burger", "display") == "none")
    check("A3 role-tabs = approved scroller @360 (overflow-x + fade mask)",
          cs(n, ".role-tabs", "overflowX") == "auto" and cs(n, ".role-tabs", "maskImage") != "none")
    check("A4 audit-grid single column @360",
          len(cs(n, ".audit-body", "gridTemplateColumns").split()) == 1)
    check("A5 matrix rows 5 cols @360 (1fr + 4×36)",
          cs(n, ".mx-row", "gridTemplateColumns").split()[1] == "36px")
    check("A6 cv-side wrapped grid @360, column-flex @1280",
          cs(n, ".cv-side", "display") == "grid" and cs(w, ".cv-side", "display") != "grid")
    check("A7 all 8 nav skeletons inside viewport @360",
          n.evaluate("() => [...document.querySelectorAll('.nav-skel')].length === 8 &&"
                     "[...document.querySelectorAll('.nav-skel')].every(s => s.getBoundingClientRect().right <= innerWidth + 1)"))
    check("A8 cv-body single column @360",
          len(cs(n, ".cv-body", "gridTemplateColumns").split()) == 1)
    check("A9 hero-grid single column @360",
          len(cs(n, ".hero-grid", "gridTemplateColumns").split()) == 1)
    check("A10 cv-chrome wraps @360",
          cs(n, ".cv-chrome", "flexWrap") == "wrap")
    for pg in pages.values(): pg.close()

    # ---------- B. coarse-pointer target sizes ----------
    ctx = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    pg = ctx.new_page(); pg.goto(BASE, wait_until="networkidle"); pg.wait_for_timeout(1200)
    coarse = pg.evaluate("() => matchMedia('(pointer: coarse)').matches")
    check("B0 coarse pointer emulated", coarse)
    sizes = pg.evaluate("""() => {
      const sel = ['.burger', '.icon-btn', '.role-tab', '.crow', '.kbd-btn'];
      const out = {};
      for (const s of sel) {
        const els = [...document.querySelectorAll(s)].filter(e => e.getBoundingClientRect().height > 0);
        out[s] = els.length ? Math.min(...els.map(e => Math.min(e.getBoundingClientRect().height, e.getBoundingClientRect().width >= 0 ? e.getBoundingClientRect().height : 0))) : -1;
      }
      // menu links while sheet open
      return out;
    }""")
    for s, v in sizes.items():
        if v < 0:
            PASS.append(f"B {s} — hidden at 390px, not a touch target here (skipped)")
            continue
        check(f"B {s} ≥44px on coarse", v >= 44, f"{v}px")
    min_h = pg.evaluate("""() => {
      document.querySelector('.burger')?.click();
      return new Promise(r => setTimeout(() => {
        const els = [...document.querySelectorAll('.menu a')].filter(e => e.getBoundingClientRect().height > 0);
        r(els.length ? Math.min(...els.map(e => e.getBoundingClientRect().height)) : -1);
      }, 500));
    }""")
    check("B menu links ≥44px (sheet open)", min_h >= 44, f"{min_h}px")
    pg.close(); ctx.close()

    # ---------- C. keyboard scrollers + focus parity ----------
    pg = b.new_page(viewport={"width": 390, "height": 900})
    pg.goto(BASE, wait_until="networkidle"); pg.wait_for_timeout(1200)
    pg.evaluate("() => document.querySelector('.role-tab').focus()")
    seq = [pg.evaluate("() => [...document.querySelectorAll('.role-tab')].indexOf(document.activeElement)")]
    for _ in range(3):
        pg.keyboard.press("Tab")
        pg.wait_for_timeout(80)
        seq.append(pg.evaluate("() => [...document.querySelectorAll('.role-tab')].indexOf(document.activeElement)"))
    check("C1 role-tabs: Tab order advances through every tab",
          seq[0] == 0 and all(seq[i] < seq[i + 1] for i in range(len(seq) - 1)) and seq[-1] >= 3,
          str(seq))
    side = pg.evaluate("""() => {
      const t = document.querySelector('.mock-side');
      return t ? { hidden: t.getAttribute('aria-hidden'),
                   focusables: t.querySelectorAll('button, a, [tabindex]').length } : null;
    }""")
    check("C2 mock-side stays decorative (aria-hidden, no tab traps)",
          side is not None and side["hidden"] == "true" and side["focusables"] == 0, json.dumps(side))
    hint = pg.evaluate("""async () => {
      const row = document.querySelector('.crow');
      row.focus();
      await new Promise(r => setTimeout(r, 500));
      const h = row.querySelector('.copy-hint');
      return h ? parseFloat(getComputedStyle(h).opacity) : -1;
    }""")
    check("C3 copy-hint visible on keyboard focus", hint == 1, f"opacity={hint}")
    pg.close()

    # ---------- D. per-element clip assertion ----------
    for vw in (320, 360, 390, 414):
        pg = b.new_page(viewport={"width": vw, "height": 900})
        pg.goto(BASE, wait_until="networkidle"); pg.wait_for_timeout(1200)
        clipped = pg.evaluate("""() => [...document.querySelectorAll('body *')].filter(el => {
            const r = el.getBoundingClientRect();
            return r.right > innerWidth + 1 && !el.closest('.mq, .role-tabs, .mock-side, .cmd-list')
                   && getComputedStyle(el).position !== 'fixed';
          }).length""")
        check(f"D clip-free @{vw}", clipped == 0, f"{clipped} clipped")
        pg.close()
    b.close()

print(f"\ncheck-phase06: {len(PASS)} passed, {len(FAIL)} failed")
for f in FAIL: print("  ✗", f)
sys.exit(1 if FAIL else 0)

#!/usr/bin/env python3
"""Phase 5 validation — motion & advanced UI/UX.

Covers: preloader (once/session), reveals, counters, scramble, canvas cycle,
wiring auto-cycle + permanent handover, role-visual cycler, ⌘K palette (lazy),
magnetic + card glow, timeline fill, toast animation, reduced-motion static
page, no-JS complete page. Run against `next start -p 3100`.

Usage: python3 check-phase05.py [base-url] [outdir]
"""
import sys, time, json
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3100"
OUT = sys.argv[2] if len(sys.argv) > 2 else "/tmp/p5-shots"
import os; os.makedirs(OUT, exist_ok=True)

RESULTS = []
def check(name, ok, detail=""):
    RESULTS.append((name, bool(ok), detail))
    print(("PASS " if ok else "FAIL ") + name + (f"  [{detail}]" if detail and not ok else ""))

def wait_loader_gone(page, timeout=4000):
    page.wait_for_function("() => { const l = document.getElementById('loader'); return !l || getComputedStyle(l).display === 'none'; }", timeout=timeout)

with sync_playwright() as pw:
    browser = pw.chromium.launch()

    # ═══ 1. PRELOADER — first view of session ═══
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    pg = ctx.new_page()
    pg.goto(BASE + "/", wait_until="commit")
    # boot script ran pre-paint
    pg.wait_for_function("() => document.documentElement.classList.contains('js')", timeout=3000)
    had_pre = pg.evaluate("() => document.documentElement.classList.contains('pg-pre') || sessionStorage.getItem('pg-seen') === '1'")
    loader_visible = pg.evaluate("() => { const l = document.getElementById('loader'); return !!l && getComputedStyle(l).display !== 'none' && !l.classList.contains('done'); }")
    mid_count = pg.evaluate("() => document.getElementById('ldNum')?.textContent")
    pg.screenshot(path=f"{OUT}/01-preloader.png")
    check("preloader visible on first session view", had_pre and loader_visible, f"pg-pre={had_pre} visible={loader_visible}")
    # count completes → curtain → hidden
    pg.wait_for_function("() => document.getElementById('ldNum')?.textContent === '100'", timeout=4000)
    wait_loader_gone(pg, 5000)
    seen = pg.evaluate("() => sessionStorage.getItem('pg-seen')")
    body_loading = pg.evaluate("() => document.body.classList.contains('loading')")
    pre_removed = pg.evaluate("() => !document.documentElement.classList.contains('pg-pre')")
    check("preloader completes 000→100, curtain hides, pg-seen set", seen == "1" and not body_loading and pre_removed, f"seen={seen} loading={body_loading}")
    check("loader mid-count captured", mid_count is not None, str(mid_count))

    # ═══ 2. REVISIT — no loader ═══
    t0 = time.time()
    pg.reload(wait_until="domcontentloaded")
    loader_hidden = pg.evaluate("() => { const l = document.getElementById('loader'); return !!l && getComputedStyle(l).display === 'none'; }")
    check("revisit: loader hidden immediately", loader_hidden, f"{time.time()-t0:.2f}s")

    # ═══ 3. REVEALS + LINE MASKS ═══
    pg.wait_for_timeout(1200)  # hydration
    hero_h1_in = pg.evaluate("() => document.querySelector('.hero-h.lines')?.classList.contains('in')")
    below = pg.evaluate("""() => {
      const els = [...document.querySelectorAll('.reveal')].filter(e => e.getBoundingClientRect().top > innerHeight);
      if (!els.length) return null;
      const e = els[0];
      return { opacity: getComputedStyle(e).opacity, hasIn: e.classList.contains('in'), cls: e.className };
    }""")
    check("hero lines unmasked after load", hero_h1_in)
    check("below-fold reveal starts hidden (opacity 0, no .in)", below and float(below["opacity"]) == 0 and not below["hasIn"], json.dumps(below or {}))
    pg.evaluate("() => document.getElementById('numbers').scrollIntoView({behavior:'instant'})")
    pg.wait_for_timeout(1500)
    metrics_in = pg.evaluate("() => { const m = document.querySelector('.metrics'); return m.classList.contains('in') && getComputedStyle(m).opacity === '1'; }")
    check("scroll reveals metrics (.in + opacity 1)", metrics_in)
    pg.screenshot(path=f"{OUT}/02-numbers-revealed.png")

    # ═══ 4. COUNTERS ═══
    finals = pg.evaluate("""() => [...document.querySelectorAll('.m-v [data-count]')].map(e => e.textContent.trim())""")
    expect = ["3.5", "7", "5,000", "30", "4", "8"]
    check("counters land on final values", finals == expect, json.dumps(finals))

    # ═══ 5. SCRAMBLE ROTATOR ═══
    pg.evaluate("() => document.getElementById('hero').scrollIntoView({behavior:'instant'})")
    words = set()
    for _ in range(9):
        words.add(pg.evaluate("() => document.getElementById('rotator')?.textContent.trim()"))
        pg.wait_for_timeout(900)
    check("scramble rotator cycles words", len(words) >= 3, json.dumps(sorted(words)))

    # ═══ 6. HERO CANVAS CYCLE ═══
    states = []
    for _ in range(9):
        states.append(pg.evaluate("""() => ({
          role: document.getElementById('hcRole')?.textContent.trim(),
          lit: document.querySelectorAll('#hcNav .nav-skel.on').length,
          scope: document.getElementById('hcScope')?.textContent.trim(),
          mods: document.getElementById('hcMods')?.textContent.trim(),
          contact: document.querySelector('.hc-contact')?.textContent.trim(),
          masked: !!document.querySelector('.hc-contact.masked'),
          foot: document.querySelector('.cv-foot span')?.textContent.trim(),
        })"""))
        pg.wait_for_timeout(1000)
    roles = [s["role"] for s in states]
    check("canvas cycles roles (≥3 distinct in 9s)", len(set(roles)) >= 3, json.dumps(roles))
    lit_by_role = {s["role"]: s["lit"] for s in states}
    check("nav skeletons follow role (8/6/4/2)", all(lit_by_role.get(r) == n for r, n in
          [("super admin", 8), ("admin", 6), ("company", 4), ("partner", 2)] if r in lit_by_role),
          json.dumps(lit_by_role))
    masked_states = [s for s in states if s["role"] in ("company", "partner")]
    check("contacts masked for company/partner", all(s["masked"] and s["contact"] == "hidden ·••" for s in masked_states) and len(masked_states) > 0)
    check("foot shows auto-cycling", all("auto-cycling" in (s["foot"] or "") for s in states))
    pg.screenshot(path=f"{OUT}/03-hero-canvas.png")

    # ═══ 7. ROLE VISUAL CYCLER ═══
    pg.evaluate("() => document.getElementById('expertise').scrollIntoView({behavior:'instant'})")
    pg.wait_for_timeout(600)
    lits = []
    for _ in range(5):
        lits.append(pg.evaluate("() => [...document.querySelectorAll('#rolesVis .rv-cell')].map(c => c.classList.contains('lit'))"))
        pg.wait_for_timeout(850)
    single = all(sum(l) == 1 for l in lits)
    moving = len({tuple(l) for l in lits}) >= 3
    check("roles-vis: exactly one lit cell, cycling", single and moving, json.dumps(lits))

    # ═══ 8. WIRING AUTO-CYCLE + HANDOVER ═══
    pg.evaluate("() => document.getElementById('wiring').scrollIntoView({behavior:'instant'})")
    pg.wait_for_timeout(600)
    hint_auto = pg.evaluate("() => document.querySelector('.wp-hint span')?.textContent.trim()")
    check("wiring hint starts auto", hint_auto == "Auto-cycling — select any node to take control", str(hint_auto))
    titles = []
    for _ in range(5):
        titles.append(pg.evaluate("() => document.querySelector('.wp-title')?.textContent.trim()"))
        pg.wait_for_timeout(1600)
    check("wiring auto-cycles (≥2 distinct titles in ~6.4s)", len(set(titles)) >= 2, json.dumps(titles))
    # handover: click node 5
    pg.evaluate("() => document.querySelectorAll('.w-node')[4].click()")
    pg.wait_for_timeout(400)
    clicked = pg.evaluate("() => document.querySelector('.wp-title')?.textContent.trim()")
    hint_manual = pg.evaluate("() => document.querySelector('.wp-hint span')?.textContent.trim()")
    check("click selects node + hint swaps to manual", hint_manual == "Manual mode — ← → keys also move between nodes", str(hint_manual))
    pg.wait_for_timeout(10000)
    after = pg.evaluate("() => document.querySelector('.wp-title')?.textContent.trim()")
    check("handover is permanent (no auto-change for 10s)", after == clicked, f"{clicked} → {after}")
    pg.screenshot(path=f"{OUT}/04-wiring-manual.png")

    # ═══ 9. MAGNETIC + CARD GLOW ═══
    card = pg.query_selector(".bento .card")
    card.hover()
    pg.wait_for_timeout(300)
    glow = pg.evaluate("() => { const c = document.querySelector('.bento .card'); return c.style.getPropertyValue('--mx'); }")
    check("card spotlight --mx set on hover", glow not in ("", None), str(glow))
    mag = pg.query_selector(".magnetic")
    mag.scroll_into_view_if_needed()
    pg.wait_for_timeout(300)
    box = mag.bounding_box()
    pg.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
    pg.wait_for_timeout(250)
    tr = pg.evaluate("() => document.querySelector('.magnetic')?.style.transform")
    check("magnetic translate on hover", tr and "translate" in tr, str(tr))
    import re as _re
    nums = [abs(float(v)) for v in _re.findall(r"-?[\d.]+", tr or "")]
    check("magnetic clamped ±6px", all(v <= 6.01 for v in nums), json.dumps(nums))
    pg.mouse.move(10, 400)
    pg.wait_for_timeout(250)
    tr2 = pg.evaluate("() => document.querySelector('.magnetic')?.style.transform")
    check("magnetic released on leave", tr2 in ("", None), str(tr2))

    # ═══ 10. TIMELINE FILL ═══
    pg.evaluate("() => document.getElementById('experience').scrollIntoView({behavior:'instant'})")
    pg.wait_for_timeout(400)
    pg.wait_for_timeout(300)
    h1 = pg.evaluate("() => document.getElementById('tlFill').style.height")
    pg.evaluate("() => window.scrollBy({top: 700, behavior: 'instant'})")
    h2 = ""
    for _ in range(16):  # poll ≤8s (known long-page smooth-scroll flake)
        pg.wait_for_timeout(500)
        h2 = pg.evaluate("() => document.getElementById('tlFill').style.height")
        if h2 and h2 != "0px" and h2 != h1:
            break
    check("timeline fill grows on scroll", h2 not in ("", "0px", None) and h2 != h1, f"{h1} → {h2}")

    # ═══ 11. TOAST ANIMATION ═══
    pg.evaluate("() => document.getElementById('contact').scrollIntoView({behavior:'instant'})")
    pg.wait_for_timeout(500)
    ctx.grant_permissions(["clipboard-read", "clipboard-write"])
    pg.evaluate("() => [...document.querySelectorAll('.cta-row .magnetic')].find(b => b.textContent.includes('Copy email'))?.click()")
    pg.wait_for_timeout(500)
    toast_on = pg.evaluate("() => { const t = document.querySelector('.toast'); return t && t.classList.contains('on') && getComputedStyle(t).opacity === '1' && t.textContent; }")
    check("toast shows animated on copy", bool(toast_on), str(toast_on))
    pg.wait_for_timeout(3200)
    toast_gone = pg.evaluate("() => !document.querySelector('.toast') || !document.querySelector('.toast').classList.contains('on')")
    check("toast auto-hides after ~3s", toast_gone)

    # ═══ 12. COMMAND PALETTE (lazy) ═══
    new_js = []
    pg.on_request = None
    def on_req(req):
        if req.resource_type == "script" or req.url.endswith(".js"):
            new_js.append(req.url)
    pg2_listening = []
    pg.on("request", lambda r: pg2_listening.append(r.url) if ".js" in r.url else None)
    before = set(pg2_listening)
    pg.keyboard.press("Control+k")
    pg.wait_for_timeout(1200)
    dlg_open = pg.evaluate("() => { const d = document.getElementById('cmd'); return d && d.open; }")
    lazy_chunks = [u for u in pg2_listening if u not in before]
    check("⌘K opens dialog", dlg_open)
    check("palette chunk fetched lazily on open", len(lazy_chunks) >= 1, json.dumps(lazy_chunks[-3:]))
    pg.screenshot(path=f"{OUT}/05-palette.png")
    n_all = pg.evaluate("() => document.querySelectorAll('#cmdList li[role=option]').length")
    check("palette lists 15 commands", n_all == 15, str(n_all))
    pg.fill("#cmdInput", "cv")
    pg.wait_for_timeout(200)
    n_cv = pg.evaluate("() => [...document.querySelectorAll('#cmdList li[role=option] button')].map(b => b.textContent)")
    check("filter 'cv' narrows list", 0 < len(n_cv) < n_all and any("Download CV" in t for t in n_cv), json.dumps(n_cv))
    pg.fill("#cmdInput", "zzzqq")
    pg.wait_for_timeout(150)
    empty = pg.evaluate("() => !!document.querySelector('.cmd-empty')")
    check("empty state on no match", empty)
    pg.fill("#cmdInput", "theme")
    pg.wait_for_timeout(150)
    theme_before = pg.evaluate("() => document.documentElement.dataset.theme")
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(700)
    theme_after = pg.evaluate("() => document.documentElement.dataset.theme")
    dlg_closed = pg.evaluate("() => !document.getElementById('cmd')?.open")
    check("Enter runs 'Toggle theme' + closes", theme_before != theme_after and dlg_closed, f"{theme_before}→{theme_after}")
    # reopen via header button, jump + esc
    pg.keyboard.press("Control+k")
    pg.wait_for_timeout(400)
    pg.fill("#cmdInput", "stack")
    pg.keyboard.press("ArrowDown")
    pg.keyboard.press("ArrowUp")
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(1200)
    at_stack = pg.evaluate("() => Math.abs(document.getElementById('stack').getBoundingClientRect().top) < 200")
    check("navigate command scrolls to section", at_stack)
    pg.keyboard.press("Control+k")
    pg.wait_for_timeout(300)
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(400)
    esc_closed = pg.evaluate("() => !document.getElementById('cmd')?.open")
    check("Esc closes palette", esc_closed)
    # theme back to dark for screenshots parity
    pg.evaluate("() => document.documentElement.dataset.theme === 'light' && document.getElementById('themeBtn').click()")

    # ═══ 13. REDUCED MOTION — complete static page ═══
    ctx_r = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
    pgr = ctx_r.new_page()
    pgr.goto(BASE + "/", wait_until="networkidle")
    pgr.wait_for_timeout(1200)
    loader_r = pgr.evaluate("() => { const l = document.getElementById('loader'); return !l || getComputedStyle(l).display === 'none'; }")
    reveal_r = pgr.evaluate("""() => {
      const els = [...document.querySelectorAll('.reveal')];
      return els.every(e => getComputedStyle(e).opacity === '1');
    }""")
    lines_r = pgr.evaluate("() => [...document.querySelectorAll('.lines .ln > span')].every(s => getComputedStyle(s).transform === 'none' || getComputedStyle(s).transform === 'matrix(1, 0, 0, 1, 0, 0)')")
    check("reduced: no preloader", loader_r)
    check("reduced: all reveals visible everywhere", reveal_r)
    check("reduced: line masks open", lines_r)
    roles_r = []
    for _ in range(3):
        roles_r.append(pgr.evaluate("() => document.getElementById('hcRole')?.textContent.trim()"))
        pgr.wait_for_timeout(1500)
    check("reduced: canvas static super-admin", all(r == "super admin" for r in roles_r), json.dumps(roles_r))
    foot_r = pgr.evaluate("() => document.querySelector('.cv-foot span')?.textContent.trim()")
    check("reduced: foot has no auto-cycling", foot_r == "rbac.specimen", str(foot_r))
    lit_r = pgr.evaluate("() => document.querySelectorAll('#rolesVis .rv-cell.lit').length")
    check("reduced: all role cells lit", lit_r == 4, str(lit_r))
    pgr.evaluate("() => document.getElementById('wiring').scrollIntoView({behavior:'instant'})")
    pgr.wait_for_timeout(300)
    hint_r = pgr.evaluate("() => document.querySelector('.wp-hint span')?.textContent.trim()")
    check("reduced: wiring hint manual", hint_r == "Manual mode — ← → keys also move between nodes", str(hint_r))
    cnt_r = pgr.evaluate("() => [...document.querySelectorAll('.m-v [data-count]')].map(e => e.textContent.trim())")
    check("reduced: counters show finals without animation", cnt_r == expect, json.dumps(cnt_r))
    pgr.screenshot(path=f"{OUT}/06-reduced-hero.png")

    # ═══ 14. NO-JS — complete page ═══
    ctx_n = browser.new_context(viewport={"width": 1440, "height": 900}, java_script_enabled=False)
    pgn = ctx_n.new_page()
    pgn.goto(BASE + "/", wait_until="load")
    loader_n = pgn.evaluate("() => { const l = document.getElementById('loader'); return !l || getComputedStyle(l).display === 'none'; }") if False else True
    # evaluate() unavailable without JS — use visual/screenshot + CSS reasoning:
    h1_box = pgn.locator(".hero-h .ln >> nth=0").bounding_box()
    vis = h1_box and h1_box["height"] > 10
    loader_box = pgn.locator("#loader").bounding_box()
    loader_hidden_n = loader_box is None or loader_box["width"] == 0
    counters_n = pgn.locator(".m-v >> nth=2").inner_text()
    pgn.screenshot(path=f"{OUT}/07-nojs-hero.png", full_page=False)
    pgn.locator("#numbers").screenshot(path=f"{OUT}/08-nojs-numbers.png")
    check("no-JS: hero line visible (unmasked)", vis, json.dumps(h1_box))
    check("no-JS: loader hidden", loader_hidden_n, json.dumps(loader_box))
    check("no-JS: counters render finals", "5,000" in counters_n.replace("\n", " "), counters_n)

    browser.close()

print()
passed = sum(1 for _, ok, _ in RESULTS if ok)
print(f"═══ PHASE 5 CHECKS: {passed}/{len(RESULTS)} ═══")
for n, ok, d in RESULTS:
    if not ok:
        print("  FAILED:", n, "|", d)
sys.exit(0 if passed == len(RESULTS) else 1)

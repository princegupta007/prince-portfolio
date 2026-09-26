/**
 * Phase 07 · keyboard journey + focus-visible + motion-safety spec.
 * Runnable: `pnpm test:e2e -- keyboard` (tsx, no test-runner dependency).
 */
import { chromium, type Page } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const OUT = path.join(
  "agent/artifacts",
  `${new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Kolkata" })}-phase-07`,
  "focus-grid",
);

let pass = 0;
const fails: string[] = [];
function check(name: string, ok: boolean, detail = "") {
  if (ok) pass++;
  else fails.push(`${name}${detail ? " — " + detail : ""}`);
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

const active = (pg: Page) =>
  pg.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    if (!a) return "none";
    const cls = typeof a.className === "string" ? a.className : a.tagName;
    return (
      (cls || a.tagName) +
      "|" +
      (a.getAttribute("aria-label") || a.textContent?.trim().slice(0, 24) || "")
    );
  });

async function tabStops(pg: Page, n: number) {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    await pg.keyboard.press("Tab");
    await pg.waitForTimeout(60);
    out.push(await active(pg));
  }
  return out;
}

export async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  // ---------- desktop journey ----------
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await pg.goto(BASE, { waitUntil: "networkidle" });
  await pg.waitForTimeout(2200);

  // K1 skip link first
  await pg.keyboard.press("Tab");
  const first = await active(pg);
  check("K1 skip link is first tab stop", first.includes("skip"), first);

  // K2 header order
  const stops = await tabStops(pg, 12);
  const seq = stops.join(" → ");
  const iBrand = stops.findIndex((s) => s.includes("brand"));
  const iNav = stops.findIndex((s) => s.includes("nav") || s.includes("Numbers") || s.includes("In numbers"));
  const iSearch = stops.findIndex((s) => s.includes("kbd-btn") || s.toLowerCase().includes("search"));
  const iTheme = stops.findIndex((s) => s.toLowerCase().includes("theme") || s.includes("icon-btn"));
  const iCv = stops.findIndex((s) => s.toLowerCase().includes("cv") || s.toLowerCase().includes("download"));
  check(
    "K2 header order brand→nav→search→theme→CV",
    iBrand >= 0 && iBrand < iNav && iNav < iSearch && iSearch < iTheme && iTheme < iCv,
    seq.slice(0, 220),
  );

  // K3 deep tab reach: role tabs, wiring nodes, contact rows, back-to-top
  const deep = await tabStops(pg, 90);
  const all = deep.join(" | ");
  check("K3 role tabs reachable", all.includes("role-tab"));
  check("K3 wiring nodes reachable", /w-node|wire/.test(all));
  check("K3 contact copy rows reachable", all.includes("crow"));
  check("K3 back-to-top reachable", /top/i.test(all));

  // K4 palette trap + restore
  await pg.evaluate("() => window.scrollTo(0, 0)");
  await pg.click(".kbd-btn");
  await pg.waitForTimeout(600);
  const inPalette = await pg.evaluate(
    () => !!document.activeElement?.closest("dialog.cmd, .cmd"),
  );
  check("K4 palette takes focus on open (no focus loss)", inPalette);
  let trapped = true;
  for (let i = 0; i < 12; i++) {
    await pg.keyboard.press("Tab");
    const inside = await pg.evaluate(
      () => !!document.activeElement?.closest("dialog.cmd, .cmd"),
    );
    if (!inside) trapped = false;
  }
  check("K4 palette focus trap holds over 12 tabs", trapped);
  await pg.keyboard.press("Escape");
  await pg.waitForTimeout(400);
  const restored = await active(pg);
  check("K4 Esc closes palette & restores focus", restored.includes("kbd-btn"), restored);

  // K6 wiring arrows
  const wired = await pg.evaluate(async () => {
    const nodes = [...document.querySelectorAll<HTMLElement>('.w-node, [class*=w-node]')];
    const n0 = nodes[0];
    if (!nodes.length || !n0) return null;
    n0.focus();
    const before = nodes.map(n => n.getAttribute('aria-pressed')).join(',');
    n0.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));
    await new Promise(r => setTimeout(r, 400));
    const after = nodes.map(n => n.getAttribute('aria-pressed')).join(',');
    return { before, after };
  });
  check("K6 wiring ←/→ changes selected node", wired !== null && wired.before !== wired.after, JSON.stringify(wired));

  // K7 exhibit tabs Enter (real key activation)
  await pg.locator(".role-tab").nth(1).scrollIntoViewIfNeeded();
  await pg.evaluate(() => {
    document.querySelectorAll<HTMLElement>(".role-tab")[1]?.focus();
  });
  const liveBefore = await pg.evaluate(
    () => document.querySelector(".sr-only[aria-live]")?.textContent ?? "",
  );
  await pg.keyboard.press("Enter");
  await pg.waitForTimeout(800);
  const k7 = await pg.evaluate(() => {
    const tabs = [...document.querySelectorAll(".role-tab")];
    return {
      pressed: tabs[1]?.getAttribute("aria-pressed") ?? tabs[1]?.getAttribute("aria-selected"),
      live: document.querySelector(".sr-only[aria-live]")?.textContent ?? "",
    };
  });
  check(
    "K7 exhibit role tabs activate via Enter",
    k7.pressed === "true" && k7.live !== liveBefore && k7.live.length > 0,
    JSON.stringify(k7).slice(0, 140),
  );

  // K8 back-to-top
  await pg.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pg.waitForTimeout(300);
  const topped = await pg.evaluate(async () => {
    const btn = [...document.querySelectorAll<HTMLElement>('button, a')].find(e => /top/i.test(e.getAttribute('aria-label') || ''));
    if (!btn) return null;
    btn.focus();
    btn.click();
    await new Promise(r => setTimeout(r, 2600));
    return window.scrollY;
  });
  check("K8 back-to-top returns to top", topped !== null && topped < 40, `scrollY=${topped}`);

  // K10 focus-ring evidence grid (both themes)
  for (const theme of ["dark", "light"]) {
    await pg.evaluate((t) => {
      document.documentElement.dataset.theme = t;
    }, theme);
    await pg.waitForTimeout(300);
    const sels = [".skip", ".brand", ".nav ul a", ".kbd-btn", ".role-tab", ".crow", ".btn", "[aria-label*='top' i]"];
    for (const sel of sels) {
      const el = pg.locator(sel).first();
      if ((await el.count()) === 0) continue;
      await el.scrollIntoViewIfNeeded().catch(() => {});
      await pg.evaluate((s) => {
        const e = document.querySelector(s) as HTMLElement;
        e?.focus();
      }, sel);
      await pg.waitForTimeout(250);
      const ring = await pg.evaluate(
        (s) => {
          const e = document.querySelector(s) as HTMLElement;
          const cs = getComputedStyle(e);
          return { outline: cs.outlineWidth + " " + cs.outlineStyle, shadow: cs.boxShadow !== "none" };
        },
        sel,
      );
      const ok = (ring.outline !== "0px none" && ring.outline.includes("solid")) || ring.shadow;
      check(`K10 focus ring visible ${theme} ${sel}`, ok, JSON.stringify(ring));
      const box = await el.boundingBox();
      if (box) {
        await pg.screenshot({
          path: path.join(OUT, `${theme}-${sel.replace(/\W+/g, "-")}.png`),
          clip: {
            x: Math.max(0, box.x - 8),
            y: Math.max(0, box.y - 8),
            width: Math.min(1280, box.width + 16),
            height: Math.min(900, box.height + 16),
          },
        });
      }
    }
  }
  await pg.close();

  // ---------- K5 mobile menu esc + restore ----------
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(BASE, { waitUntil: "networkidle" });
  await m.waitForTimeout(2200);
  await m.click(".burger");
  await m.waitForTimeout(700);
  const menuFocus = await m.evaluate(
    () => !!document.activeElement?.closest("#mobile-menu"),
  );
  check("K5 menu sheet takes focus inside", menuFocus);
  await m.keyboard.press("Escape");
  await m.waitForTimeout(600);
  const mRestored = await active(m);
  check("K5 Esc closes menu & restores burger focus", mRestored.includes("burger"), mRestored);
  await m.close();

  // ---------- K11 motion safety ----------
  const rm = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  await rm.goto(BASE, { waitUntil: "networkidle" });
  await rm.waitForTimeout(1500);
  const rmState = await rm.evaluate(() => {
    const depth = document.querySelector('[data-depth]');
    const mqTrack = [...document.querySelectorAll('.mq, .mq *')].find(el => getComputedStyle(el).animationName !== 'none');
    const mqAnim = mqTrack ? getComputedStyle(mqTrack).animationPlayState : 'none';
    const pre = document.querySelector('.pre, #preloader, [class*=preloader]');
    return {
      depthTransform: depth ? getComputedStyle(depth).transform : 'none',
      mqAnim,
      preloaderGone: !pre || getComputedStyle(pre).display === 'none' || getComputedStyle(pre).visibility === 'hidden',
    };
  });
  check("K11 reduced-motion: parallax depth inert", rmState.depthTransform === "none" || rmState.depthTransform === "matrix(1, 0, 0, 1, 0, 0)", rmState.depthTransform);
  check("K11 reduced-motion: marquee paused", rmState.mqAnim === "paused" || rmState.mqAnim === "none", rmState.mqAnim);
  check("K11 reduced-motion: preloader absent", rmState.preloaderGone);
  await rm.close();

  const coarse = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  await coarse.goto(BASE, { waitUntil: "networkidle" });
  await coarse.waitForTimeout(1500);
  const coarseTilt = await coarse.evaluate(async () => {
    const depth = document.querySelector('[data-depth]');
    if (!depth) return 'missing';
    window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 30, gamma: 30 }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 300, clientY: 300, bubbles: true }));
    await new Promise(r => setTimeout(r, 400));
    return getComputedStyle(depth).transform;
  });
  check("K11 coarse pointer: tilt/parallax inert", coarseTilt === "none" || coarseTilt === "matrix(1, 0, 0, 1, 0, 0)" || coarseTilt === "missing", coarseTilt);
  await coarse.close();

  await browser.close();
  console.log(`\n[keyboard-spec] ${pass} passed, ${fails.length} failed`);
  for (const f of fails) console.log("  ✗", f);
  process.exit(fails.length ? 1 : 0);
}

if (process.argv[1]?.endsWith("keyboard.spec.ts")) main();

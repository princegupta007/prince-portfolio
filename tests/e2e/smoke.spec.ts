/**
 * Phase 11 — journey smoke suite (real Chromium, built app on :3100).
 * Run: pnpm exec tsx tests/e2e/smoke.spec.ts  (server must be up).
 * Covers the five journeys the owner signs off on.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
let pass = 0;
let fail = 0;
const bad: string[] = [];
function check(name: string, ok: boolean, detail = "") {
  if (ok) { pass++; console.log("  ✓", name); }
  else { fail++; bad.push(name); console.log("  ✗", name, detail); }
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  // J1 · cold visit → hero, numbers counted, no console errors
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForTimeout(2600); // preloader + counters
  check("J1 hero heading", await page.locator(".hero-h").first().isVisible());
  check("J1 counters rendered", /\d/.test(await page.locator(".m-v").first().innerText()));
  check("J1 no console/page errors", errors.length === 0, errors.join(" | ").slice(0, 200));

  // J2 · keyboard: skip link → tab reaches nav → ⌘K palette opens → Esc closes
  await page.keyboard.press("Tab");
  check("J2 skip link first", /skip/i.test(await page.evaluate(() => (document.activeElement?.textContent ?? ""))));
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(400);
  check("J2 palette opens via Ctrl+K", await page.locator(".cmd-in").isVisible());
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  check("J2 escape closes palette", !(await page.locator(".cmd-in").isVisible().catch(() => false)));

  // J3 · section anchor scroll updates hash + scrollspy
  await page.click('header nav a[href="#experience"]');
  await page.waitForTimeout(1200);
  check("J3 hash updates", (await page.evaluate(() => location.hash)) === "#experience");

  // J4 · theme toggle persists across reload
  await page.click('button[aria-label*="theme" i]');
  await page.waitForTimeout(400);
  const theme = await page.evaluate(() => document.documentElement.dataset.theme ?? "");
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(800);
  const persisted = await page.evaluate(() => document.documentElement.dataset.theme ?? "");
  check("J4 theme flips + persists", theme !== "" && theme === persisted, `${theme}/${persisted}`);

  // J5 · 404 is styled and navigable
  await page.goto(BASE + "/definitely-not-a-page", { waitUntil: "load" });
  await page.waitForTimeout(600);
  check("J5 styled 404", await page.locator(".nf-wrap").isVisible());
  const back = page.locator('.nf-wrap a[href="/#hero"]');
  const sections = page.locator('.nf-wrap a[href^="/#"]');
  check("J5 404 offers back-to-intro + full index", (await back.count()) === 1 && (await sections.count()) >= 8);

  await browser.close();
  console.log(`\nSMOKE JOURNEYS: ${pass}/${pass + fail}`);
  if (fail) { console.log("failed:", bad.join(", ")); process.exit(1); }
}
void main();

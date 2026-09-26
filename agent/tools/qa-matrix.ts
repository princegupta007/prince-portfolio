/** Phase 11 — QA matrix: 3 breakpoints × 2 themes full-page shots for owner review. */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const OUT = process.env.OUT ?? "agent/artifacts/2026-09-26-phase-11";
const VPS: [string, number, number][] = [["1440", 1440, 900], ["834", 834, 1112], ["390", 390, 844]];

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const theme of ["dark", "light"]) {
    for (const [name, w, h] of VPS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      await page.addInitScript((t) => { document.cookie = `pg-theme=${t}; path=/`; }, theme);
      await page.goto(BASE + "/", { waitUntil: "load" });
      await page.waitForTimeout(2600);
      await page.screenshot({ path: `${OUT}/qa-${theme}-${name}.png`, fullPage: true });
      await ctx.close();
      console.log("shot", theme, name);
    }
  }
  await browser.close();
}
void main();

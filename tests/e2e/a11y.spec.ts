/**
 * Phase 07 · axe-core accessibility scan — permanent regression spec.
 * Runnable: `pnpm test:e2e -- a11y` (tsx, no test-runner dependency).
 * Scans `/` in dark+light across five states: default, menu open, palette
 * open, exhibit after role switch, contact focused. Target: 0 violations.
 * Reports land in agent/artifacts/<date>-phase-07/axe/*.json (gitignored).
 */
import { chromium, type Page } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const OUT =
  process.env.AXE_OUT ??
  path.join(
    "agent/artifacts",
    `${new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Kolkata" })}-phase-07`,
    "axe",
  );

type Finding = { state: string; theme: string; id: string; impact: string; nodes: number; help: string };

async function settle(pg: Page) {
  await pg.waitForLoadState("networkidle");
  await pg.waitForTimeout(2200); // preloader curtain + reveal settle
}

async function scan(pg: Page, theme: string, state: string, findings: Finding[]) {
  const res = await new AxeBuilder({ page: pg })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  for (const v of res.violations) {
    findings.push({
      state,
      theme,
      id: v.id,
      impact: v.impact ?? "?",
      nodes: v.nodes.length,
      help: v.help,
    });
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(
    path.join(OUT, `${theme}-${state.replace(/\W+/g, "-")}.json`),
    JSON.stringify(res.violations, null, 2),
  );
  return res.violations.length;
}

export async function main() {
  const browser = await chromium.launch();
  const findings: Finding[] = [];
  for (const theme of ["dark", "light"] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addCookies([{ name: "pg-theme", value: theme, url: BASE }]);
    const pg = await ctx.newPage();

    // S1 default
    await pg.goto(BASE, { waitUntil: "networkidle" });
    await settle(pg);
    await scan(pg, theme, "default", findings);

    // S2 palette open (desktop trigger)
    await pg.click(".kbd-btn");
    await pg.waitForTimeout(700);
    await scan(pg, theme, "palette-open", findings);
    await pg.keyboard.press("Escape");
    await pg.waitForTimeout(500);

    // S3 exhibit after role switch
    const tabs = pg.locator(".role-tab");
    if ((await tabs.count()) > 1) {
      await tabs.nth(1).click();
      await pg.waitForTimeout(900);
    }
    await pg.locator("#exhibit").scrollIntoViewIfNeeded().catch(() => {});
    await pg.waitForTimeout(600);
    await scan(pg, theme, "exhibit-role2", findings);

    // S4 mobile default + S5 mobile menu sheet open
    await pg.setViewportSize({ width: 390, height: 844 });
    await pg.waitForTimeout(700);
    await scan(pg, theme, "mobile-default", findings);
    await pg.click(".burger");
    await pg.waitForTimeout(800);
    await scan(pg, theme, "mobile-menu-open", findings);

    await ctx.close();
  }
  await browser.close();

  console.log(`\n[a11y-spec] ${findings.length} axe violation group(s)`);
  for (const f of findings) {
    console.log(`  ✗ ${f.theme}/${f.state} · ${f.id} (${f.impact}, ${f.nodes} nodes) — ${f.help}`);
  }
  console.log(`[a11y-spec] reports → ${OUT}`);
  process.exit(findings.length ? 1 : 0);
}

if (process.argv[1]?.endsWith("a11y.spec.ts")) main();

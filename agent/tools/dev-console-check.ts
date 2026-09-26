/**
 * fix(console-hydration) — dev-mode console gate.
 * Loads the DEV server and fails on any console error/pageerror, with explicit
 * asserts for the two regressions fixed here: React "eval() is not supported"
 * (strict CSP in dev) and hydration-mismatch warnings.
 * Run: pnpm agent:dev-console   (needs `next dev` on :3200)
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3200";

async function main() {
  const msgs: [string, string][] = [];
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pg = await ctx.newPage();
  pg.on("console", (m) => msgs.push([m.type(), m.text()]));
  pg.on("pageerror", (e) => msgs.push(["pageerror", String(e)]));
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await pg.goto(BASE + "/", { waitUntil: "load" });
  await pg.waitForTimeout(6000);
  for (let i = 0; i < 4; i++) { await pg.mouse.wheel(0, 1400); await pg.waitForTimeout(600); }
  await browser.close();

  // sandbox dev servers may lack the HMR websocket; that transport error is
  // environmental, not an app defect — everything else must be clean.
  const real = msgs.filter(
    ([, t]) => !/WebSocket connection to|ERR_INVALID_HTTP_RESPONSE|_next\/hmr/.test(t),
  );
  const evalErr = real.filter(([, t]) => /eval\(\) is not supported/.test(t));
  const hydErr = real.filter(([, t]) => /hydrat/i.test(t));
  const errors = real.filter(([type]) => type === "error" || type === "pageerror");

  console.log(`[dev-console] eval errors: ${evalErr.length}, hydration: ${hydErr.length}, total errors: ${errors.length}`);
  errors.slice(0, 5).forEach(([type, t]) => console.log(`  [${type}] ${t.slice(0, 200)}`));
  if (evalErr.length || hydErr.length || errors.length) process.exit(1);
  console.log("[dev-console] clean");
}
void main();

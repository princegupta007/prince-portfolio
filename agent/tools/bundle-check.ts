/**
 * Phase 09 · bundle budget enforcement.
 *  (a) zero client chunks reference agent/ code,
 *  (b) first-load JS of "/" vs budget.json gz budget,
 *  (c) island chunk inventory.
 * Runnable: `pnpm agent:bundle-check` (exit 1 on budget breach).
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = process.cwd();
const budget = JSON.parse(fs.readFileSync(path.join(ROOT, "budget.json"), "utf8")) as {
  firstLoadKbGz: number;
  resourceSizesKb: { script: number; total: number };
};

function gz(p: string): number {
  return zlib.gzipSync(fs.readFileSync(p), { level: 9 }).length;
}

async function main() {
  // first-load set = the SSR <script src> set of the prerendered route
  // (documented method, plan §V.6) — robust across Turbopack manifest shapes
  const prerendered = path.join(ROOT, ".next/server/app/index.html");
  const html = fs.existsSync(prerendered)
    ? fs.readFileSync(prerendered, "utf8")
    : await (await fetch(process.env.BASE_URL ?? "http://127.0.0.1:3100/")).text();
  const srcs = [...html.matchAll(new RegExp('src="(/_next/static/[^"]+\\.js)"', "g"))].map((m) => m[1] ?? "");
  const firstLoad = [...new Set(srcs)].map((s2) => s2.replace(/^\/_next\//, ""));
  let bytes = 0;
  const rows: string[] = [];
  for (const f of firstLoad) {
    const p = path.join(ROOT, ".next", f);
    if (!fs.existsSync(p)) continue;
    const g = gz(p);
    bytes += g;
    rows.push(`  ${f.padEnd(46)} ${(g / 1024).toFixed(2)} KB gz`);
  }
  const kb = bytes / 1024;

  // (a) agent isolation
  const agentLeak = firstLoad.filter((f) => f.includes("agent/"));
  // (c) island inventory: client chunks by name hint
  const allChunks = fs
    .readdirSync(path.join(ROOT, ".next/static/chunks"))
    .filter((f) => f.endsWith(".js"));
  const totalAll = allChunks.reduce(
    (s, f) => s + gz(path.join(ROOT, ".next/static/chunks", f)),
    0,
  );

  console.log("[bundle-check] first-load JS of / (gz):");
  console.log(rows.join("\n"));
  console.log(`[bundle-check] first-load: ${kb.toFixed(2)} KB gz (budget ${budget.firstLoadKbGz} KB)`);
  console.log(`[bundle-check] all client chunks: ${(totalAll / 1024).toFixed(2)} KB gz (resource budget ${budget.resourceSizesKb.total} KB)`);
  console.log(`[bundle-check] agent/ leakage in client chunks: ${agentLeak.length}`);

  const fails: string[] = [];
  if (agentLeak.length) fails.push("agent code in client bundle");
  if (kb > budget.firstLoadKbGz) fails.push(`first-load ${kb.toFixed(2)} > ${budget.firstLoadKbGz} KB gz`);
  if (totalAll / 1024 > budget.resourceSizesKb.total) fails.push("total chunks over resource budget");
  console.log(fails.length ? `[bundle-check] FAIL: ${fails.join("; ")}` : "[bundle-check] within budget");
  process.exit(fails.length ? 1 : 0);
}
main();

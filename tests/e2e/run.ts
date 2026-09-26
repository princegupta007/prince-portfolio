/**
 * e2e runner: `pnpm test:e2e [--] [filter]` — imports every tests/e2e/*.spec.ts
 * whose filename matches the filter (default: all). Specs are plain tsx
 * scripts exporting `main()`; non-zero exit on failure (no test-runner dep).
 */
import fs from "node:fs";
import path from "node:path";

async function main() {
  const filter = process.argv.slice(2).filter((a) => a !== "--")[0] ?? "";
  const dir = path.dirname(new URL(import.meta.url).pathname);
  const specs = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".spec.ts") && (!filter || f.includes(filter)))
    .sort();

  if (!specs.length) {
    console.error(`[e2e] no spec matches "${filter}"`);
    process.exit(1);
  }

  let failed = 0;
  for (const spec of specs) {
    console.log(`\n═══ e2e: ${spec} ═══`);
    const mod = (await import(path.join(dir, spec))) as { main?: () => Promise<void> };
    if (typeof mod.main === "function") {
      try {
        await mod.main();
      } catch (e) {
        failed++;
        console.error(`[e2e] ${spec} threw:`, e);
      }
    }
  }
  process.exit(failed ? 1 : 0);
}

main();

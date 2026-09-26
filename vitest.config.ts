import { defineConfig } from "vitest/config";

/**
 * Unit tests only. tests/e2e/*.spec.ts are Playwright-driven tsx scripts run
 * via `pnpm test:e2e` — they are NOT vitest suites (phase-07).
 */
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/e2e/**", "node_modules/**"],
  },
});

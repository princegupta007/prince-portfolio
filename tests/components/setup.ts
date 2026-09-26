/**
 * Phase 11 — shared jsdom setup for component tests.
 * Stubs the browser APIs the islands rely on but jsdom lacks.
 * Node-environment suites import nothing from here (guarded no-ops).
 */
import { vi } from "vitest";

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof window !== "undefined") {
  globalThis.IntersectionObserver = IO as unknown as typeof IntersectionObserver;

  if (!window.matchMedia) {
    window.matchMedia = ((q: string) => ({
      matches: false,
      media: q,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      onchange: null,
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }
}

if (typeof navigator !== "undefined" && !navigator.clipboard) {
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
}

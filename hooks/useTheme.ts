import { useCallback, useSyncExternalStore } from "react";
import { THEME_COOKIE } from "@/lib/constants";

export type Theme = "dark" | "light";

/**
 * Theme = external store (the <html data-theme> attribute + cookie).
 * useSyncExternalStore keeps SSR/hydration consistent: the server snapshot
 * comes from the cookie (passed as `initial` by the server Header), the client
 * snapshot reads the live DOM attribute. Deviation D1.
 */
const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function useTheme(initial: Theme = "dark") {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => initial);

  const toggle = useCallback((): Theme => {
    const applied: Theme = getSnapshot() === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = applied;
    document.cookie = `${THEME_COOKIE}=${applied};path=/;max-age=31536000;SameSite=Lax`;
    listeners.forEach((l) => l());
    return applied;
  }, []);

  return { theme, toggle };
}

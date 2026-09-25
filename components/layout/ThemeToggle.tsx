"use client";

import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";
import { useTheme } from "@/hooks/useTheme";
import type { Theme } from "@/hooks/useTheme";

/** Sun/moon toggle — cookie-persisted, toast-announced (prototype copy). */
export function ThemeToggle({ initial }: { initial: Theme }) {
  const { theme, toggle } = useTheme(initial);
  const { show } = useToast();

  return (
    <button
      type="button"
      className="icon-btn"
      aria-label="Switch colour theme"
      title="Switch theme"
      onClick={() => {
        const next = toggle();
        show(next === "dark" ? "Dark theme · engineering hours" : "Light theme · paper mode");
      }}
    >
      <Icon name={theme === "dark" ? "moon" : "sun"} size={16} />
    </button>
  );
}

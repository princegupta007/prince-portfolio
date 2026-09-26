import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ToastProvider } from "@/components/ui/Toast";
import { THEME_COOKIE } from "@/lib/constants";

describe("ThemeToggle", () => {
  it("flips theme, persists the cookie and announces it", () => {
    render(
      <ToastProvider>
        <ThemeToggle initial="dark" />
      </ToastProvider>,
    );
    const btn = screen.getByRole("button", { name: /theme/i });
    fireEvent.click(btn);
    expect(document.cookie).toContain(`${THEME_COOKIE}=light`);
    fireEvent.click(btn);
    expect(document.cookie).toContain(`${THEME_COOKIE}=dark`);
  });
});

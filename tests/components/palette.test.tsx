// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CommandPalette } from "@/components/interactive/CommandPalette";

describe("CommandPalette", () => {
  it("lists commands when open and filters by query", () => {
    render(<CommandPalette open onClose={() => {}} />);
    const input = screen.getByRole("combobox", { name: /search commands/i }) as HTMLInputElement
      ?? screen.getByLabelText(/search commands/i);
    const options = () => screen.getAllByRole("option").filter((o) => o.getAttribute("aria-disabled") !== "true");
    expect(options().length).toBeGreaterThan(5);
    fireEvent.change(input, { target: { value: "cv" } });
    const filtered = options();
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.some((o) => /cv/i.test(o.textContent ?? ""))).toBe(true);
  });

  it("escape closes", () => {
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} />);
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("renders nothing actionable when closed", () => {
    render(<CommandPalette open={false} onClose={() => {}} />);
    expect(screen.queryByLabelText(/search commands/i)).toBeNull();
  });
});

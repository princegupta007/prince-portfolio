import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CopyButton } from "@/components/interactive/CopyButton";
import { ToastProvider } from "@/components/ui/Toast";

const wrap = (ui: React.ReactElement) => render(<ToastProvider>{ui}</ToastProvider>);

describe("CopyButton", () => {
  it("copies via clipboard API and confirms with a toast", async () => {
    const write = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: write } });
    wrap(<CopyButton value="princegupta98299@gmail.com">copy</CopyButton>);
    fireEvent.click(screen.getByRole("button", { name: /copy/i }));
    await vi.waitFor(() => expect(write).toHaveBeenCalledWith("princegupta98299@gmail.com"));
    expect(await screen.findByText(/copied/i)).toBeTruthy();
  });

  it("falls back to the literal value when the clipboard is denied", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    wrap(<CopyButton value="princegupta98299@gmail.com">copy</CopyButton>);
    fireEvent.click(screen.getByRole("button", { name: /copy/i }));
    // denied → toast carries the literal value so the visitor can copy manually
    expect(await screen.findByText(/princegupta98299@gmail\.com/)).toBeTruthy();
  });
});

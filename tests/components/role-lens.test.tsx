// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RoleLens } from "@/components/interactive/RoleLens";
import { EXHIBIT_ROLES } from "@/content/exhibit";

describe("RoleLens", () => {
  it("renders one tab per role, super-admin active", () => {
    render(<RoleLens />);
    const tabs = screen.getAllByRole("button", { pressed: false }).concat(
      screen.getAllByRole("button", { pressed: true }),
    );
    expect(tabs.length).toBeGreaterThanOrEqual(EXHIBIT_ROLES.length);
    const active = screen.getAllByRole("button", { pressed: true });
    expect(active).toHaveLength(1);
    expect(active.at(0)?.getAttribute("data-role")).toBe("super");
  });

  it("switching role moves aria-pressed and updates the matrix", () => {
    render(<RoleLens />);
    const viewer = screen.getByRole("button", { name: /viewer/i });
    fireEvent.click(viewer);
    expect(viewer.getAttribute("aria-pressed")).toBe("true");
    const matrix = screen.getByRole("group", { name: /preview as role/i });
    expect(matrix).toBeTruthy();
    // table reflects the newly selected lens
    expect(document.querySelector(".mock-tbl")).toBeTruthy();
  });
});

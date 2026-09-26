// @vitest-environment jsdom
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WiringDiagram } from "@/components/interactive/WiringDiagram";

describe("WiringDiagram", () => {
  it("exposes the schematic group with selectable buses", () => {
    const { container } = render(<WiringDiagram />);
    const group = container.querySelector('[role="group"][aria-label*="schematic"]');
    expect(group).toBeTruthy();
    const buses = Array.from(group!.querySelectorAll("button[data-i]"));
    expect(buses).toHaveLength(4);
    expect(buses.at(0)?.getAttribute("aria-pressed")).toBe("true");
  });

  it("clicking a bus moves the selection", () => {
    const { container } = render(<WiringDiagram />);
    const buses = Array.from(container.querySelectorAll("button[data-i]"));
    const third = buses.at(2);
    const first = buses.at(0);
    if (!third || !first) throw new Error("buses missing");
    fireEvent.click(third);
    expect(third.getAttribute("aria-pressed")).toBe("true");
    expect(first.getAttribute("aria-pressed")).toBe("false");
  });
});

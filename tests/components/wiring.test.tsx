import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WiringDiagram } from "@/components/interactive/WiringDiagram";

describe("WiringDiagram", () => {
  it("exposes the schematic group with selectable buses", () => {
    const { container } = render(<WiringDiagram />);
    const group = container.querySelector('[role="group"][aria-label*="schematic"]');
    expect(group).toBeTruthy();
    const buses = group!.querySelectorAll("button[data-i]");
    expect(buses.length).toBe(4);
    expect(buses[0].getAttribute("aria-pressed")).toBe("true");
  });

  it("clicking a bus moves the selection", () => {
    const { container } = render(<WiringDiagram />);
    const buses = container.querySelectorAll("button[data-i]");
    fireEvent.click(buses[2]);
    expect(buses[2].getAttribute("aria-pressed")).toBe("true");
    expect(buses[0].getAttribute("aria-pressed")).toBe("false");
  });
});

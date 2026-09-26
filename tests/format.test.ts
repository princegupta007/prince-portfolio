import { describe, expect, it } from "vitest";
import { formatCounter } from "@/lib/format";

describe("formatCounter (02·Numbers contract)", () => {
  it("one decimal for years", () => expect(formatCounter(3.5, { decimals: 1 })).toBe("3.5"));
  it("groups thousands", () => expect(formatCounter(5000)).toBe("5,000"));
  it("prefix + suffix", () =>
    expect(formatCounter(30, { prefix: "~", suffix: "%" })).toBe("~30%"));
  it("suffix plus", () => expect(formatCounter(5000, { suffix: "+" })).toBe("5,000+"));
  it("group=false keeps raw", () =>
    expect(formatCounter(5000, { group: false })).toBe("5000"));
  it("zero decimals default", () => expect(formatCounter(7.4)).toBe("7"));
});

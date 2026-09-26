import { describe, expect, it } from "vitest";
import { HEADER_NAV, INDEX_ITEMS } from "@/content/nav";

describe("nav/anchor integrity (unit)", () => {
  it("header nav ids unique + hash format", () => {
    const ids = HEADER_NAV.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z-]+$/));
  });
  it("header nav is an ordered subset of the full index (Background is menu/footer-only)", () => {
    const index = INDEX_ITEMS.map((i) => i.id);
    const header = HEADER_NAV.map((i) => i.id);
    expect(header.every((id, n) => index.indexOf(id) === index.indexOf(header[n]) && index.includes(id))).toBe(true);
    expect(index.filter((id) => id !== "background")).toEqual(header);
  });
  it("index numbers are zero-padded sequence", () => {
    INDEX_ITEMS.forEach((i, n) =>
      expect(i.num).toBe(String(n + 2).padStart(2, "0")),
    ); // 01 is hero, index starts at 02
  });
});

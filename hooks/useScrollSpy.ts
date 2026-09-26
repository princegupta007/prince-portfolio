import { useEffect, useState } from "react";

/**
 * Single rAF-throttled scrollspy: the last section whose top edge has passed
 * the 40% viewport line is "active". Missing sections (pre-Phase-4) are
 * skipped gracefully. Drives header nav underline + dot rail ring.
 */
export function useScrollSpy(ids: readonly string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ids]);

  return active;
}

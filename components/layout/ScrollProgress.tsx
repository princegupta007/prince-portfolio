"use client";

import { useEffect, useState } from "react";

/** 2px lime progress bar, top of viewport (passive scroll + rAF). */
export function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setWidth(
        scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0,
      );
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
  }, []);

  return (
    <div className="progress" aria-hidden="true">
      <i style={{ width: `${width}%` }} />
    </div>
  );
}

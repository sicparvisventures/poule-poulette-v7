"use client";

import { useEffect, useState } from "react";

/** InnerWidth voor scroll-/layout-math (SSR-safe default). */
export function useViewportWidth(fallback = 1200) {
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const sync = () => setW(window.innerWidth || fallback);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [fallback]);
  return w;
}

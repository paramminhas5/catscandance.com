"use client";
import { useEffect } from "react";

/**
 * useSmoothScroll — initialises Lenis smooth scroll on mount.
 * Respects prefers-reduced-motion. Cleans up on unmount.
 * Direct port of CCD v1's useSmoothScroll.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: import("lenis").default | null = null;
    let raf: number;

    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 0.9,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      const tick = (time: number) => {
        lenis!.raf(time);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);
}

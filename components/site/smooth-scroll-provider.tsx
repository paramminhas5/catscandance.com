"use client";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

/** Mounts Lenis smooth scroll. Rendered once in the root layout. */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useSmoothScroll();
  return <>{children}</>;
}

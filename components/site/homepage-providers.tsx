"use client";
/**
 * Client-side providers for the homepage.
 * Kept out of the root layout so the layout stays pure RSC (required by
 * Cache Components). Wraps only the homepage tree.
 */
import { DiscoProvider } from "@/contexts/disco-context";
import { SmoothScrollProvider } from "./smooth-scroll-provider";

export function HomepageProviders({ children }: { children: React.ReactNode }) {
  return (
    <DiscoProvider>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </DiscoProvider>
  );
}

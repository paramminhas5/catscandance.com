import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a Date for display: "FRI · 29 MAY · 9PM" */
export function formatEventDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const dow = d.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase();
  const day = d.getDate();
  const month = d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
  const time = d
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
    .replace(":00 ", "")
    .toUpperCase();
  return `${dow} · ${day} ${month} · ${time}`;
}

/** Slugify a string for URLs. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Absolute URL builder for canonicals, OG, sitemaps. */
export function absoluteUrl(path = ""): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://catscandance.com";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

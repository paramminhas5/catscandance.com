"use client";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "home",         label: "Home" },
  { id: "about",        label: "About" },
  { id: "early-access", label: "Early Access" },
  { id: "events",       label: "Events" },
  { id: "videos",       label: "Videos" },
  { id: "playlist",     label: "Playlist" },
  { id: "drops",        label: "Drops" },
  { id: "instagram",    label: "Instagram" },
];

export function SectionDots() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 group"
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            aria-label={`Scroll to ${label}`}
            onClick={() =>
              document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="relative flex items-center justify-end"
          >
            <span
              className={`pointer-events-none absolute right-6 whitespace-nowrap font-display text-xs px-2 py-1 border-2 border-ink bg-cream text-ink transition-opacity ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {label}
            </span>
            <span
              className={`block w-3 h-3 border-2 border-ink transition-all ${
                isActive ? "bg-magenta scale-125" : "bg-cream/60 hover:bg-acid-yellow"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}

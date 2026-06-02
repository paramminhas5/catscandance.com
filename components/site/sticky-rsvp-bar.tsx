"use client";

import { useEffect, useState } from "react";

type Props = {
  label: string;
  onClick: () => void;
  meta?: string;
};

export function StickyRsvpBar({ label, onClick, meta }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 border-t-4 border-ink bg-ink text-cream transition-transform duration-200 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
      aria-hidden={!show}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-acid-yellow text-[10px] tracking-widest leading-none mb-0.5">
            / RSVP
          </p>
          {meta ? <p className="font-medium text-sm truncate">{meta}</p> : null}
        </div>
        <button
          type="button"
          onClick={onClick}
          className="bg-magenta text-cream font-display text-base px-5 py-3 border-4 border-cream chunk-shadow active:translate-x-1 active:translate-y-1 active:shadow-none transition-transform whitespace-nowrap"
        >
          {label}
        </button>
      </div>
    </div>
  );
}

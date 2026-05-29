"use client";
import { motion } from "motion/react";
import { useDisco } from "@/contexts/disco-context";
import { playDiscoNow, stopDiscoNow } from "@/hooks/use-disco-audio";

export function DiscoButton({ compact = false }: { compact?: boolean }) {
  const { disco, toggle } = useDisco();

  function handleClick() {
    // Imperative play/stop must happen inside the user gesture for iOS.
    if (!disco) playDiscoNow();
    else stopDiscoNow();
    toggle();
    try { window.dispatchEvent(new Event("disco:toggle")); } catch {}
  }

  if (compact) {
    return (
      <motion.button
        onClick={handleClick}
        animate={disco ? { rotate: [0, -10, 10, 0] } : {}}
        transition={{ repeat: disco ? Infinity : 0, duration: 0.5 }}
        className={`w-11 h-11 grid place-items-center border-4 border-ink chunk-shadow text-xl hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform ${
          disco ? "bg-magenta text-cream" : "bg-acid-yellow text-ink"
        }`}
        aria-label="Toggle disco mode"
        title={disco ? "Stop disco" : "Disco mode"}
      >
        🪩
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      animate={disco ? { rotate: [0, -8, 8, 0] } : {}}
      transition={{ repeat: disco ? Infinity : 0, duration: 0.5 }}
      className={`flex items-center gap-2 border-4 border-ink px-4 py-2 chunk-shadow font-display text-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform ${
        disco ? "bg-magenta text-cream" : "bg-acid-yellow text-ink"
      }`}
      aria-label="Toggle disco mode"
    >
      <span className="text-2xl">🪩</span>
      {disco ? "STOP" : "DISCO"}
    </motion.button>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useDisco } from "@/contexts/disco-context";

const AUDIO_SRC = "/audio/disco-loop.mp3";
const FADE_MS = 600;
const TARGET_VOL = 0.5;
const clamp = (v: number) => Math.max(0, Math.min(1, v));

// Module-level singleton so playDiscoNow can be called inside a user gesture.
let audioEl: HTMLAudioElement | null = null;
let audioAvailable = true;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function getAudio(): HTMLAudioElement | null {
  if (audioEl) return audioEl;
  if (typeof window === "undefined") return null;
  const a = new Audio(AUDIO_SRC);
  a.loop = true;
  a.preload = "auto";
  a.volume = 0;
  a.addEventListener("error", () => { audioAvailable = false; notify(); });
  audioEl = a;
  return a;
}

function fadeTo(target: number) {
  const el = audioEl;
  if (!el) return;
  const start = el.volume;
  const t0 = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / FADE_MS);
    el.volume = clamp(start + (target - start) * k);
    if (k < 1) requestAnimationFrame(step);
    else if (target === 0) el.pause();
  };
  requestAnimationFrame(step);
}

/** Must be called inside a user gesture for iOS audio unlock. */
export function playDiscoNow() {
  const el = getAudio();
  if (!el || !audioAvailable) return;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  el.volume = 0;
  el.play().then(() => fadeTo(TARGET_VOL)).catch(() => {});
}

export function stopDiscoNow() {
  if (!audioEl) return;
  fadeTo(0);
}

export function useDiscoAudio() {
  const { disco } = useDisco();
  const [muted, setMuted] = useState(false);
  const [, force] = useState(0);

  useEffect(() => {
    getAudio();
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  useEffect(() => {
    const el = getAudio();
    if (!el || !audioAvailable) return;
    if (disco && !muted) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      el.play().then(() => fadeTo(TARGET_VOL)).catch(() => {});
    } else {
      fadeTo(0);
    }
  }, [disco, muted]);

  return { muted, setMuted, available: audioAvailable };
}

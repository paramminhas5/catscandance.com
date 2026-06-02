"use client";

import { useEffect, useState } from "react";

type Props = {
  /** ISO date string e.g. "2026-06-29T21:00:00+05:30" */
  startsAt: string;
  doorsTime?: string;
  invert?: boolean;
};

const PAD = (n: number) => n.toString().padStart(2, "0");

export function EventCountdown({ startsAt, doorsTime, invert = false }: Props) {
  const [now, setNow] = useState<number>(() => Date.now());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const minute = setInterval(() => setNow(Date.now()), 60_000);
    const second = setInterval(() => setTick((s) => s + 1), 1000);
    return () => {
      clearInterval(minute);
      clearInterval(second);
    };
  }, []);

  const target = new Date(startsAt);
  if (isNaN(target.getTime())) return null;

  const diff = target.getTime() - now;
  if (diff < 60_000) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = (60 - (Math.floor(now / 1000) % 60) - (tick % 1)) % 60;

  const bg = invert ? "bg-acid-yellow text-ink" : "bg-ink text-cream";
  const accent = invert ? "text-magenta" : "text-acid-yellow";

  return (
    <div
      className={`${bg} border-y-4 border-ink py-5 md:py-7`}
      role="timer"
      aria-live="polite"
      aria-label={`Doors open in ${days} days, ${hours} hours, ${mins} minutes`}
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 flex flex-wrap items-center justify-between gap-4 md:gap-6">
        <div>
          <p className={`font-display text-xs md:text-sm tracking-widest mb-1 ${accent}`}>
            / DOORS OPEN IN
          </p>
          <p className="font-display text-3xl md:text-5xl leading-none">
            {days > 0 && (
              <>
                <span>{days}</span>
                <span className="opacity-50">D</span>
                <span className="mx-2 opacity-30">·</span>
              </>
            )}
            <span>{PAD(hours)}</span>
            <span className="opacity-50">H</span>
            <span className="mx-2 opacity-30">·</span>
            <span>{PAD(mins)}</span>
            <span className="opacity-50">M</span>
            <span className="mx-2 opacity-30">·</span>
            <span className="tabular-nums">{PAD(Math.floor(seconds))}</span>
            <span className="opacity-50">S</span>
          </p>
        </div>
        {doorsTime && (
          <div className="text-right">
            <p className={`font-display text-xs md:text-sm tracking-widest mb-1 ${accent}`}>
              / KICK-OFF
            </p>
            <p className="font-display text-xl md:text-2xl leading-none">{doorsTime}</p>
          </div>
        )}
      </div>
    </div>
  );
}

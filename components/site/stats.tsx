"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";

const STATS = [
  {
    target: 1_000_000,
    suffix: "+",
    label: "PAWS",
    color: "bg-acid-yellow",
    display: (n: number) => (n >= 1_000_000 ? "1M" : `${Math.round(n / 1000)}K`),
  },
  {
    target: 50,
    suffix: "",
    label: "CITIES",
    color: "bg-lime",
    display: (n: number) => `${Math.round(n)}`,
  },
  {
    target: 12,
    suffix: "",
    label: "DROPS",
    color: "bg-orange",
    display: (n: number) => `${Math.round(n)}`,
  },
] as const;

function StatCard({
  s,
  i,
  progress,
}: {
  s: (typeof STATS)[number];
  i: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const [val, setVal] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    setVal(Math.min(1, Math.max(0, v)) * s.target);
  });
  const y = useTransform(progress, [0, 1], [80 + i * 20, -20 - i * 10]);

  return (
    <motion.div
      style={{ y }}
      className={`${s.color} border-4 border-ink rounded-3xl p-8 chunk-shadow-lg text-center`}
    >
      <div className="font-display text-6xl md:text-7xl text-ink">
        {s.display(val)}
        {s.suffix}
      </div>
      <div className="font-display text-2xl md:text-3xl text-ink mt-2">{s.label}</div>
    </motion.div>
  );
}

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section ref={ref} className="bg-magenta border-b-4 border-ink py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 grid sm:grid-cols-3 gap-6">
        {STATS.map((s, i) => (
          <StatCard key={s.label} s={s} i={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

"use client";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const COLORS = [
  "hsl(var(--magenta))",
  "hsl(var(--lime))",
  "hsl(var(--electric-blue))",
  "hsl(var(--acid-yellow))",
  "hsl(var(--orange))",
  "hsl(var(--hot-pink))",
];

export function Lasers() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const laserCount = mobile ? 4 : COLORS.length;
  const spotCount = mobile ? 4 : 8;
  const laserHeight = mobile ? "100vh" : "120vh";

  return (
    <div
      className={`absolute inset-0 z-20 pointer-events-none overflow-hidden ${mobile ? "" : "mix-blend-screen"}`}
      style={{ willChange: "transform", contain: "paint" }}
      aria-hidden
    >
      {COLORS.slice(0, laserCount).map((c, i) => (
        <motion.div
          key={i}
          animate={{ rotate: i % 2 === 0 ? [0, 60, -60, 0] : [0, -60, 60, 0] }}
          transition={{ repeat: Infinity, duration: 3 + i * 0.3, ease: "easeInOut" }}
          style={{
            left: `${10 + i * 15}%`,
            top: "0%",
            background: `linear-gradient(to bottom, ${c}, transparent)`,
            width: "4px",
            height: laserHeight,
            transformOrigin: "top center",
            opacity: 0.7,
            position: "absolute",
            ...(mobile ? {} : { boxShadow: `0 0 20px ${c}` }),
          }}
        />
      ))}
      {Array.from({ length: spotCount }).map((_, i) => (
        <motion.div
          key={`s${i}`}
          animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
          style={{
            position: "absolute",
            left: `${(i * 13) % 90}%`,
            top: `${(i * 17) % 80}%`,
            width: 200,
            height: 200,
            background: `radial-gradient(circle, ${COLORS[i % COLORS.length]}, transparent 70%)`,
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
}

"use client";
/**
 * Hero — direct port of CCD v1's <Hero>.
 *
 * Pure-static visual shell. The dynamic urgency strip is a separate island
 * (<HeroUrgencyStrip>) so this component can fully prerender.
 *
 * Differences from v1:
 *   - framer-motion → motion/react (official rebrand, same API)
 *   - asset imports → /assets/* public URLs
 *   - useNextEvent fetch → moved to <HeroUrgencyStrip /> RSC island
 *   - DiscoBall + Lasers + DiscoContext → temporarily disabled (Pass 2)
 */
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

const FLANK_BASE =
  "absolute z-30 pointer-events-none drop-shadow-[6px_6px_0_hsl(var(--ink))] wiggle w-24 md:w-40";

export function Hero({ children }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const reduce = useReducedMotion();

  // Big bottom side cats
  const leftX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-180%"]);
  const leftY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-30%"]);
  const leftRot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -45]);
  const rightX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "180%"]);
  const rightY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-30%"]);
  const rightRot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 45]);

  // DJ cat (centered)
  const djY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "18%"]);

  // Four flank cats around the wordmark
  const tlX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-120%"]);
  const tlRot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-12, -40]);
  const trX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "120%"]);
  const trRot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [12, 40]);
  const blX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-120%"]);
  const blRot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-12, -40]);
  const brX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "120%"]);
  const brRot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [12, 40]);
  const flankOpacity = useTransform(scrollYProgress, [0, 0.6], reduce ? [1, 1] : [1, 0]);

  // Headline scales up as cats fly out
  const titleScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.25]);
  const titleY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-6%"]);

  const starRotA = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 360]);
  const starRotB = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -360]);

  const flankCats = [
    { id: "cap", src: "/assets/cat-cap.png", pos: "top-[28%] left-[6%] md:top-[26%] md:left-[14%]", x: tlX, rot: tlRot },
    { id: "hpDance", src: "/assets/cat-headphones-dance.png", pos: "top-[28%] right-[6%] md:top-[26%] md:right-[14%]", x: trX, rot: trRot },
    { id: "headphones", src: "/assets/cat-headphones.png", pos: "top-[52%] left-[6%] md:top-[54%] md:left-[14%]", x: blX, rot: blRot },
    { id: "handstand", src: "/assets/cat-handstand.png", pos: "top-[52%] right-[6%] md:top-[54%] md:right-[14%]", x: brX, rot: brRot },
  ];

  return (
    <section
      ref={ref}
      id="home"
      className="relative h-screen overflow-hidden bg-electric-blue"
    >
      <motion.div
        style={{ rotate: starRotA, willChange: "transform" }}
        className="absolute top-24 left-6 md:top-28 md:left-16 z-10 w-16 md:w-32 text-acid-yellow drop-shadow-[6px_6px_0_hsl(var(--ink))]"
        aria-hidden
      >
        <Star />
      </motion.div>
      <motion.div
        style={{ rotate: starRotB, willChange: "transform" }}
        className="absolute top-32 right-6 md:top-40 md:right-20 z-10 w-14 md:w-28 text-magenta drop-shadow-[6px_6px_0_hsl(var(--ink))]"
        aria-hidden
      >
        <Star />
      </motion.div>

      {/* Wordmark */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center pointer-events-none">
        <motion.h1
          style={{
            scale: titleScale,
            y: titleY,
            transformOrigin: "center center",
            willChange: "transform",
          }}
          className="font-display text-[15vw] md:text-[11vw] leading-[0.85] text-cream drop-shadow-[6px_6px_0_hsl(var(--ink))] -mt-4 md:-mt-6"
        >
          CATS
          <br />
          CAN
          <br />
          DANCE
        </motion.h1>
        <p className="sr-only">
          Cats Can Dance is a Bangalore-based event organiser hosting the best underground dance music
          parties and electronic events in Bangalore, India.
        </p>
      </div>

      {/* DJ cat — slightly overlaps the headline */}
      <motion.div
        style={{ y: djY, willChange: "transform" }}
        className="absolute inset-x-0 mx-auto bottom-20 md:-bottom-8 z-30 w-[100%] md:w-[92%] min-w-[300px] max-w-[820px] pointer-events-none"
      >
        <Image
          src="/assets/hero-center.svg"
          alt=""
          aria-hidden
          width={820}
          height={820}
          priority
          unoptimized
          className="w-full h-auto drop-shadow-[10px_10px_0_hsl(var(--ink))]"
        />
      </motion.div>

      {/* Four flank cats bracketing the wordmark */}
      {flankCats.map((c) => (
        <motion.div
          key={c.id}
          style={{ x: c.x, rotate: c.rot, opacity: flankOpacity, willChange: "transform" }}
          className={`${FLANK_BASE} ${c.pos}`}
        >
          <Image
            src={c.src}
            alt=""
            aria-hidden
            width={200}
            height={200}
            priority
            className="w-full h-auto"
          />
        </motion.div>
      ))}

      {/* Big bottom side cats */}
      <motion.div
        style={{ x: leftX, y: leftY, rotate: leftRot, willChange: "transform" }}
        className="absolute bottom-28 md:bottom-4 left-1 md:left-10 z-40 w-32 md:w-56 drop-shadow-[6px_6px_0_hsl(var(--ink))]"
      >
        <Image
          src="/assets/cat-left.svg"
          alt=""
          aria-hidden
          width={300}
          height={300}
          priority
          unoptimized
          className="w-full h-auto wiggle"
        />
      </motion.div>
      <motion.div
        style={{ x: rightX, y: rightY, rotate: rightRot, willChange: "transform" }}
        className="absolute bottom-28 md:bottom-4 right-1 md:right-10 z-40 w-32 md:w-56 drop-shadow-[6px_6px_0_hsl(var(--ink))]"
      >
        <Image
          src="/assets/cat-right.svg"
          alt=""
          aria-hidden
          width={300}
          height={300}
          priority
          unoptimized
          className="w-full h-auto wiggle"
        />
      </motion.div>

      {/* Urgency strip — passed in as a child island so this Hero stays static */}
      {children}

      {/* Desktop CTAs */}
      <div className="hidden md:flex absolute inset-x-0 bottom-16 z-50 flex-row gap-3 justify-center px-4">
        <a
          href="#early-access"
          className="bg-magenta text-cream font-display text-xl px-6 py-3 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform text-center"
        >
          JOIN THE PACK
        </a>
        <a
          href="#drops"
          className="bg-acid-yellow text-ink font-display text-xl px-6 py-3 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform text-center"
        >
          SEE THE DROPS
        </a>
      </div>

      {/* Mobile CTAs */}
      <div className="md:hidden absolute inset-x-0 bottom-6 z-50 flex flex-col gap-3 justify-center px-6">
        <a
          href="#early-access"
          className="bg-magenta text-cream font-display text-lg px-6 py-3 border-4 border-ink chunk-shadow text-center"
        >
          JOIN THE PACK
        </a>
        <a
          href="#drops"
          className="bg-acid-yellow text-ink font-display text-lg px-6 py-3 border-4 border-ink chunk-shadow text-center"
        >
          SEE THE DROPS
        </a>
      </div>
    </section>
  );
}

const Star = () => (
  <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
    <path
      d="M50 2 L60 38 L98 40 L68 62 L80 98 L50 76 L20 98 L32 62 L2 40 L40 38 Z"
      stroke="hsl(var(--ink))"
      strokeWidth="5"
      strokeLinejoin="round"
    />
  </svg>
);

"use client";
import { useRef, useState, useTransition } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { z } from "zod";
import { Confetti } from "./confetti";
import { submitEarlyAccess } from "@/app/actions/early-access";

const EmailSchema = z.string().trim().toLowerCase().email().max(255);

export function EarlyAccess({ signupCount }: { signupCount?: number | null }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const shadowSize = useTransform(scrollYProgress, [0, 1], [2, 14]);
  const titleShadow = useTransform(shadowSize, (v) => `${v}px ${v}px 0 hsl(var(--ink))`);
  const orbit1 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 360]);
  const orbit2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -360]);

  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [burst, setBurst] = useState(false);
  const [isPending, startTransition] = useTransition();
  const lastRef = useRef(0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const now = Date.now();
    if (now - lastRef.current < 2000) return;
    lastRef.current = now;

    const parsed = EmailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error("Hmm, that doesn't look like a valid email.");
      return;
    }

    const fd = new FormData();
    fd.set("email", parsed.data);
    fd.set("source", "home");
    fd.set("website", website);

    startTransition(async () => {
      const result = await submitEarlyAccess(fd);
      if (!result.ok) {
        if (result.error === "invalid_email") {
          toast.error("Hmm, that doesn't look like a valid email.");
        } else {
          toast.error("Something went wrong. Try again?");
        }
        return;
      }
      toast.success("You're in! Welcome to the litter. Check your inbox.");
      setEmail("");
      setBurst(false);
      requestAnimationFrame(() => setBurst(true));
      setTimeout(() => setBurst(false), 1300);
    });
  }

  return (
    <section
      ref={ref}
      id="early-access"
      className="relative bg-electric-blue py-12 md:py-20 border-b-4 border-ink overflow-hidden"
    >
      <Confetti active={burst} />

      {/* Orbiting music notes */}
      <motion.div
        style={{ rotate: orbit1 }}
        className="absolute top-1/2 left-1/2 -mt-40 -ml-40 w-80 h-80 pointer-events-none"
        aria-hidden
      >
        <img
          src="/assets/music-note.png"
          alt=""
          className="absolute top-0 left-1/2 -translate-x-1/2 w-16"
        />
      </motion.div>
      <motion.div
        style={{ rotate: orbit2 }}
        className="absolute top-1/2 left-1/2 -mt-56 -ml-56 w-[28rem] h-[28rem] pointer-events-none"
        aria-hidden
      >
        <img
          src="/assets/music-note.png"
          alt=""
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12"
        />
      </motion.div>

      <div className="relative z-10 text-center max-w-3xl mx-auto px-4 md:px-8">
        <p className="font-display text-acid-yellow text-lg md:text-xl mb-3">/ EARLY ACCESS</p>
        <motion.h2
          style={{ textShadow: titleShadow }}
          className="font-display text-cream text-4xl md:text-6xl mb-4"
        >
          BE FIRST
          <br />
          IN THE DOOR
        </motion.h2>
        <p className="text-cream/90 text-base md:text-lg mb-6 font-medium">
          Sign up for early access to drops, gigs, and the cult before everyone else catches on.
        </p>

        {signupCount != null && signupCount > 0 && (
          <p className="font-display text-acid-yellow text-sm uppercase tracking-widest mb-4">
            ✦ {signupCount.toLocaleString("en-IN")} people on the list across 6 cities
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          {/* Honeypot — hidden from humans */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="hidden"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            maxLength={255}
            className="flex-1 bg-cream text-ink border-4 border-ink px-5 py-4 font-display text-lg placeholder:text-ink/60 focus:outline-none focus:bg-acid-yellow"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-magenta text-cream font-display text-xl px-8 py-4 border-4 border-ink chunk-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform disabled:opacity-60"
          >
            {isPending ? "ADDING…" : "COUNT ME IN"}
          </button>
        </form>
      </div>
    </section>
  );
}

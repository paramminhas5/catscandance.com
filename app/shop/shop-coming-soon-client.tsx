"use client";

import { useState } from "react";
import { submitEarlyAccess } from "@/app/actions/early-access";

const ROTATIONS = [
  "bg-magenta text-cream",
  "bg-electric-blue text-cream",
  "bg-acid-yellow text-ink",
  "bg-orange text-ink",
];

export function ShopComingSoon() {
  const [colorIdx, setColorIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const currentColor = ROTATIONS[colorIdx % ROTATIONS.length] ?? "bg-magenta text-cream";
  const isLight = currentColor.includes("text-ink");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    fd.set("source", "shop-early-access");
    const result = await submitEarlyAccess(fd);
    setStatus(result.ok ? "success" : "error");
  }

  return (
    <section
      className={`relative border-b-4 border-ink py-24 md:py-40 overflow-hidden cursor-pointer transition-colors duration-500 ${currentColor}`}
      onClick={() => setColorIdx((i) => i + 1)}
    >
      {/* Hint text */}
      <p className={`absolute top-6 right-6 font-display text-[10px] uppercase tracking-widest ${isLight ? "text-ink/30" : "text-cream/30"}`}>
        Tap to change colour
      </p>

      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        <p className={`font-display text-base uppercase tracking-widest mb-4 ${isLight ? "text-ink/60" : "text-cream/60"}`}>
          / SHOP
        </p>
        <h1
          className={`font-display text-[4rem] sm:text-[6rem] md:text-[9rem] leading-[0.85] mb-6`}
          style={{ filter: `drop-shadow(6px 6px 0 ${isLight ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.3)"})` }}
        >
          DROPS<br/>COMING.
        </h1>
        <p className={`font-medium text-lg md:text-2xl mb-10 max-w-xl ${isLight ? "text-ink/70" : "text-cream/70"}`}>
          Limited apparel and goods for humans and their pets.<br/>
          Wearable dance music culture — built in Bengaluru.
        </p>

        {status === "success" ? (
          <div
            className={`inline-block border-4 border-current px-8 py-5 chunk-shadow`}
            onClick={(e) => e.stopPropagation()}
          >
            <p className={`font-display text-2xl mb-1`}>YOU&apos;RE ON THE LIST.</p>
            <p className={`text-sm font-medium ${isLight ? "text-ink/60" : "text-cream/60"}`}>
              We&apos;ll email you before the first drop goes live.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col sm:flex-row gap-0 max-w-lg"
          >
            <input type="text" name="website" className="hidden" defaultValue="" tabIndex={-1} autoComplete="off" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className={`flex-1 px-5 py-4 border-4 border-current bg-transparent font-display text-base placeholder:opacity-40 focus:outline-none ${isLight ? "text-ink placeholder:text-ink/40" : "text-cream placeholder:text-cream/40"}`}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className={`px-6 py-4 border-4 border-current font-display text-sm uppercase tracking-widest chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform disabled:opacity-50 ${isLight ? "bg-ink text-cream border-ink" : "bg-cream text-ink border-cream"}`}
            >
              {status === "loading" ? "…" : "NOTIFY ME"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className={`mt-2 font-display text-sm ${isLight ? "text-ink/50" : "text-cream/50"}`}>
            Something went wrong. Try again.
          </p>
        )}
      </div>
    </section>
  );
}

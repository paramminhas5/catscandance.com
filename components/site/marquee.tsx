/**
 * Brand marquee — used between sections on the homepage.
 * Direct port of CCD v1's <Marquee>.
 */
import { cn } from "@/lib/utils";

const defaultItems = [
  "DANCE MUSIC 🎧",
  "PET CULTURE 🐾",
  "STREETWEAR 👕",
  "EXPERIENCES 🪩",
  "DROPS 💎",
  "COMMUNITY ✨",
];

type Size = "lg" | "sm";

export function Marquee({
  bg = "bg-acid-yellow",
  reverse = false,
  size = "sm",
  items,
  className,
}: {
  bg?: string;
  reverse?: boolean;
  size?: Size;
  items?: string[];
  className?: string;
}) {
  const list = items && items.length ? items : defaultItems;
  // Triple-loop for seamless animation across very wide viewports.
  const loop = [...list, ...list, ...list];
  const isLg = size === "lg";
  const padding = isLg ? "py-2 md:py-4" : "py-1.5 md:py-2.5";
  const text = isLg ? "text-2xl md:text-5xl" : "text-base md:text-2xl";
  const gap = isLg ? "gap-8 md:gap-12" : "gap-6 md:gap-10";

  return (
    <div className={cn(bg, "border-y-4 border-ink overflow-hidden", padding, className)}>
      <div
        className={cn(
          "flex whitespace-nowrap marquee",
          gap,
          reverse && "[animation-direction:reverse]"
        )}
      >
        {loop.map((t, i) => (
          <span key={i} className={cn("font-display text-ink flex items-center", text, gap)}>
            {t}
            <span className="text-magenta">★</span>
          </span>
        ))}
      </div>
    </div>
  );
}

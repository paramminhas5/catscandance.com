import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  variant?: "default" | "yellow" | "pink" | "blue" | "lime" | "orange";
  size?: "sm" | "md" | "lg";
  reverse?: boolean;
}

const variantClasses: Record<NonNullable<MarqueeProps["variant"]>, string> = {
  default: "bg-ink text-cream",
  yellow: "bg-acid-yellow text-ink",
  pink: "bg-hot-pink text-cream",
  blue: "bg-electric-blue text-cream",
  lime: "bg-lime text-ink",
  orange: "bg-orange text-ink",
};

const sizeClasses: Record<NonNullable<MarqueeProps["size"]>, string> = {
  sm: "text-base md:text-lg py-2",
  md: "text-2xl md:text-3xl py-3",
  lg: "text-4xl md:text-6xl py-4",
};

export function Marquee({
  items,
  className,
  variant = "default",
  size = "md",
  reverse = false,
}: MarqueeProps) {
  // Duplicate so the loop is seamless.
  const rendered = [...items, ...items];
  return (
    <div
      className={cn(
        "relative overflow-hidden border-y-2 border-ink",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <div
        className={cn(
          "flex w-max whitespace-nowrap font-display uppercase",
          reverse ? "marquee" : "marquee"
        )}
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {rendered.map((item, i) => (
          <span key={i} className="px-6 inline-flex items-center gap-6">
            {item}
            <span aria-hidden className="opacity-60">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-12 w-full border-2 border-ink bg-cream px-4 py-2 text-base font-sans",
        "placeholder:text-ink/40",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-acid-yellow",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "rounded-md transition-shadow duration-[var(--duration-snap)]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

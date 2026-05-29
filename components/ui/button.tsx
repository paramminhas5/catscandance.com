import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display uppercase tracking-tight",
    "border-2 border-ink transition-all",
    "duration-[var(--duration-snap)] ease-[var(--ease-pop)]",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/20",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:translate-x-1 active:translate-y-1 active:shadow-none",
  ],
  {
    variants: {
      variant: {
        default: "bg-ink text-acid-yellow hover:bg-ink/90 chunk-shadow hover:translate-x-[-2px] hover:translate-y-[-2px]",
        primary: "bg-hot-pink text-cream chunk-shadow hover:translate-x-[-2px] hover:translate-y-[-2px]",
        accent: "bg-acid-yellow text-ink chunk-shadow hover:translate-x-[-2px] hover:translate-y-[-2px]",
        outline: "bg-transparent text-ink hover:bg-ink hover:text-acid-yellow",
        ghost: "border-transparent text-ink hover:bg-ink/5",
        link: "border-transparent text-ink underline-offset-4 hover:underline",
        destructive: "bg-destructive text-destructive-foreground chunk-shadow",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-md",
        md: "h-11 px-5 text-base rounded-md",
        lg: "h-14 px-8 text-lg rounded-lg",
        xl: "h-16 px-10 text-xl rounded-xl",
        icon: "size-10 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-chunk={variant === "ghost" || variant === "link" ? undefined : ""}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };

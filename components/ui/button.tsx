import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui"; // Alternatively: "@radix-ui/react-slot"
import { cn } from "@/app/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:opacity-90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        // --- NEW VARIANTS ---
        soft: "bg-primary/10 text-primary hover:bg-primary/20",
        "destructive-soft":
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-md",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-14 rounded-full px-10 text-lg",
        icon: "size-9 rounded-md",

        // --- NEW SIZES ---
        "sm-pill": "h-7 rounded-full px-3 text-xs font-bold",
        "icon-sm": "size-7 rounded-md",
      },
      color: {
        default: "",
        light:
          "bg-white/80 border border-gray-200 text-gray-800 hover:bg-white focus-visible:ring-gray-300",
        dark: "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700 focus-visible:ring-gray-500",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      color: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  color,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, color, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

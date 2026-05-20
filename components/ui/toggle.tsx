"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/app/lib/utils";

export const toggleVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 rounded-md border font-medium text-sm transition-all outline-none " +
    "hover:bg-accent hover:text-accent-foreground " +
    "data-pressed:bg-secondary data-pressed:text-secondary-foreground " +
    "focus-visible:ring-2 focus-visible:ring-ring/50 " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 min-w-9 px-3",
        lg: "h-10 min-w-10 px-4",
        sm: "h-8 min-w-8 px-2",
      },
      variant: {
        default: "border-transparent bg-transparent",
        outline:
          "border-input bg-background shadow-xs hover:bg-accent " +
          "data-pressed:bg-secondary data-pressed:shadow-inner",
      },
    },
  },
);

export function Toggle({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props &
  VariantProps<typeof toggleVariants>): React.ReactElement {
  return (
    <TogglePrimitive
      className={cn(toggleVariants({ className, size, variant }))}
      data-slot="toggle"
      {...props}
    />
  );
}

export { TogglePrimitive };

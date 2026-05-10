import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import type React from "react";
import { cn } from "@/app/lib/utils";

interface SeparatorProps extends SeparatorPrimitive.Props {
  variant?: "default" | "muted";
}

export function Separator({
  className,
  orientation = "horizontal",
  variant = "default",
  ...props
}: SeparatorProps): React.ReactElement {
  return (
    <SeparatorPrimitive
      className={cn(
        "shrink-0 transition-colors",
        // HOMOGENIZED COLORS
        variant === "default" && "bg-border", // Matches Table/Accordion
        variant === "muted" && "bg-border/40", // Softer for secondary info

        // LAYOUT LOGIC (Keep this)
        "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:w-px data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch",
        className,
      )}
      data-slot="separator"
      orientation={orientation}
      {...props}
    />
  );
}

export { SeparatorPrimitive };

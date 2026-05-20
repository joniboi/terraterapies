import * as React from "react";
import { cn } from "@/app/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  color?: "light" | "dark" | "muted";
}

function Textarea({ className, color = "muted", ...props }: TextareaProps) {
  const colorClass =
    color === "light"
      ? "text-background placeholder:text-background/60 border-background/40 focus-visible:border-background focus-visible:ring-background/20"
      : color === "dark"
        ? "text-foreground placeholder:text-muted-foreground border-foreground/20 focus-visible:border-foreground focus-visible:ring-foreground/10"
        : "text-foreground placeholder:text-muted-foreground/70 border-input focus-visible:border-ring focus-visible:ring-ring/50";

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-md bg-transparent px-3 py-2 text-sm shadow-xs transition-all outline-none",
        "focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        colorClass,
        className,
      )}
      {...props}
    />
  );
}

Textarea.displayName = "Textarea";

export { Textarea };

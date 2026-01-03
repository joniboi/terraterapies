import * as React from "react";
import { cn } from "@/app/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  color?: "light" | "dark" | "muted";
}

function Textarea({ className, color = "muted", ...props }: TextareaProps) {
  const colorClass =
    color === "light"
      ? "text-white placeholder:text-white/70 border-white/60 focus-visible:border-white focus-visible:ring-white/40"
      : color === "dark"
      ? "text-gray-900 placeholder:text-gray-700/70 border-gray-800 focus-visible:border-gray-800 focus-visible:ring-gray-700/40"
      : "text-gray-700 placeholder:text-muted-foreground/70 border-input focus-visible:border-ring focus-visible:ring-ring/50";

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[78px] w-full rounded-md bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow,border-color] outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        colorClass,
        className
      )}
      {...props}
    />
  );
}

Textarea.displayName = "Textarea";

export { Textarea };

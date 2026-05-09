import * as React from "react";
import { cn } from "@/app/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  color?: "light" | "dark" | "muted";
}

function Input({ className, type, color = "muted", ...props }: InputProps) {
  const colorClass =
    color === "light"
      ? "text-background placeholder:text-background/60 border-background/40 focus-visible:border-background focus-visible:ring-background/20"
      : color === "dark"
        ? "text-foreground placeholder:text-muted-foreground border-foreground/20 focus-visible:border-foreground focus-visible:ring-foreground/10"
        : "text-foreground placeholder:text-muted-foreground/70 border-input focus-visible:border-ring focus-visible:ring-ring/50";
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-sm shadow-xs transition-all outline-none focus-visible:ring-2",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        type === "search" &&
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
        type === "file" &&
          "p-0 pr-3 italic file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-border file:bg-muted/50 file:px-3 file:text-sm file:font-medium file:not-italic",
        colorClass,
        className,
      )}
      {...props}
    />
  );
}

export { Input };

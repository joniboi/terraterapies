import * as React from "react"
import { cn } from "@/app/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  color?: "light" | "dark" | "muted"
}

function Input({ className, type, color = "muted", ...props }: InputProps) {
  const colorClass =
    color === "light"
      ? "text-white placeholder:text-white/70 border-white/60 focus-visible:border-white focus-visible:ring-white/40"
      : color === "dark"
      ? "text-gray-900 placeholder:text-gray-700/70 border-gray-800 focus-visible:border-gray-800 focus-visible:ring-gray-700/40"
      : "text-gray-700 placeholder:text-muted-foreground/70 border-input focus-visible:border-ring focus-visible:ring-ring/50"

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow,border-color] outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        type === "search" &&
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
        type === "file" &&
          "p-0 pr-3 italic file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic",
        colorClass,
        className
      )}
      {...props}
    />
  )
}

export { Input }

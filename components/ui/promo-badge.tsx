import { cn } from "@/app/lib/utils";

interface PromoBadgeProps {
  text?: string;
  className?: string; // Allows us to pass positioning (like absolute/top) when needed
}

export function PromoBadge({ text, className }: PromoBadgeProps) {
  // If there's no text (no promo), render nothing at all
  if (!text) return null;

  return (
    <div
      className={cn(
        // Base styles (Colors, shape, animation, icon layout)
        "inline-flex items-center bg-highlight text-highlight-foreground px-3.5 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse border border-highlight-border",
        // Custom styles passed from the parent (e.g., "absolute top-4 right-4")
        className,
      )}
    >
      🎁 {text}
    </div>
  );
}

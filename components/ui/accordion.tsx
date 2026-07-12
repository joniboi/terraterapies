"use client";

import { cn } from "@/app/lib/utils";
import { useState, useId } from "react";

type AccordionProps = {
  children: React.ReactNode;
  title: string;
  id?: string; // 1. Now optional
  active?: boolean;
  variant?: "card" | "ghost"; // 2. Added variants
  className?: string;
};

export default function Accordion({
  children,
  title,
  id,
  active = false,
  variant = "card",
  className,
}: AccordionProps) {
  const [accordionOpen, setAccordionOpen] = useState<boolean>(active);
  const generatedId = useId();
  const instanceId = id || generatedId; // Use provided ID or the generated one

  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        // CARD VARIANT: Looks like a standalone section
        variant === "card" &&
          "rounded-xl border border-border bg-background shadow-sm overflow-hidden",
        // GHOST VARIANT: Minimal, looks like a line-item toggle
        variant === "ghost" && "border-t border-border first:border-t-0",
        className,
      )}
    >
      <h2>
        <button
          className={cn(
            "flex w-full items-center justify-between text-left font-semibold text-foreground transition-colors",
            variant === "card"
              ? "px-6 py-4 hover:bg-muted/50"
              : "py-4 hover:opacity-70",
          )}
          onClick={(e) => {
            e.preventDefault();
            setAccordionOpen((prevState) => !prevState);
          }}
          aria-expanded={accordionOpen}
          aria-controls={`accordion-text-${instanceId}`}
        >
          <span
            className={cn(
              variant === "ghost" &&
                "text-sm font-bold uppercase tracking-widest text-muted-foreground",
            )}
          >
            {title}
          </span>

          <span
            className={cn(
              "ml-8 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
              variant === "card" ? "bg-muted shadow-sm" : "bg-transparent",
            )}
          >
            <svg
              className={cn(
                "origin-center transform transition duration-200 ease-out fill-muted-foreground",
                accordionOpen && "rotate-180",
              )}
              xmlns="http://www.w3.org/2000/svg"
              width={10}
              height={6}
              fill="none"
            >
              <path
                d="m2 .586 3 3 3-3L9.414 2 5.707 5.707a1 1 0 0 1-1.414 0L.586 2 2 .586Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
      </h2>
      <div
        id={`accordion-text-${instanceId}`}
        role="region"
        aria-labelledby={`accordion-title-${instanceId}`}
        className={cn(
          "grid overflow-hidden transition-all duration-300 ease-in-out",
          accordionOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(variant === "card" ? "px-6 pb-5 pt-2" : "pb-6 pt-0")}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

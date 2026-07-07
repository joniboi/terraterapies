"use client";

import { cn } from "@/app/lib/utils";
import { useState } from "react";

type AccordionpProps = {
  children: React.ReactNode;
  title: string;
  id: string;
  active?: boolean;
};

export default function Accordion({
  children,
  title,
  id,
  active = false,
}: AccordionpProps) {
  const [accordionOpen, setAccordionOpen] = useState<boolean>(active);

  return (
    // ✅ 100% Semantic Theme Classes: bg-background and border-border
    <div className="relative rounded-xl border border-border bg-background shadow-sm overflow-hidden transition-colors duration-300">
      <h2>
        <button
          // hover:bg-muted/50 dynamically uses the muted color of the active brand
          className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-foreground hover:bg-muted/50 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            setAccordionOpen((prevState) => !prevState);
          }}
          aria-expanded={accordionOpen}
          aria-controls={`accordion-text-${id}`}
        >
          <span>{title}</span>
          {/* bg-muted for the circle behind the arrow */}
          <span className="ml-8 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted shadow-sm transition-colors">
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
        id={`accordion-text-${id}`}
        role="region"
        aria-labelledby={`accordion-title-${id}`}
        className={cn(
          "grid overflow-hidden text-sm text-muted-foreground transition-all duration-300 ease-in-out",
          accordionOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5 pt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

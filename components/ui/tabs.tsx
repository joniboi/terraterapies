"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/app/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react"; // 🚀 Import arrows

export type TabsVariant = "default" | "underline";

export function Tabs({
  className,
  ...props
}: TabsPrimitive.Root.Props): React.ReactElement {
  return (
    <TabsPrimitive.Root
      className={cn(
        "flex flex-col gap-2 data-[orientation=vertical]:flex-row",
        className,
      )}
      data-slot="tabs"
      {...props}
    />
  );
}

export function TabsList({
  variant = "default",
  scrollable = false, // 🚀 NEW PROP
  className,
  children,
  ...props
}: TabsPrimitive.List.Props & {
  variant?: TabsVariant;
  scrollable?: boolean;
}): React.ReactElement {
  // --- SCROLLING LOGIC ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 1); // 1px buffer
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
    }
  }, []);

  // Check scroll on mount, window resize, and when children (tabs) change
  useEffect(() => {
    if (!scrollable) return;
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, children, scrollable]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // --- RENDERING ---
  const ListContent = (
    <TabsPrimitive.List
      className={cn(
        "relative z-0 flex w-fit items-center gap-x-0.5 text-muted-foreground transition-all",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start",
        variant === "default"
          ? "rounded-lg bg-muted p-1 shadow-inner"
          : "border-b border-border data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-r",
        className,
      )}
      data-slot="tabs-list"
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        className={cn(
          "absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) transition-[width,translate] duration-200 ease-in-out",
          variant === "underline"
            ? "z-10 bg-primary data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:translate-x-px"
            : "-z-1 rounded-md bg-background text-foreground shadow-sm",
        )}
        data-slot="tab-indicator"
      />
    </TabsPrimitive.List>
  );

  // If not scrollable, return normal list
  if (!scrollable) {
    return ListContent;
  }

  // 🚀 IF SCROLLABLE: Wrap in the scroll container with arrows
  return (
    <div className="relative flex items-center w-full min-w-0 group">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-r from-background to-transparent text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5 bg-background rounded-full shadow-sm" />
        </button>
      )}

      {/* Hide scrollbar using standard CSS classes */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
      >
        {ListContent}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-l from-background to-transparent text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="h-5 w-5 bg-background rounded-full shadow-sm" />
        </button>
      )}
    </div>
  );
}

export function TabsTab({
  className,
  ...props
}: TabsPrimitive.Tab.Props): React.ReactElement {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "relative flex h-9 shrink-0 grow cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 font-medium text-sm transition-all outline-none",
        "text-muted-foreground hover:text-foreground",
        "data-active:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:opacity-50 disabled:pointer-events-none",
        "data-[orientation=vertical]:justify-start data-[orientation=vertical]:w-full",
        className,
      )}
      data-slot="tabs-tab"
      {...props}
    />
  );
}

export function TabsPanel({
  className,
  ...props
}: TabsPrimitive.Panel.Props): React.ReactElement {
  return (
    <TabsPrimitive.Panel
      className={cn("flex-1 outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  );
}

export { TabsPrimitive, TabsTab as TabsTrigger, TabsPanel as TabsContent };

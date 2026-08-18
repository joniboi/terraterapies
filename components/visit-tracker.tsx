"use client";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logVisit } from "@/app/actions/track";

export function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTracked = useRef(false);

  useEffect(() => {
    hasTracked.current = false;

    const triggerVisit = () => {
      if (!hasTracked.current) {
        hasTracked.current = true;
        logVisit(pathname, searchParams.toString());
        cleanup();
      }
    };

    // 1. Human scrolled the page
    const handleScroll = () => {
      if (window.scrollY > 50) {
        triggerVisit();
      }
    };

    // 2. Human tapped/clicked the screen
    const handleClick = () => {
      triggerVisit();
    };

    // 3. Fallback: Human stayed on page for more than 4 seconds
    const timer = setTimeout(() => {
      triggerVisit();
    }, 4000);

    const cleanup = () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleClick);
      clearTimeout(timer);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleClick, { passive: true });

    return () => cleanup();
  }, [pathname, searchParams]);

  return null;
}

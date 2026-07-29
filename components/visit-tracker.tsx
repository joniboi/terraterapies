"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logVisit } from "@/app/actions/track";

export function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Wait 1 second before logging so it doesn't affect page load speed
    const timer = setTimeout(() => {
      logVisit(pathname, searchParams.toString());
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}

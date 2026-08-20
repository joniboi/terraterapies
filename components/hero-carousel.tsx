"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/app/lib/utils";
import { PromoBadge } from "@/components/ui/promo-badge";

export default function HeroCarousel({ slides }: { slides: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  if (slides.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0 w-full h-full bg-muted">
      {slides.map((slide, index) => {
        const {
          resolvedTitle,
          resolvedSubtitle,
          resolvedLink,
          resolvedButtonText,
          promoBadgeText,
          desktopUrl,
          mobileUrl,
        } = slide;

        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            {/* Mobile Image */}
            {mobileUrl && (
              <img
                src={mobileUrl}
                alt={resolvedTitle}
                className="w-full h-full object-cover object-center block md:hidden"
              />
            )}

            {/* Desktop Image */}
            {desktopUrl && (
              <img
                src={desktopUrl}
                alt={resolvedTitle}
                // 🚀 FIXED: Changed to object-[center_10%]
                // This anchors the photo almost entirely to the top edge,
                // guaranteeing the therapist's face is never cropped on wide screens.
                className="w-full h-full object-cover object-[center_10%] hidden md:block"
              />
            )}

            <PromoBadge
              text={promoBadgeText}
              className="absolute top-28 right-6 md:top-32 md:right-10 z-30 scale-110 shadow-xl"
            />

            <div className="absolute inset-0 bg-black/20 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
            <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-black/60 to-transparent z-10" />

            <div className="absolute bottom-0 left-0 right-0 h-28 md:h-40 lg:h-48 bg-gradient-to-b from-transparent to-background z-10 pointer-events-none" />

            {/* PROMOTIONAL OVERLAY */}
            {(resolvedTitle || resolvedSubtitle) && (
              <div className="absolute bottom-0 left-0 right-0 w-full z-20 pb-12 md:pb-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                  <div
                    className="max-w-3xl text-center md:text-left text-white"
                    data-aos="fade-up"
                  >
                    {resolvedTitle && (
                      <h3 className="font-heading text-2xl md:text-4xl font-bold mb-3 drop-shadow-md">
                        {resolvedTitle}
                      </h3>
                    )}
                    {resolvedSubtitle && (
                      <p className="text-base md:text-lg text-white/90 mb-6 drop-shadow-md line-clamp-2 md:line-clamp-none">
                        {resolvedSubtitle}
                      </p>
                    )}
                    {resolvedLink && resolvedButtonText && (
                      <Button
                        asChild
                        size="default"
                        variant="default"
                        className="shadow-xl ring-1 ring-white/20"
                      >
                        <Link href={resolvedLink}>{resolvedButtonText}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setIsPaused(true);
              }}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm",
                i === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/80",
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

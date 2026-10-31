"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/app/lib/utils";

export default function HeroCarousel({
  slides,
  dict,
}: {
  slides: any[];
  // Typing the dict loosely for safety based on the keys we need
  dict: { carouselContext: string; discountSuffix: string; [key: string]: any };
}) {
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
          promoDiscount,
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
                className="w-full h-full object-cover object-[center_10%] hidden md:block"
              />
            )}

            <div className="absolute inset-0 bg-black/15 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/50 to-transparent z-10" />

            <div className="absolute bottom-0 left-0 right-0 h-28 md:h-40 lg:h-48 bg-gradient-to-b from-transparent to-background z-10 pointer-events-none" />

            {/* PROMOTIONAL OVERLAY */}
            {(resolvedTitle || resolvedSubtitle) && (
              <div className="absolute bottom-0 left-0 right-0 w-full z-20 pb-10 md:pb-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                  <div
                    className="max-w-md text-center md:text-left text-white"
                    data-aos="fade-up"
                  >
                    {/* 🚀 CONSUMED FROM DICTIONARY */}
                    <span className="block text-[10px] md:text-xs font-semibold text-white/80 uppercase tracking-widest mb-2 drop-shadow-sm">
                      {dict.carouselContext}
                    </span>

                    {resolvedTitle && (
                      <h3 className="font-heading text-lg md:text-2xl font-bold mb-1 drop-shadow-md">
                        {resolvedTitle}
                      </h3>
                    )}

                    {resolvedSubtitle && (
                      <p className="text-sm md:text-base text-white/90 mb-4 drop-shadow-md line-clamp-2 md:line-clamp-none">
                        {resolvedSubtitle}
                      </p>
                    )}

                    {/* 🚀 FIX: flex-row ensures items stay horizontally aligned. 
                        Whitespace-nowrap and mobile-optimized paddings prevent overflow on small screens */}
                    <div className="flex flex-row items-center justify-center md:justify-start gap-2 md:gap-3 mt-2">
                      {promoDiscount && (
                        <span className="inline-flex items-center bg-highlight text-highlight-foreground px-2.5 py-1 md:px-3 md:py-1.5 rounded-sm text-[10px] md:text-sm font-bold shadow-md border border-highlight-border whitespace-nowrap">
                          {promoDiscount}% {dict.discountSuffix}
                        </span>
                      )}

                      {resolvedLink && resolvedButtonText && (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-7 md:h-9 px-3 md:px-4 text-[10px] md:text-sm bg-black/20 text-white border-white/40 hover:bg-white hover:text-black backdrop-blur-sm transition-all shadow-sm whitespace-nowrap"
                        >
                          <Link href={resolvedLink}>{resolvedButtonText}</Link>
                        </Button>
                      )}
                    </div>
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

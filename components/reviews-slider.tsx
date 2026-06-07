"use client";

import React, { useRef } from "react";
import { cn } from "@/app/lib/utils";

import { StarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { I18nString } from "@/db/schema";

interface Review {
  id: number;
  authorName: string;
  text: I18nString | string;
  rating: number;
  relativeDate: I18nString | string;
}

interface ReviewsSliderProps {
  lang: string;
  title: string;
  subtitle: string;
  reviews: Review[];
  className?: string;
}

export default function ReviewsSlider({
  lang,
  title,
  subtitle,
  reviews,
  className,
}: ReviewsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const getLabel = (field: I18nString | string | undefined) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang as keyof I18nString] || field["en"];
  };

  if (reviews.length === 0) return null;

  // Scroll logic for buttons
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className={cn("py-16 md:py-24 bg-background", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with Navigation Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl text-left" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg">{subtitle}</p>
          </div>

          {/* Desktop Navigation Buttons (Hidden on mobile) */}
          <div className="hidden md:flex gap-2" data-aos="fade-up">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-border hover:bg-accent"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-border hover:bg-accent"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>

        {/* The Slider Container */}
        <div
          ref={scrollRef}
          className={cn(
            "flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory scroll-smooth",
            reviews.length < 3 ? "md:justify-center" : "justify-start",
          )}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-[85vw] md:w-[calc(33.333%-1rem)] flex-none snap-center md:snap-start"
            >
              <div className="h-full p-8 rounded-3xl bg-accent/30 border border-border flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-1 mb-4 text-highlight">
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>

                <p className="text-foreground italic mb-8 leading-relaxed grow text-lg line-clamp-6">
                  "{getLabel(review.text)}"
                </p>

                <div className="flex justify-between items-center pt-6 border-t border-border/50">
                  <div>
                    <p className="font-bold text-foreground uppercase tracking-wider text-xs mb-1">
                      {review.authorName}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      Verified Customer
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground italic">
                    {getLabel(review.relativeDate)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Indicator (Optional hint that it scrolls) */}
        <div className="md:hidden flex justify-center gap-1.5 mt-2">
          <div className="w-8 h-1 rounded-full bg-primary/20" />
          <div className="w-4 h-1 rounded-full bg-primary/10" />
        </div>
      </div>
    </section>
  );
}

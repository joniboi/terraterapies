"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/app/lib/utils";

import { I18nString } from "@/db/schema";
import { StarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRelativeTimeString } from "@/app/lib/automaticDateUtility";

interface Review {
  id: number;
  authorName: string;
  text: I18nString | string;
  rating: number;
  date: Date;
}

interface ReviewsSliderProps {
  lang: string;
  title: string;
  subtitle: string;
  reviews: Review[];
  className?: string;
}

/**
 * SUB-COMPONENT: Individual Review Card with "Read More" logic
 */
function ReviewCard({ review, lang }: { review: Review; lang: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLabel = (field: I18nString | string | undefined) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang as keyof I18nString] || field["en"];
  };

  const fullText = getLabel(review.text);
  // Threshold to determine if the card should even be clickable/expandable
  const isLongText = fullText.length > 240;

  return (
    <div
      onClick={() => isLongText && setIsExpanded(!isExpanded)}
      className={cn(
        "h-full p-8 rounded-3xl bg-accent/30 border border-border flex flex-col shadow-sm transition-all duration-500",
        isLongText && "cursor-pointer hover:bg-accent/50", // Only pointer if it's expandable
        isExpanded ? "shadow-md" : "hover:shadow-md",
      )}
    >
      {/* Stars */}
      <div className="flex items-center gap-1 mb-4 text-highlight">
        {[...Array(review.rating)].map((_, i) => (
          <StarIcon key={i} className="w-5 h-5 fill-current" />
        ))}
      </div>

      {/* Review Text Area */}
      <div className="relative grow mb-6">
        <p
          className={cn(
            "text-foreground italic leading-relaxed text-lg transition-all duration-500",
            !isExpanded && isLongText ? "line-clamp-6" : "line-clamp-none",
          )}
        >
          "{fullText}"
        </p>

        {/* Subtle Fade Overlay: only shows when collapsed and text is long */}
        {!isExpanded && isLongText && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-accent/40 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center pt-6 border-t border-border/50">
        <div>
          <p className="font-bold text-foreground uppercase tracking-wider text-[10px] mb-1">
            {review.authorName}
          </p>
          <div className="flex items-center gap-1.5">
            <div className="size-1 rounded-full bg-success" />
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
              {lang === "es"
                ? "Verificado"
                : lang === "ca"
                  ? "Verificat"
                  : "Verified"}
            </p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground italic font-medium">
          {getRelativeTimeString(review.date, lang)}
        </span>
      </div>
    </div>
  );
}

/**
 * MAIN SLIDER COMPONENT
 */
export default function ReviewsSlider({
  lang,
  title,
  subtitle,
  reviews,
  className,
}: ReviewsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (reviews.length === 0) return null;

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl text-left" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg italic">{subtitle}</p>
          </div>

          {/* Navigation */}
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

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className={cn(
            "flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory scroll-smooth items-stretch",
            reviews.length < 3 ? "md:justify-center" : "justify-start",
          )}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-[85vw] md:w-[calc(33.333%-1rem)] flex-none snap-center md:snap-start"
            >
              <ReviewCard review={review} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

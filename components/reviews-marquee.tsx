"use client";

import { cn } from "@/app/lib/utils";
import { I18nString } from "@/db/schema";

import { StarIcon } from "lucide-react";
import React from "react"; // Import React for CSSProperties type

interface Review {
  id: number;
  authorName: string;
  text: I18nString | string;
  rating: number;
  relativeDate: I18nString | string;
}

interface ReviewsMarqueeProps {
  lang: string;
  title: string;
  subtitle: string;
  reviews: Review[];
  className?: string;
  speed?: string;
}

export default function ReviewsMarquee({
  lang,
  title,
  subtitle,
  reviews,
  className,
  speed = "80s",
}: ReviewsMarqueeProps) {
  const getLabel = (field: I18nString | string | undefined) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang as keyof I18nString] || field["en"];
  };

  if (reviews.length === 0) return null;

  const shouldMarquee = reviews.length >= 3;
  const displayReviews = shouldMarquee ? [...reviews, ...reviews] : reviews;

  return (
    <section
      className={cn("py-16 md:py-24 bg-background overflow-hidden", className)}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 text-center"
        data-aos="fade-up"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          {subtitle}
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        {shouldMarquee && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10"></div>
          </>
        )}

        <div
          // 1. We pass the speed to a CSS variable here
          style={{ "--marquee-speed": speed } as React.CSSProperties}
          className={cn(
            "flex w-full",
            // 2. We tell Tailwind to use that CSS variable
            shouldMarquee
              ? "animate-[infinite-scroll_var(--marquee-speed)_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap"
              : "justify-center",
          )}
        >
          {displayReviews.map((review, idx) => (
            <div
              key={`${review.id}-${idx}`}
              className="w-80 md:w-[400px] flex-none mx-4 p-8 rounded-2xl bg-accent/30 border border-border shadow-sm transition-shadow hover:shadow-md flex flex-col whitespace-normal"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-5 h-5 text-highlight fill-highlight"
                  />
                ))}
              </div>
              <p className="text-muted-foreground italic mb-6 line-clamp-6 leading-relaxed grow text-lg">
                "{getLabel(review.text)}"
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-border mt-auto">
                <span className="font-semibold text-foreground uppercase tracking-wider text-xs">
                  {review.authorName}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {getLabel(review.relativeDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

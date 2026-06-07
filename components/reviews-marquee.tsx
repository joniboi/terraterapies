"use client";

import { cn } from "@/app/lib/utils";
import { I18nString } from "@/db/schema";
import { StarIcon } from "lucide-react";

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
}

export default function ReviewsMarquee({
  lang,
  title,
  subtitle,
  reviews,
  className,
}: ReviewsMarqueeProps) {
  // Safe translation extractor
  const getLabel = (field: I18nString | string | undefined) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang as keyof I18nString] || field["en"];
  };

  // Duplicate the array to make the infinite scroll seamless
  const duplicatedReviews = [...reviews, ...reviews];

  if (reviews.length === 0) return null;

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
        {/* Gradients using your normalized background color */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10"></div>

        {/* 
          Using your existing theme.css animation: 
          Since --animate-infinite-scroll is just the name, we use standard Tailwind syntax
          to apply duration and linear looping.
        */}
        <div className="flex animate-[infinite-scroll_40s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap">
          {duplicatedReviews.map((review, idx) => (
            <div
              key={`${review.id}-${idx}`}
              // Strictly using your semantic colors (bg-accent/30, border-border, etc.)
              className="w-80 md:w-[400px] flex-none mx-4 p-6 rounded-2xl bg-accent/30 border border-border shadow-sm transition-shadow hover:shadow-md flex flex-col whitespace-normal"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  // Uses your highlight color for stars
                  <StarIcon key={i} className="w-5 h-5 text-highlight" />
                ))}
              </div>
              <p className="text-muted-foreground italic mb-6 line-clamp-4 leading-relaxed grow">
                "{getLabel(review.text)}"
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-border mt-auto">
                <span className="font-semibold text-foreground">
                  {review.authorName}
                </span>
                <span className="text-sm text-muted-foreground">
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

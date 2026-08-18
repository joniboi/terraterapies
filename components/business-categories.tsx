"use client";

import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import { useEffect } from "react";
import { ServiceGroup, Dictionary } from "@/types/definitions";

interface BusinessCategoriesProps {
  lang: string; // "es" | "en" | "ca"
  groups: ServiceGroup[];
  dict: Dictionary["home"]["categories"];
  ctaLabel: string;
}

export default function BusinessCategories({
  lang,
  groups,
  dict,
  ctaLabel,
}: BusinessCategoriesProps) {
  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: "ease-out-cubic" });
  }, []);

  // Helper to extract translation safely (handles strings or localized objects)
  const getLabel = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang] || field["es"] || field["en"] || "";
  };

  const total = groups.length;

  /**
   * Generates responsive grid column spans based on the index and total card count
   */
  const getCardSpanClasses = (index: number, totalCount: number) => {
    // Mobile: one card per row
    if (totalCount === 5) {
      // Tablet: 2 cards per row, with the last card centered
      if (index === 4) {
        return "md:col-span-1 md:col-start-2 lg:col-span-2 lg:col-start-4";
      }

      // Desktop: 3 cards on first row, 2 centered on second
      if (index === 3) {
        return "md:col-span-1 lg:col-span-2 lg:col-start-2";
      }

      return "md:col-span-1 lg:col-span-2";
    }

    // Four cards: 2 × 2
    if (totalCount === 4) {
      return "md:col-span-1 lg:col-span-3";
    }

    // Three cards: 3 across
    if (totalCount === 3) {
      return "md:col-span-1 lg:col-span-2";
    }

    // Two cards: 2 across
    if (totalCount === 2) {
      return "md:col-span-1 lg:col-span-3";
    }

    // One card
    return "md:col-span-1 lg:col-span-6";
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {dict.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {dict.subtitle}
          </p>
        </div>

        {/* Balanced Editorial Responsive CSS Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {groups.map((group, idx) => {
            const spanClass = getCardSpanClasses(idx, total);
            const imageUrl = group.image || "/images/categories/massages.png"; // Safe fallback image path

            return (
              <div
                key={group.slug}
                className={`group relative overflow-hidden rounded-3xl shadow-xl bg-stone-900 h-[380px] md:h-[450px] transition-all ${spanClass}`}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <Image
                  src={imageUrl}
                  alt={getLabel(group.title)}
                  fill
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
                  priority={idx < 2}
                />

                {/* Dark gradient overlay for typography legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-6 md:p-10">
                  {/* Semantic badge using highlight design tokens */}
                  {group.badge && (
                    <span className="mb-4 inline-block px-4 py-1 rounded-full border border-highlight-border/40 bg-highlight-background/20 text-white text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                      {getLabel(group.badge)}
                    </span>
                  )}

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-sm">
                    {getLabel(group.title)}
                  </h3>

                  {group.description && (
                    <p className="max-w-md text-stone-200 mb-6 line-clamp-2 text-xs md:text-sm">
                      {getLabel(group.description)}
                    </p>
                  )}

                  {/* Semantic button using brand primary tokens */}
                  <Link
                    href={`/${lang}/${group.slug}`}
                    className="bg-primary text-primary-foreground font-bold px-8 py-2.5 rounded-full hover:bg-primary-hover transition-all transform hover:-translate-y-0.5 shadow-lg text-sm"
                  >
                    {ctaLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

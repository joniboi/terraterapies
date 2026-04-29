"use client";

import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import { useEffect } from "react";
import { Category, Dictionary } from "@/types/definitions";
import { I18nString } from "@/db/schema";

interface BusinessCategoriesProps {
  lang: string; // "es" | "en" | "ca"
  categories: Category[];
  dict: Dictionary["home"]["categories"];
  ctaLabel: string;
}

export default function BusinessCategories({
  lang,
  categories,
  dict,
  ctaLabel,
}: BusinessCategoriesProps) {
  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: "ease-out-cubic" });
  }, []);

  // 1. SPLIT & SORT: Use orderIndex for both groups
  const featuredCategories = categories
    .filter((c) => c.isFeatured)
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const standardCategories = categories
    .filter((c) => !c.isFeatured)
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  // Helper to extract translation safely
  const getLabel = (field: I18nString | string | undefined) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang as keyof I18nString] || field["en"];
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {dict.title}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {dict.subtitle}
          </p>
        </div>

        {/* 2. FEATURED GRID (Multi-Hero) */}
        {featuredCategories.length > 0 && (
          <div
            className={`grid gap-8 mb-16 ${
              featuredCategories.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 lg:grid-cols-2"
            }`}
          >
            {featuredCategories.map((cat, idx) => (
              <div
                key={cat.slug}
                className="group relative overflow-hidden rounded-3xl shadow-2xl bg-stone-900 h-[400px] md:h-[500px]"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <Image
                  src={cat.image}
                  alt={getLabel(cat.title)}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
                  priority={idx < 2}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-8 md:p-12">
                  {/* Badge using I18nString */}
                  {cat.badge && (
                    <span className="mb-4 inline-block px-4 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-200 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                      {getLabel(cat.badge)}
                    </span>
                  )}

                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
                    {getLabel(cat.title)}
                  </h3>

                  {cat.shortDescription && (
                    <p className="max-w-md text-stone-200 mb-8 line-clamp-2 text-sm md:text-base">
                      {getLabel(cat.shortDescription)}
                    </p>
                  )}

                  <Link
                    href={`/${lang}/${cat.slug}`}
                    className="bg-amber-600 text-white font-bold px-10 py-3 rounded-full hover:bg-amber-500 transition-all transform hover:-translate-y-1 shadow-xl"
                  >
                    {ctaLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. STANDARD GRID (Secondary Categories) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {standardCategories.map((cat, idx) => (
            <div
              key={cat.slug}
              className="group relative overflow-hidden rounded-2xl shadow-md bg-white h-80"
              data-aos="fade-up"
              data-aos-delay={idx * 50}
            >
              <Image
                src={cat.image}
                alt={getLabel(cat.title)}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h3 className="text-xl font-bold text-white mb-4 tracking-wide uppercase">
                  {getLabel(cat.title)}
                </h3>
                <Link
                  href={`/${lang}/${cat.slug}`}
                  className="bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold px-5 py-2 rounded-full hover:bg-white transition-all"
                >
                  {ctaLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

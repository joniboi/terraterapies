"use client";

import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import { useEffect } from "react";
import { Category, Dictionary } from "@/types/definitions";

interface BusinessCategoriesProps {
  lang: string;
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

  // 1. DYNAMIC LOGIC: Find the featured category (Rituals)
  const featuredCategory = categories.find((c) => c.isFeatured);
  const standardCategories = categories.filter((c) => !c.isFeatured);

  // Helper for standard card
  const CategoryCard = ({ cat }: { cat: Category }) => (
    <div
      key={cat.slug}
      className="group relative overflow-hidden rounded-2xl shadow-lg bg-white"
      data-aos="zoom-y-out"
    >
      <div className="relative h-96 w-full">
        <Image
          src={cat.image}
          alt={cat.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h3 className="text-2xl font-bold mb-4 drop-shadow-lg tracking-wide">
          {cat.title}
        </h3>
        <Link
          href={`/${lang}/${cat.slug}`}
          className="inline-block bg-white/90 backdrop-blur-sm text-gray-900 font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all duration-300"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );

  return (
    <section className="py-16 md:py-24 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {dict.title}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {dict.subtitle}
          </p>
        </div>

        {/* 
          2. FEATURED CARD (RITUALS) - MOVED TO TOP 
          This is now the "Hero" of the section.
        */}
        {featuredCategory && (
          <div
            className="w-full relative group overflow-hidden rounded-3xl shadow-xl bg-white mb-10"
            data-aos="fade-up"
            data-aos-delay="100" // Low delay so it appears first
          >
            <div className="relative h-[450px] md:h-[500px] w-full">
              <Image
                src={featuredCategory.image}
                alt={featuredCategory.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
                {/* Badge */}
                {featuredCategory.badge && (
                  <span className="mb-4 inline-block px-3 py-1 rounded-full border border-white/30 bg-white/10 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                    {featuredCategory.badge}
                  </span>
                )}

                <h3 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-xl text-amber-50">
                  {featuredCategory.title}
                </h3>

                {/* Description */}
                {featuredCategory.shortDescription && (
                  <p className="max-w-xl text-lg text-gray-200 mb-8 leading-relaxed drop-shadow-md hidden md:block">
                    {featuredCategory.shortDescription}
                  </p>
                )}

                <Link
                  href={`/${lang}/${featuredCategory.slug}`}
                  className="inline-block bg-amber-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-amber-500 hover:-translate-y-1 transition-all duration-300 ring-4 ring-amber-600/20"
                >
                  {ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 
          3. STANDARD GRID (OTHER CATEGORIES) - MOVED TO BOTTOM 
          These are secondary options.
        */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {standardCategories.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

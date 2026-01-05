"use client";

import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import { useEffect } from "react";

// 1. Define Data Interfaces
interface Category {
  slug: string;
  title: string;
  image: string;
  // Add other fields if needed
}

// 2. Define Dictionary Interface for this component
interface CategoryDict {
  title: string;
  subtitle: string;
}

interface BusinessCategoriesProps {
  lang: string;
  categories: Category[];
  dict: CategoryDict;
  ctaLabel: string; // "Ver más"
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

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12" data-aos="fade-up">
          {/* 3. Use Dictionary Literals */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {dict.title}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{dict.subtitle}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
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
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <h3 className="text-xl font-semibold mb-3 drop-shadow-md">
                  {cat.title}
                </h3>
                {/* 4. Update Link to include Lang */}
                <Link
                  href={`/${lang}/${cat.slug}`}
                  className="inline-block bg-white text-gray-800 font-medium px-5 py-2 rounded-full shadow-md hover:bg-gray-100 transition"
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

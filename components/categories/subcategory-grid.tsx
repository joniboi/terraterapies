"use client";

import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import { useEffect } from "react";

export interface Subcategory {
  title: string;
  image: string;
  link: string;
  shortDescription?: string;
}

// 1. Define Props Interface
interface SubcategoryShowcaseProps {
  items: Subcategory[];
  title?: string;
  description?: string;
  ctaLabel: string; // <--- New Prop
}

export default function SubcategoryShowcase({
  items,
  title,
  description,
  ctaLabel,
}: SubcategoryShowcaseProps) {
  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: "ease-out-cubic" });
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {title && (
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              {title}
            </h2>
            {description && (
              <p className="text-gray-500 max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        )}

        <div className="flex flex-col space-y-24">
          {items.map((sub, index) => {
            const isEven = index % 2 === 1;
            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-stretch ${
                  isEven ? "md:flex-row-reverse" : ""
                } rounded-2xl overflow-hidden shadow-lg bg-white`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Image Section */}
                <div className="relative w-full md:w-1/6 aspect-[1/1.3]">
                  <Image
                    src={sub.image}
                    alt={sub.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Text Section */}
                <div className="w-full md:w-3/4 flex flex-col justify-center p-8 md:p-12 text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {sub.title}
                  </h3>
                  {sub.shortDescription && (
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {sub.shortDescription}
                    </p>
                  )}
                  <Link
                    href={sub.link}
                    className="inline-block self-center md:self-start bg-gray-900 text-white font-medium px-6 py-2 rounded-full shadow-md hover:bg-gray-800 transition"
                  >
                    {/* 2. Use the dynamic label */}
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

"use client";

import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import { useEffect } from "react";
import { Subcategory } from "@/types/definitions";
import { Button } from "@/components/ui/button";
import { PricingPills } from "@/components/treatment/pricing-pills"; // <-- IMPORTED
import { PromoBadge } from "@/components/ui/promo-badge";

export interface ShowcaseItem extends Subcategory {
  link: string;
}

interface SubcategoryShowcaseProps {
  items: ShowcaseItem[];
  title?: string;
  description?: string;
  ctaLabel: string;
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
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        {title && (
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col space-y-16 md:space-y-24">
          {items.map((sub, index) => {
            const isEven = index % 2 === 1;
            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-stretch ${
                  isEven ? "md:flex-row-reverse" : ""
                } rounded-2xl overflow-hidden shadow-md border border-border bg-background`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Image Section */}
                <div className="relative w-full md:w-5/12 aspect-[4/3] md:aspect-auto">
                  <Image
                    src={sub.image}
                    alt={sub.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* 🚀 REUSABLE PROMO BADGE */}
                  <PromoBadge
                    text={sub.promoBadgeText}
                    className="absolute top-4 right-4 z-10" // Passing specific position for the image overlay
                  />
                </div>

                {/* Text & Pricing Section */}
                <div className="w-full md:w-7/12 flex flex-col justify-center p-6 md:p-12 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                    {sub.title}
                  </h3>
                  {sub.shortDescription && (
                    <p className="text-muted-foreground mb-8 leading-relaxed text-sm md:text-base">
                      {sub.shortDescription}
                    </p>
                  )}

                  {/* 🚀 EXTRACTED COMPONENT */}
                  <PricingPills
                    options={sub.options || []}
                    baseLink={sub.link}
                  />

                  <div className="mt-auto pt-4 border-t border-border flex justify-center md:justify-start">
                    <Button asChild className="rounded-full px-8 shadow-sm">
                      <Link href={sub.link}>{ctaLabel}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

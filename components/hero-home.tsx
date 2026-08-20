"use client";

import PageIllustration from "@/components/page-illustration";
import { Button } from "./ui/button";
import Link from "next/link";
import { getLocalizedRoute, routes } from "@/app/lib/routes";
import { Calendar, Gift } from "lucide-react";
import HeroCarousel from "./hero-carousel";
import { cn } from "@/app/lib/utils";

export default function HeroHome({
  dict,
  settings,
  hydratedGallery,
  lang,
}: {
  dict: any; // Contains dict.home.hero
  settings: any;
  hydratedGallery: any[];
  lang: string;
}) {
  const tagline = settings?.heroTagline?.[lang] || "";
  const businessName = settings?.businessName || "";
  const bookingUrl = settings?.freshaUrl || "#";

  const hasGallery = hydratedGallery && hydratedGallery.length > 0;

  return (
    <section className="relative w-full flex flex-col justify-start min-h-[100svh] md:min-h-[850px] md:h-[90vh] max-h-[1200px] overflow-hidden">
      {/* BACKGROUND LAYER */}
      {hasGallery ? (
        // 🚀 PASSED THE DICTIONARY DOWN TO THE CAROUSEL
        <HeroCarousel slides={hydratedGallery} dict={dict} />
      ) : (
        <PageIllustration />
      )}

      {/* FOREGROUND HERO CONTENT */}
      <div className="relative z-20 mx-auto w-full max-w-6xl px-4 sm:px-6 flex-1 flex flex-col pointer-events-none">
        <div className="pt-32 pb-12 md:pt-[15%] md:pb-20 pointer-events-auto">
          <div className="text-center">
            <h1
              className="font-heading text-4xl font-bold mb-8 mx-auto max-w-3xl"
              data-aos="zoom-y-out"
            >
              <span
                className={cn(
                  "block mb-6 text-5xl font-bold md:text-6xl transition-colors duration-300",
                  hasGallery ? "text-white drop-shadow-xl" : "text-foreground",
                )}
              >
                {businessName}
              </span>
              <span
                className={cn(
                  "block text-lg font-normal transition-colors duration-300",
                  hasGallery
                    ? "text-white/90 drop-shadow-md"
                    : "text-muted-foreground",
                )}
              >
                {tagline}
              </span>
            </h1>
            <div className="mx-auto max-w-3xl">
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 max-w-xs sm:max-w-none mx-auto"
                data-aos="zoom-y-out"
                data-aos-delay={450}
              >
                {/* ACTION 1: BOOKING */}
                <Button
                  asChild
                  variant="default"
                  size="lg"
                  className={cn(
                    "w-full sm:w-auto min-w-[220px] transition-all duration-300",
                    hasGallery ? "glass-btn" : "shadow-lg",
                  )}
                >
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {dict.cta}
                  </a>
                </Button>

                {/* ACTION 2: GIFTING */}
                <Button
                  asChild
                  variant="default"
                  size="lg"
                  className={cn(
                    "w-full sm:w-auto min-w-[220px] transition-all duration-300",
                    hasGallery ? "glass-btn" : "shadow-lg",
                  )}
                >
                  <Link href={getLocalizedRoute(routes.gift, lang)}>
                    <Gift className="w-5 h-5 mr-2" />
                    {dict.ctaGift || "Gift a Treatment"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

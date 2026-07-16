"use client";

import PageIllustration from "@/components/page-illustration";
import { Button } from "./ui/button";
import Link from "next/link";
import { getLocalizedRoute, routes } from "@/app/lib/routes";
import { Calendar, Gift } from "lucide-react";

// 1. Define the Dictionary Interface

export default function HeroHome({
  dict,
  settings,
  lang,
}: {
  dict: any;
  settings: any;
  lang: string;
}) {
  const tagline = settings?.heroTagline?.[lang] || "";
  const businessName = settings?.businessName || "";
  const bookingUrl = settings?.freshaUrl || "#";

  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="pb-12 text-center md:pb-16">
            <h1
              className="mb-6 text-5xl font-bold md:text-6xl"
              data-aos="zoom-y-out"
            >
              {businessName}
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-lg text-muted-foreground"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                {tagline}
              </p>
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 max-w-xs sm:max-w-none mx-auto"
                data-aos="zoom-y-out"
                data-aos-delay={450}
              >
                {/* ACTION 1: BOOKING */}
                <Button
                  asChild
                  variant="default" // <-- Solid primary
                  size="lg"
                  className="w-full sm:w-auto min-w-[220px] shadow-lg"
                >
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {dict.cta} {/* "Book Appointment" */}
                  </a>
                </Button>

                {/* ACTION 2: GIFTING */}
                <Button
                  asChild
                  variant="default" // <-- Exactly the same solid primary
                  size="lg"
                  className="w-full sm:w-auto min-w-[220px] shadow-lg"
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

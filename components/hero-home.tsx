"use client";

import PageIllustration from "@/components/page-illustration";
import { Button } from "./ui/button";

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
                className="flex justify-center"
                data-aos="zoom-y-out"
                data-aos-delay={450}
              >
                <Button asChild size="lg">
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dict.cta}
                  </a>
                </Button>
              </div>
            </div>
          </div>
          {/* ... Hero images stay the same ... */}
        </div>
      </div>
    </section>
  );
}

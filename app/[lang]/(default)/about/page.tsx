// app/[lang]/about/page.tsx

import Image from "next/image";
import { getDictionary } from "@/app/lib/getDictionary";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  const [dict, settings] = await Promise.all([
    getDictionary(lang),
    db.query.siteSettings.findFirst(),
  ]);
  const aboutTitle = dict.about.title;
  const aboutDescription =
    settings?.aboutUsText?.[lang as "es" | "ca" | "en"] || "";
  const imageSrc = settings?.aboutImage || "/images/contact-portrait.jpg";
  return (
    <main className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Text */}
          <div data-aos="fade-right" className="order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              {aboutTitle}
            </h1>

            {/* The whitespace-pre-line class respects the \n\n in the JSON! */}
            <div className="prose prose-lg text-gray-600 whitespace-pre-line leading-relaxed">
              <p>{aboutDescription}</p>
            </div>
          </div>

          {/* Right Column: Image */}
          <div
            data-aos="fade-left"
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            {/* Aspect ratio matches 1526x2048 exactly */}
            <div className="relative w-full max-w-[450px] aspect-[1526/2048] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={imageSrc}
                alt={dict.about.imageAlt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

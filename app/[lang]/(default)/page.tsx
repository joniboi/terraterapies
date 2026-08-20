import { Metadata } from "next";
import Hero from "@/components/hero-home";
import BusinessCategories from "@/components/business-categories";
import { getServicesData } from "@/app/lib/getService";
import { getDictionary } from "@/app/lib/getDictionary";

import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import ReviewsSlider from "@/components/reviews-slider";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  // Fetch settings from DB
  const settings = await db.query.siteSettings.findFirst();
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://lotusdebaliythai.com";

  const businessName = settings?.businessName || "Spa Management";
  const taglineObj = settings?.heroTagline as Record<string, string>;
  const tagline =
    taglineObj?.[lang] || taglineObj?.["es"] || "Centro de masajes y bienestar";

  return {
    title: `${businessName} | ${tagline}`,
    description: tagline,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        es: `${baseUrl}/es`,
        ca: `${baseUrl}/ca`,
        en: `${baseUrl}/en`,
      },
    },
  };
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;

  // 1. Fetch Data & Dictionary in parallel
  const [services, dict, activeReviews, settings, dbTreatments] =
    await Promise.all([
      getServicesData(lang),
      getDictionary(lang),
      db
        .select()
        .from(reviews)
        .where(eq(reviews.isActive, true))
        .orderBy(asc(reviews.orderIndex)),
      db.query.siteSettings.findFirst(),
      db.query.treatments.findMany({
        with: {
          category: true,
          serviceGroup: true,
          variants: true,
        },
      }),
    ]);

  const businessName = settings?.businessName || "";
  const personalizedSubtitle = dict.home.reviews.subtitle.replace(
    "{businessName}",
    businessName,
  );

  // Hydrate the Gallery Slides
  const hydratedGallery = (settings?.heroGallery || [])
    .filter((s) => s.isActive && s.treatmentId)
    .map((slide) => {
      let fallbackTitle = "";
      let fallbackSubtitle = "";
      let finalLink = "#";
      let maxDiscount = 0;

      const treatment = dbTreatments.find((t) => t.id === slide.treatmentId);

      if (treatment) {
        fallbackTitle = (treatment.title as any)?.[lang] || "";
        fallbackSubtitle = (treatment.shortDescription as any)?.[lang] || "";
        const parentSlug =
          treatment.category?.slug || treatment.serviceGroup?.slug || "";
        finalLink = `/${lang}/${parentSlug}/${treatment.slug}`;

        const now = new Date();
        treatment.variants.forEach((v) => {
          const promoExpiry = v.promoEndsAt ? new Date(v.promoEndsAt) : null;
          const isPromoActive = !!(
            v.promotionalPrice &&
            (!promoExpiry || now < promoExpiry)
          );

          if (isPromoActive && v.promotionalPrice) {
            const original = Number(v.price);
            const promo = Number(v.promotionalPrice);
            const discountPercent = Math.round(100 - (promo / original) * 100);

            if (discountPercent > maxDiscount) {
              maxDiscount = discountPercent;
            }
          }
        });
      }

      const resolvedTitle =
        (slide.title as any)?.[lang]?.trim() || fallbackTitle;
      const resolvedSubtitle =
        (slide.subtitle as any)?.[lang]?.trim() || fallbackSubtitle;
      const resolvedButtonText =
        (slide.buttonText as any)?.[lang]?.trim() || "Ver Tratamiento";

      return {
        ...slide,
        resolvedTitle,
        resolvedSubtitle,
        resolvedLink: finalLink,
        resolvedButtonText,
        promoDiscount: maxDiscount > 0 ? maxDiscount : null,
      };
    });

  return (
    <>
      <Hero
        dict={dict.home.hero}
        settings={settings}
        hydratedGallery={hydratedGallery}
        lang={lang}
      />

      {/* 2. Pass services directly as groups */}
      <BusinessCategories
        lang={lang}
        groups={services}
        dict={dict.home.categories}
        ctaLabel={dict.common.seeMore}
      />

      {activeReviews.length > 0 && (
        <ReviewsSlider
          lang={lang}
          title={dict.home.reviews.title}
          subtitle={personalizedSubtitle}
          reviews={activeReviews}
        />
      )}
    </>
  );
}

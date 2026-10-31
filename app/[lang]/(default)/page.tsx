// app/[lang]/(default)/page.tsx
import { Metadata } from "next";
import Hero from "@/components/hero-home";
import BusinessCategories from "@/components/business-categories";
import { getServicesData } from "@/app/lib/getService";
import { getDictionary } from "@/app/lib/getDictionary";

import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import ReviewsSlider from "@/components/reviews-slider";
import {
  getActiveCampaignsWithTargets,
  isCampaignEligible,
  resolveVariantPrice,
} from "@/app/lib/campaign-pricing";
import { getLocalizedRoute, routes } from "@/app/lib/routes";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

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

  // 1. Fetch Data, Dictionary & Active Campaigns in parallel
  const [
    services,
    dict,
    activeReviews,
    settings,
    dbTreatments,
    activeCampaigns,
  ] = await Promise.all([
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
    getActiveCampaignsWithTargets(),
  ]);

  const businessName = settings?.businessName || "";
  const personalizedSubtitle = (dict.home.reviews.subtitle || "").replace(
    "{businessName}",
    businessName,
  );

  const now = new Date();

  // 2. Hydrate Gallery Slides (Treatment or Campaign)
  const hydratedGallery = (settings?.heroGallery || [])
    .filter((slide) => {
      if (!slide.isActive) return false;

      const slideType =
        slide.slideType || (slide.treatmentId ? "treatment" : "campaign");

      // Campaign Slide Guard: must have a valid, eligible campaign
      if (slideType === "campaign") {
        if (!slide.campaignId) return false;
        const campaign = activeCampaigns.find((c) => c.id === slide.campaignId);
        return campaign ? isCampaignEligible(campaign, now) : false;
      }

      // Treatment Slide Guard: must have a valid treatment
      return !!slide.treatmentId;
    })
    .map((slide) => {
      const slideType =
        slide.slideType || (slide.treatmentId ? "treatment" : "campaign");

      let fallbackTitle = "";
      let fallbackSubtitle = "";
      let finalLink = "#";
      let maxDiscount = 0;

      if (slideType === "campaign") {
        const campaign = activeCampaigns.find(
          (c) => c.id === slide.campaignId,
        )!;
        fallbackTitle =
          (campaign.headline as any)?.[lang] ||
          (campaign.headline as any)?.es ||
          "";
        fallbackSubtitle =
          (campaign.description as any)?.[lang] ||
          (campaign.description as any)?.es ||
          "";
        finalLink = getLocalizedRoute(routes.gift, lang);
        maxDiscount = Math.round(parseFloat(campaign.discountPercentage));
      } else {
        const treatment = dbTreatments.find((t) => t.id === slide.treatmentId);
        if (treatment) {
          fallbackTitle = (treatment.title as any)?.[lang] || "";
          fallbackSubtitle = (treatment.shortDescription as any)?.[lang] || "";
          const parentSlug =
            treatment.category?.slug || treatment.serviceGroup?.slug || "";
          finalLink = `/${lang}/${parentSlug}/${treatment.slug}`;

          treatment.variants.forEach((v) => {
            const priceResult = resolveVariantPrice(
              v,
              {
                id: treatment.id,
                serviceGroupId: treatment.serviceGroupId,
                categoryId: treatment.categoryId,
              },
              activeCampaigns,
              now,
              lang,
            );

            if (priceResult.discountPercentage > maxDiscount) {
              maxDiscount = priceResult.discountPercentage;
            }
          });
        }
      }

      const resolvedTitle =
        (slide.title as any)?.[lang]?.trim() || fallbackTitle;
      const resolvedSubtitle =
        (slide.subtitle as any)?.[lang]?.trim() || fallbackSubtitle;
      const resolvedButtonText =
        (slide.buttonText as any)?.[lang]?.trim() ||
        (slideType === "campaign"
          ? dict.home.hero.ctaGift || "Ver Oferta"
          : "Ver Tratamiento");

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

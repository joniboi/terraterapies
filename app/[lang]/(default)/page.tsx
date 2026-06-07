import Hero from "@/components/hero-home";
import BusinessCategories from "@/components/business-categories";
import { getServicesData } from "@/app/lib/getService";
import { getDictionary } from "@/app/lib/getDictionary";

import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import ReviewsMarquee from "@/components/reviews-marquee";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;

  // 1. Fetch Data & Dictionary
  // Run DB Queries in parallel for maximum speed
  const [services, dict, activeReviews] = await Promise.all([
    getServicesData(lang),
    getDictionary(lang),
    db
      .select()
      .from(reviews)
      .where(eq(reviews.isActive, true))
      .orderBy(asc(reviews.orderIndex)),
  ]);

  const allCategories = services.navItems.flatMap((item) => item.categories);

  return (
    <>
      <Hero dict={dict.home.hero} />

      {/* 2. Pass props to BusinessCategories */}
      <BusinessCategories
        lang={lang}
        categories={allCategories}
        dict={dict.home.categories}
        ctaLabel={dict.common.seeMore}
      />

      {activeReviews.length > 0 && (
        <ReviewsMarquee
          lang={lang}
          title={dict.home.reviews.title}
          subtitle={dict.home.reviews.subtitle}
          reviews={activeReviews}
          speed="50s"
        />
      )}
    </>
  );
}

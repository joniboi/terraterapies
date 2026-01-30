export const metadata = {
  title: "Home - Simple",
  description: "Page description",
};

import Hero from "@/components/hero-home";
import BusinessCategories from "@/components/business-categories";
import { getServicesData } from "@/app/lib/getService";
import { getDictionary } from "@/app/lib/getDictionary";
/* import FeaturesPlanet from "@/components/features-planet";
import LargeTestimonial from "@/components/large-testimonial";
import Cta from "@/components/cta"; */

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;

  // 1. Fetch Data & Dictionary
  const services = await getServicesData(lang);
  const dict = await getDictionary(lang);

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

      {/* <FeaturesPlanet />
      <LargeTestimonial /> 
      <Cta />*/}
    </>
  );
}

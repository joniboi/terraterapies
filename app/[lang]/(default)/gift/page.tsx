import { getServicesData } from "@/app/lib/getService";
import { getDictionary } from "@/app/lib/getDictionary";
import GiftCatalogClient from "@/components/gift/gift-catalog-client";
import { db } from "@/db";

export default async function GiftPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Reuse your existing high-performance data fetchers
  const [servicesData, dict, settings] = await Promise.all([
    getServicesData(lang),
    getDictionary(lang),
    db.query.siteSettings.findFirst(),
  ]);

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {dict.giftStore?.title || "Regala Bienestar"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {dict.giftStore?.subtitle ||
              "Busca y elige el tratamiento perfecto para regalar."}
          </p>
        </header>

        {/* The Client component handles search and responsive grid */}
        <GiftCatalogClient
          servicesData={servicesData}
          lang={lang}
          dict={dict}
        />
      </div>
    </div>
  );
}

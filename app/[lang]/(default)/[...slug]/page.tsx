import { getServicesData, resolveSlugPath } from "@/app/lib/getService";
import { getDictionary } from "@/app/lib/getDictionary";
import { notFound } from "next/navigation";
import { CategoryHero } from "@/components/categories/categoryHero";
import SubcategoryShowcase from "@/components/categories/subcategory-grid";
import TreatmentDetail from "@/components/treatment-detail";
import { db } from "@/db";

export default async function CatchAllRoute(props: {
  params: Promise<{ lang: string; slug: string[] }>;
}) {
  const { lang, slug } = await props.params;

  // Fetch everything in parallel for maximum performance
  const [data, settings, dict] = await Promise.all([
    getServicesData(lang),
    db.query.siteSettings.findFirst(),
    getDictionary(lang),
  ]);

  const resolved = await resolveSlugPath(lang, slug);

  if (!resolved) {
    notFound();
  }

  // CASE A: Render Group Landing Page
  // (e.g., /masajes -> shows Categories OR /faciales -> shows Treatments)
  if (resolved.type === "group_landing") {
    const { group } = resolved;

    // Determine if this is a Category-based group or a Direct-Treatment group
    const hasCategories = group.categories && group.categories.length > 0;

    // Dynamically map the correct data source for the Showcase
    const showcaseItems = hasCategories
      ? group.categories.map((c) => ({
          title: c.title,
          image: c.image,
          link: `/${lang}/${c.slug}`,
          shortDescription: c.description,
          // Categories don't have options or badges directly
        }))
      : group.treatments.map((t) => ({
          title: t.title,
          image: t.image,
          link: `/${lang}/${group.slug}/${t.slug}`, // e.g., /es/faciales/hydraglow
          shortDescription: t.shortDescription,
          options: t.options,
          promoBadgeText: t.promoBadgeText,
        }));

    return (
      <main>
        <CategoryHero
          title={group.title}
          images={group.heroImages || [{ src: group.image, alt: group.title }]}
        />
        <SubcategoryShowcase
          ctaLabel={dict.common.seeMore}
          items={showcaseItems}
        />
      </main>
    );
  }

  // CASE B: Render Category Landing Page (e.g., /orientales -> shows Treatments)
  if (resolved.type === "category_landing") {
    const { category } = resolved;
    return (
      <main>
        <CategoryHero
          title={category.title}
          images={
            category.heroImages || [
              { src: category.image, alt: category.title },
            ]
          }
        />
        <SubcategoryShowcase
          ctaLabel={dict.common.seeMore}
          items={category.treatments.map((t) => ({
            title: t.title,
            image: t.image,
            link: `/${lang}/${category.slug}/${t.slug}`,
            shortDescription: t.shortDescription,
            options: t.options,
            promoBadgeText: t.promoBadgeText,
          }))}
        />
      </main>
    );
  }

  // CASE C: Render Treatment Detail Page (e.g., /orientales/balines OR /faciales/hydraglow)
  if (resolved.type === "treatment_detail") {
    const { treatment, parent, parentType } = resolved;
    const backgroundImage =
      treatment.backgroundImage || "/images/treatment-detail.jpg";
    const parentSlug = parent.slug;

    return (
      <main>
        <TreatmentDetail
          categorySlug={parentSlug}
          subCategorySlug={treatment.slug}
          title={`${treatment.emoji || "🌸"} ${treatment.title}`}
          backgroundImage={backgroundImage}
          description={treatment.longDescription}
          options={treatment.options}
          lang={lang}
          dict={dict.booking}
          bookingUrl={settings?.freshaUrl}
          businessName={settings?.businessName || ""}
        />
      </main>
    );
  }

  notFound();
}

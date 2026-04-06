import "server-only";
import { db } from "@/db";
import { ServicesData } from "@/types/definitions";
import { unstable_noStore as noStore } from "next/cache";
// 1. Languages definition
const SUPPORTED_LANGS = ["es", "en", "ca"];

/**
 * Helper to extract the correct language string from the DB JSONB object
 */
const getTranslation = (obj: any, lang: string) => {
  if (!obj) return "";
  return obj[lang] || obj["es"] || "";
};

/**
 * The core logic for translating units (min, pax)
 * ported exactly from your original JSON-based code.
 */
function formatDuration(variant: any, lang: string) {
  const unitText: Record<string, any> = {
    es: { min: "minutos", pax: "Persona", paxPlural: "Personas" },
    en: { min: "minutes", pax: "Person", paxPlural: "Persons" },
    ca: { min: "minuts", pax: "Persona", paxPlural: "Persones" },
  };
  const t = unitText[lang] || unitText.es;

  let generatedDuration = "";
  if (variant.unit === "min") {
    generatedDuration = `${variant.duration} ${t.min}`;
  } else if (variant.unit === "pax") {
    generatedDuration =
      variant.duration === 1
        ? `1 ${t.pax}`
        : `${variant.duration} ${t.paxPlural}`;
  }

  const prefix = getTranslation(variant.prefix, lang);
  const suffix = getTranslation(variant.suffix, lang);

  let finalDuration = generatedDuration;
  if (prefix) finalDuration = `${prefix} ${generatedDuration}`;
  if (suffix) finalDuration = `${finalDuration} ${suffix}`;

  return finalDuration;
}

/**
 * REPLACES: getServicesData(lang)
 * Fetches the entire structure from DB and merges it into the ServicesData shape.
 */
// Replace ONLY the getServicesData function inside app/lib/getService.ts

export const getServicesData = async (lang: string): Promise<ServicesData> => {
  noStore();
  // Fetch everything in one go using Drizzle Relational Queries
  const groups = await db.query.serviceGroups.findMany({
    with: {
      categories: {
        with: {
          treatments: {
            with: {
              variants: true,
            },
          },
        },
      },
    },
    orderBy: (groups, { asc }) => [asc(groups.orderIndex)],
  });

  // Reconstruct the exact shape expected by your UI components
  return {
    navItems: groups.map((group) => ({
      id: group.slug,
      label: getTranslation(group.label, lang),
      layout: group.layout as "mega-menu" | "rich-dropdown",
      highlight: group.highlight,
      emoji: group.emoji,
      categories: group.categories.map((cat) => ({
        slug: cat.slug,
        title: getTranslation(cat.title, lang),
        image: cat.image,
        shortDescription: getTranslation(cat.description, lang),
        isFeatured: cat.isFeatured,
        badge: getTranslation(cat.badge, lang),
        heroImages: cat.heroImages,
        showCase: cat.showCase
          ? {
              title: getTranslation(cat.showCase.title, lang),
              description: getTranslation(cat.showCase.description, lang),
            }
          : undefined,
        subcategories: cat.treatments.map((t) => {
          // --- PROMOTIONS LOGIC START ---
          const now = new Date();
          let maxDiscountPercentage = 0;

          const mappedOptions = t.variants
            .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
            .map((v) => {
              const promoExpiry = v.promoEndsAt
                ? new Date(v.promoEndsAt)
                : null;
              // A promo is active if there's a price AND the expiry is either null or in the future
              const isPromoActive = !!(
                v.promotionalPrice &&
                (!promoExpiry || now < promoExpiry)
              );

              let discountPercent = 0;
              if (isPromoActive && v.promotionalPrice) {
                // Calculate percentage: e.g., 65 to 50 = ~23%
                discountPercent = Math.round(
                  100 - (Number(v.promotionalPrice) / Number(v.price)) * 100,
                );
                if (discountPercent > maxDiscountPercentage) {
                  maxDiscountPercentage = discountPercent; // Save the best discount for the badge
                }
              }

              return {
                duration: formatDuration(v, lang),
                price: isPromoActive ? `${v.promotionalPrice}€` : `${v.price}€`,
                originalPrice: isPromoActive ? `${v.price}€` : undefined,
                isPromo: isPromoActive,
                promoEnds: promoExpiry
                  ? promoExpiry.toLocaleDateString(lang)
                  : undefined,
                discountPercent,
              };
            });
          // --- PROMOTIONS LOGIC END ---

          return {
            slug: t.slug,
            title: getTranslation(t.title, lang),
            emoji: t.emoji || "🌸",
            image: t.image,
            backgroundImage:
              t.backgroundImage || "/images/treatment-detail.jpg",
            shortDescription: getTranslation(t.shortDescription, lang),
            longDescription: getTranslation(t.longDescription, lang),
            options: mappedOptions,
            // ADD NEW BADGE FIELDS:
            hasPromo: maxDiscountPercentage > 0,
            promoBadgeText:
              maxDiscountPercentage > 0
                ? `-${maxDiscountPercentage}%`
                : undefined,
          };
        }),
      })),
    })),
  } as ServicesData;
};

/**
 * Generates params for [category] pages for SSG
 */
export async function getCategoryStaticParams() {
  const params: { lang: string; category: string }[] = [];
  for (const lang of SUPPORTED_LANGS) {
    const data = await getServicesData(lang);
    for (const group of data.navItems) {
      for (const cat of group.categories) {
        params.push({ lang, category: cat.slug });
      }
    }
  }
  return params;
}

/**
 * Generates params for [category]/[subcategory] pages for SSG
 */
export async function getSubcategoryStaticParams() {
  const params: { lang: string; category: string; subcategory: string }[] = [];
  for (const lang of SUPPORTED_LANGS) {
    const data = await getServicesData(lang);
    for (const group of data.navItems) {
      for (const cat of group.categories) {
        for (const sub of cat.subcategories) {
          params.push({ lang, category: cat.slug, subcategory: sub.slug });
        }
      }
    }
  }
  return params;
}

/**
 * Fetches a specific treatment and its parent category
 */
export async function getService(
  lang: string,
  categorySlug: string,
  subcategorySlug: string,
) {
  const data = await getServicesData(lang);
  const allCategories = data.navItems.flatMap((item) => item.categories);
  const category = allCategories.find((c) => c.slug === categorySlug);

  if (!category) return null;

  const subcategory = category.subcategories.find(
    (s) => s.slug === subcategorySlug,
  );
  if (!subcategory) return null;

  return { category, subcategory };
}

/**
 * Fetches a specific category and all its treatments
 */
export async function getCategory(lang: string, categorySlug: string) {
  const data = await getServicesData(lang);
  const allCategories = data.navItems.flatMap((item) => item.categories);
  const category = allCategories.find((c) => c.slug === categorySlug);
  return category || null;
}

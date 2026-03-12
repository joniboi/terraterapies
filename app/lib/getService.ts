import "server-only";
import { ServicesData } from "@/types/definitions";

// 2. Define the map of languages to files
const servicesDataLoaders = {
  es: () => import("@/data/es/services.json").then((module) => module.default),
  en: () => import("@/data/en/services.json").then((module) => module.default),
  ca: () => import("@/data/ca/services.json").then((module) => module.default),
};

// Define languages once
const SUPPORTED_LANGS = ["es", "en", "ca"];

/**
 * Generates params for [category] pages
 * Returns: [{ lang: 'es', category: 'orientales' }, ...]
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
 * Generates params for [category]/[subcategory] pages
 * Returns: [{ lang: 'es', category: 'orientales', subcategory: 'thai' }, ...]
 */
export async function getSubcategoryStaticParams() {
  const params: { lang: string; category: string; subcategory: string }[] = [];

  for (const lang of SUPPORTED_LANGS) {
    const data = await getServicesData(lang);
    for (const group of data.navItems) {
      for (const cat of group.categories) {
        for (const sub of cat.subcategories) {
          params.push({
            lang,
            category: cat.slug,
            subcategory: sub.slug,
          });
        }
      }
    }
  }
  return params;
}

// 3. Helper to load the full JSON with the correct Type
export const getServicesData = async (lang: string): Promise<ServicesData> => {
  const loader = servicesDataLoaders[lang as keyof typeof servicesDataLoaders];
  // Fallback to Spanish if lang is invalid
  const rawData = await (loader ? loader() : servicesDataLoaders["es"]());

  // Import the single source of truth for prices
  const pricesData = (await import(`@/data/prices.json`)).default as Record<
    string,
    any
  >;

  // Dictionaries to dynamically translate units
  const unitText: Record<string, any> = {
    es: { min: "minutos", pax: "Persona", paxPlural: "Personas" },
    en: { min: "minutes", pax: "Person", paxPlural: "Persons" },
    ca: { min: "minuts", pax: "Persona", paxPlural: "Persones" },
  };
  const t = unitText[lang] || unitText.es;

  // Merge the prices into the subcategory options
  const mergedNavItems = rawData.navItems.map((navItem: any) => ({
    ...navItem,
    categories: navItem.categories?.map((cat: any) => ({
      ...cat,
      subcategories: cat.subcategories?.map((sub: any) => {
        // Look up the price array using the subcategory slug
        const subcategoryPrices = pricesData[sub.slug] || [];

        const mergedOptions = subcategoryPrices.map(
          (pricing: any, index: number) => {
            // Get any custom language text if it exists (prefix/suffix/tag)
            const localOpt = sub.options?.[index] || {};

            // Generate the base string (e.g., "60 minutos" or "2 Personas")
            let generatedDuration = "";
            if (pricing.unit === "min") {
              generatedDuration = `${pricing.val} ${t.min}`;
            } else if (pricing.unit === "pax") {
              generatedDuration =
                pricing.val === 1
                  ? `1 ${t.pax}`
                  : `${pricing.val} ${t.paxPlural}`;
            }

            // Append any localized prefixes/suffixes (e.g., "Bali Thai Fusion 60 minutos")
            let finalDuration = generatedDuration;
            if (localOpt.prefix)
              finalDuration = `${localOpt.prefix} ${generatedDuration}`;
            if (localOpt.suffix)
              finalDuration = `${generatedDuration} ${localOpt.suffix}`;

            return {
              ...localOpt,
              duration: finalDuration, // Send the fully translated string to the UI
              price: `${pricing.price}€`, // Format the price for the UI
              originalPrice: pricing.originalPrice
                ? `${pricing.originalPrice}€`
                : undefined,
            };
          },
        );

        return {
          ...sub,
          options: mergedOptions.length > 0 ? mergedOptions : undefined,
        };
      }),
    })),
  }));

  const mergedData = { ...rawData, navItems: mergedNavItems };
  return mergedData as ServicesData;
};

/**
 * Returns { category, subcategory } or null
 * UPDATED: Traverses navItems to find the category
 */
export async function getService(
  lang: string,
  categorySlug: string,
  subcategorySlug: string,
) {
  // 1. Load the data (now automatically merged with prices!)
  const data = await getServicesData(lang);

  // 2. FLATTEN the navItems to search across ALL categories
  const allCategories = data.navItems.flatMap((item) => item.categories);

  // 3. Find the category
  const category = allCategories.find((c) => c.slug === categorySlug);
  if (!category) return null;

  // 4. Find the subcategory
  const subcategory = category.subcategories.find(
    (s) => s.slug === subcategorySlug,
  );
  if (!subcategory) return null;

  return { category, subcategory };
}

/**
 * BONUS: You likely need this for the Category Page (e.g. /es/orientales)
 * If you don't have this function yet, you will need it soon.
 */
export async function getCategory(lang: string, categorySlug: string) {
  const data = await getServicesData(lang);

  // Flatten navItems to search everywhere
  const allCategories = data.navItems.flatMap((item) => item.categories);

  const category = allCategories.find((c) => c.slug === categorySlug);

  if (!category) return null;
  return category;
}

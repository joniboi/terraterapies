import "server-only";

// 1. Define the map of languages to files
const servicesData = {
  es: () => import("@/data/es/services.json").then((module) => module.default),
  en: () => import("@/data/en/services.json").then((module) => module.default),
  ca: () => import("@/data/ca/services.json").then((module) => module.default),
};

// 2. Helper to load the full JSON
export const getServicesData = async (lang: string) => {
  const loader = servicesData[lang as keyof typeof servicesData];
  // Fallback to Spanish if lang is invalid
  return loader ? loader() : servicesData["es"]();
};

/**
 * Returns { category, subcategory } or null
 * NOW ASYNC because it fetches data
 */
export async function getService(
  lang: string,
  categorySlug: string,
  subcategorySlug: string
) {
  // 1. Load the data for this language
  const data = await getServicesData(lang);

  // 2. Find the items (logic remains the same)
  const category = data.categories.find((c: any) => c.slug === categorySlug);
  if (!category) return null;

  const subcategory = category.subcategories.find(
    (s: any) => s.slug === subcategorySlug
  );
  if (!subcategory) return null;

  return { category, subcategory };
}

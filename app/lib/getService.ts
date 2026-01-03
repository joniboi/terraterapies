import servicesData from "@/data/services.json";

/**
 * Returns { category, subcategory } or null
 */
export function getService(categorySlug: string, subcategorySlug: string) {
  const category = servicesData.categories.find((c) => c.slug === categorySlug);
  if (!category) return null;
  const subcategory = category.subcategories.find(
    (s) => s.slug === subcategorySlug
  );
  if (!subcategory) return null;
  return { category, subcategory };
}

import servicesData from "@/data/services.json";

export function getCategory(categorySlug: string) {
  return servicesData.categories.find((c) => c.slug === categorySlug) || null;
}

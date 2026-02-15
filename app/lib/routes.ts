// app/lib/routes.ts

/**
 * Centralized route generator for type-safe navigation
 * All routes are relative (without lang prefix) - add lang when using
 */
export const routes = {
  // Static pages
  home: "/",
  contact: "/contact",
  about: "/about",
  faq: "/faq",
  success: "/success", // After payment

  // Dynamic pages from services
  category: (categorySlug: string) => `/${categorySlug}`,
  subcategory: (categorySlug: string, subcategorySlug: string) =>
    `/${categorySlug}/${subcategorySlug}`,
} as const;

/**
 * Get localized route with language prefix
 */
export function getLocalizedRoute(path: string, lang: string): string {
  // Don't add lang prefix to external/absolute URLs
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("/")
  ) {
    // Already has leading slash or is external
    if (path.startsWith("http")) return path;
    return `/${lang}${path}`;
  }
  return `/${lang}/${path}`;
}

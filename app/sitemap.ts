import { MetadataRoute } from "next";
import { db } from "@/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Read the base URL from environment variables to keep it white-labeled
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const langs = ["es", "ca", "en"];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  try {
    // 1. Fetch all Categories and their Treatments in a single relational query
    const categories = await db.query.categories.findMany({
      with: {
        treatments: true,
      },
    });

    // 2. Generate URLs for each supported language
    for (const lang of langs) {
      // A. Add localized Homepage
      sitemapEntries.push({
        url: `${baseUrl}/${lang}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1.0,
      });

      // B. Add localized Static Pages
      const staticPages = ["contact", "about", "faq"];
      staticPages.forEach((page) => {
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/${page}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });

      // C. Add localized Categories & Treatments
      for (const cat of categories) {
        // Add Category page (e.g., /es/orientales)
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });

        // Add Treatment page (e.g., /es/orientales/tailandes)
        for (const treatment of cat.treatments) {
          sitemapEntries.push({
            url: `${baseUrl}/${lang}/${cat.slug}/${treatment.slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
          });
        }
      }
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return sitemapEntries;
}

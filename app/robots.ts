import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://lotusdebaliythai.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Secure your backoffice and API from appearing in public Google search results
      disallow: ["/admin/", "/api/", "/signin/"],
    },
    // Dynamically point Google directly to your new sitemap
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

import { db } from "@/db";

export default async function LocalBusinessSchema() {
  // Fetch the dynamic settings from the database
  const settings = await db.query.siteSettings.findFirst();

  if (!settings) return null;

  // Use the environment variable for domain, or fallback for safety
  const baseUrl = process.env.NEXT_PUBLIC_URL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: settings.businessName,
    image: settings.logoUrl || `${baseUrl}/images/logo.png`,
    "@id": baseUrl,
    url: baseUrl,
    telephone: settings.contactPhone,
    email: settings.contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.streetAddress,
      addressLocality: settings.addressLocality,
      addressRegion: settings.addressRegion || undefined, // Optional field
      postalCode: settings.postalCode,
      addressCountry: settings.addressCountry,
    },
    sameAs: [settings.instagramUrl, settings.facebookUrl].filter(Boolean), // Cleans out empty links
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

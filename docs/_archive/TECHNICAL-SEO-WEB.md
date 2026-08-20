You are asking exactly the right question. Thinking in terms of **"Technical SEO Debt"** is exactly how Senior Software Engineers approach this.

You have built a Ferrari (Next.js, SSG, PostgreSQL), but right now, Google is blind to it because it lacks the "road signs."

Here is your **Webmaster Debt Checklist**. Because of your white-label database architecture, you can implement these beautifully and dynamically.

---

### Debt Item 1: Structured Data (JSON-LD) — _Crucial for Google Maps_

This is the single most important thing you can do for your wife's Google Maps problem.
Structured Data is a hidden script that tells Google: _"Hey, this website and that Google Maps profile are the EXACT same business."_

Since you already have a `siteSettings` table with the address and phone number, you can generate this dynamically without hardcoding!

**Action:** Create a component: `components/seo/local-business-schema.tsx`

```tsx
import { db } from "@/db";

export default async function LocalBusinessSchema() {
  const settings = await db.query.siteSettings.findFirst();

  if (!settings) return null;

  // We build the JSON-LD object dynamically from your database!
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: settings.businessName,
    image: settings.logoUrl || "",
    "@id": "https://lotusdebaliythai.com", // You can use an ENV variable here like process.env.NEXT_PUBLIC_URL
    url: "https://lotusdebaliythai.com",
    telephone: settings.contactPhone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.addressLine1,
      // You might need to parse addressLine2 or just hardcode the City for now
      addressLocality: "Barcelona",
      addressCountry: "ES",
    },
    // Optional: add opening hours here later
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

_Where to put it:_ Drop `<LocalBusinessSchema />` into your `app/[lang]/layout.tsx` so it loads on every page.

---

### Debt Item 2: The `sitemap.xml` (The Map for Googlebot)

Right now, Google has to click links to find your treatments. A sitemap hands Google a list of every single URL on a silver platter.
Next.js makes this incredibly easy.

**Action:** Create a file at `app/sitemap.ts` (Next.js will automatically convert this to an XML file).

```typescript
import { MetadataRoute } from "next";
import { db } from "@/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://lotusdebaliythai.com";
  const langs = ["es", "en", "ca"];
  const urls: MetadataRoute.Sitemap = [];

  // 1. Add Homepage in all languages
  for (const lang of langs) {
    urls.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    });
  }

  // 2. Fetch all treatments from the DB
  const categories = await db.query.categories.findMany({
    with: { treatments: true },
  });

  // 3. Loop through and generate URLs dynamically
  for (const lang of langs) {
    for (const cat of categories) {
      // Add Category Page
      urls.push({
        url: `${baseUrl}/${lang}/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });

      // Add Subcategory (Treatment) Pages
      for (const treatment of cat.treatments) {
        urls.push({
          url: `${baseUrl}/${lang}/${cat.slug}/${treatment.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.9,
        });
      }
    }
  }

  return urls;
}
```

_Result:_ If you go to `yourdomain.com/sitemap.xml`, you will see a massive, perfectly formatted list of all your URLs. Agencies **love** this.

---

### Debt Item 3: `robots.txt` (The Bouncer)

Google looks for this file before it does anything else. If it's missing, Google gets nervous.

**Action:** Create a file at `app/robots.ts`

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://lotusdebaliythai.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Disallow Google from indexing your backoffice!
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

### Debt Item 4: Semantic HTML (H1 vs DIV)

This is a common developer trap. We often use Tailwind to make a `<div className="text-4xl font-bold">` look like a title.
Google doesn't care how big the text is; it only cares about HTML tags. Every page **must** have exactly one `<h1>` tag.

**Action:**
Check your `components/treatment-detail.tsx`. Make sure the title of the massage is wrapped in an `<h1>`.

```tsx
// BAD FOR SEO
<div className="text-3xl font-bold text-gray-900">{title}</div>

// GOOD FOR SEO
<h1 className="text-3xl font-bold text-gray-900">{title}</h1>
```

Check your homepage (`app/[lang]/page.tsx`). Make sure the `siteSettings.heroTagline` is rendered as an `<h1>`.

---

### Debt Item 5: Image "Alt" Text

Google cannot see images. It reads the `alt=""` attribute. If your images are missing this, you lose SEO points.
Because you have a database, make sure you are feeding the treatment name into the Next.js `<Image>` tag!

**Action:** Check your `TreatmentDetail` or `Category` components:

```tsx
<Image
  src={treatment.image}
  alt={`Fotografía de ${treatment.title} en Barcelona`} // <-- SEO GOLD
  fill
  className="object-cover"
/>
```

---

### Summary of your Webmaster Debt:

1. **[ ] Metadata** (What we talked about previously).
2. **[ ] JSON-LD Schema** (Connects your site to Google Maps).
3. **[ ] `sitemap.ts`** (Feeds your dynamic URLs to Google).
4. **[ ] `robots.ts`** (Tells Google where to look).
5. **[ ] Semantic HTML & Alt Text** (Ensures `<h1>` is used for titles and images have descriptions).

**The Final Step:** Once you deploy these 5 things to Coolify, you must log into **Google Search Console**, claim the domain, and submit the sitemap URL. That forces Google to crawl your new, highly-optimized Next.js architecture immediately.

If you do this, your technical SEO is flawless. You can hand the keys back to your wife to focus entirely on getting 5-star reviews!

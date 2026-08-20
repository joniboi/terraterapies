You are absolutely right to protect your white-label architecture! Hardcoding "Lotus de Bali" in the codebase would ruin your setup because it would break Terraterapies.

Let's clear up the confusion about **where** metadata goes and **how** to write it using your database, so the codebase remains 100% neutral.

### 1. Why only in `page.tsx`? Why not in components?

In Next.js, metadata can **only** be generated inside `page.tsx` or `layout.tsx` files.

You cannot put it in `components/treatment-detail.tsx` because that is just a UI component. Google reads the `<head>` of the HTML document before it even looks at the body. Next.js uses the `page.tsx` file to construct the `<head>` of the page on the server before sending it to the browser.

### 2. Does it only go on the Treatment page?

**No! It must go on EVERY `page.tsx` in your app.**

- The **Homepage** (`app/[lang]/page.tsx`) needs it to rank for "Spa en Barcelona".
- The **Category page** (`app/[lang]/[category]/page.tsx`) needs it to rank for "Masajes Orientales".
- The **Treatment page** (`app/[lang]/[category]/[subcategory]/page.tsx`) needs it to rank for "Masaje Tailandés".

---

### How to do it: The White-Label Database Strategy

Because you are using a brilliant database-driven approach, we will fetch `siteSettings.businessName` directly from the database. This means if the code is running Lotus, the title will say "Lotus de Bali". If it's running Terraterapies, it will say "Terraterapies".

Here is the exact code you need to add to your existing files.

#### Step 1: Metadata for the Treatment Page

Open `app/[lang]/(default)/[category]/[subcategory]/page.tsx` and paste this function right below your `generateStaticParams`.

Notice how we use your existing `getService` function and `siteSettings` to keep it entirely dynamic:

```typescript
import { Metadata } from "next";
import { getService } from "@/app/lib/getService"; // Make sure to import this

// ... (your existing imports and PageProps)

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // 1. Await params (Next.js 15 requirement)
  const { lang, category, subcategory } = await params;

  // 2. Fetch the specific treatment and the global site settings in parallel
  const [serviceMatch, settings] = await Promise.all([
    getService(lang, category, subcategory),
    db.query.siteSettings.findFirst(),
  ]);

  // Fallback if not found
  if (!serviceMatch || !serviceMatch.subcategory) {
    return { title: "Not Found" };
  }

  const { subcategory: sub } = serviceMatch;
  const businessName = settings?.businessName || "Spa";

  return {
    // Looks like: "Masaje Tailandés | Lotus de Bali" (Neutral logic!)
    title: `${sub.title} | ${businessName}`,

    // Uses the short description from the DB
    description: sub.shortDescription,

    alternates: {
      // Helps Google understand your multilingual setup
      canonical: `/${lang}/${category}/${subcategory}`,
      languages: {
        es: `/es/${category}/${subcategory}`,
        en: `/en/${category}/${subcategory}`,
        ca: `/ca/${category}/${subcategory}`,
      },
    },
  };
}

// ... (your existing export default async function SubcategoryPage)
```

#### Step 2: Metadata for the Homepage

Now, go to your main landing page: `app/[lang]/(default)/page.tsx`. Add this at the top to dynamically set the Homepage title based on the database:

```typescript
import { Metadata } from "next";
import { db } from "@/db";

// ... (your existing imports)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  // Fetch site settings from DB
  const settings = await db.query.siteSettings.findFirst();

  const businessName = settings?.businessName || "Centro de Masajes";

  // Extract the tagline for the current language
  const taglineObj = settings?.heroTagline as Record<string, string>;
  const tagline =
    taglineObj?.[lang] || taglineObj?.["es"] || "Reserva tu masaje";

  return {
    // Looks like: "Lotus de Bali | El mejor centro de masajes en Barcelona"
    title: `${businessName} | ${tagline}`,
    description: tagline,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        es: `/es`,
        en: `/en`,
        ca: `/ca`,
      },
    },
  };
}
```

---

### Step 3: Future-Proofing for the SEO Agency (Database Update)

Right now, we are dynamically combining the `title` and the `businessName`. This is a massive improvement and will get you indexed properly.

However, eventually, the SEO agency might say:
_"We don't want the title to be 'Masaje Tailandés | Lotus de Bali'. We want the title to be 'Masaje Tailandés en Barcelona - Oferta Especial'."_

Since you hate hardcoding (which is the correct mindset), you will eventually want to add dedicated SEO fields to your database schema so the agency can write whatever they want in the Backoffice.

**When you have time, you can update `db/schema.ts` like this:**

```typescript
export const treatments = pgTable("treatments", {
  // ... your existing fields

  // New SEO fields for the agency to fill out in the backoffice!
  seoTitle: jsonb("seo_title").$type<I18nString>(),
  seoDescription: jsonb("seo_description").$type<I18nString>(),
});
```

If you add that, your `generateMetadata` function can just say:
`title: sub.seoTitle || sub.title + " | " + businessName`

### Summary for this milestone:

1. Paste `generateMetadata` into your Homepage (`page.tsx`).
2. Paste `generateMetadata` into your Category (`[category]/page.tsx`).
3. Paste `generateMetadata` into your Treatment (`[category]/[subcategory]/page.tsx`).
4. Watch Google index your beautiful, white-labeled, multilingual SEO tags!

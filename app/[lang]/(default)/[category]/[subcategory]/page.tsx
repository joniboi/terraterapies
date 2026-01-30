import TreatmentDetail from "@/components/treatment-detail";
import {
  getServicesData,
  getSubcategoryStaticParams,
} from "@/app/lib/getService";
import { getDictionary } from "@/app/lib/getDictionary";
import { Category, Subcategory } from "@/types/definitions";

interface PageProps {
  // In Next.js 15+, params is a Promise
  params: Promise<{
    lang: string;
    category: string;
    subcategory: string;
  }>;
}

export async function generateStaticParams() {
  return getSubcategoryStaticParams();
}

export default async function SubcategoryPage({ params }: PageProps) {
  // 1. Await params
  const { lang, category, subcategory } = await params;

  // 2. Load Data & Dictionary in parallel (Single fetch strategy)
  const [allData, dict] = await Promise.all([
    getServicesData(lang),
    getDictionary(lang),
  ]);

  // 3. Efficient Search: Find Category AND Subcategory without overhead
  // We use a labelled loop to break out of everything the moment we find a match
  let foundCategory: Category | undefined;
  let foundSubcategory: Subcategory | undefined;

  outerLoop: for (const group of allData.navItems) {
    for (const cat of group.categories) {
      if (cat.slug === category) {
        // We found the category, now check its subcategories
        const match = cat.subcategories.find((s) => s.slug === subcategory);

        if (match) {
          foundCategory = cat;
          foundSubcategory = match;
          break outerLoop; // Stop searching immediately
        }
      }
    }
  }

  // 4. Handle Not Found
  if (!foundCategory || !foundSubcategory) {
    return (
      <div className="py-24 text-center text-gray-500">
        {dict.pages.category.notFound} {/* Using dictionary for 404 text */}
      </div>
    );
  }

  // 5. Determine Background Logic
  const backgroundImage =
    foundSubcategory.backgroundImage ?? allData.defaultBackground;

  // 6. Compose title safely
  const composedTitle = [
    foundSubcategory.emoji,
    foundSubcategory.title,
    foundSubcategory.tagline ? `— ${foundSubcategory.tagline}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main>
      <TreatmentDetail
        categorySlug={category}
        subCategorySlug={subcategory}
        title={composedTitle}
        backgroundImage={backgroundImage}
        description={foundSubcategory.longDescription || ""}
        // Ensure options is an array (fallback handled in definitions, but good to be safe)
        options={foundSubcategory.options ?? []}
        lang={lang}
        dict={dict.booking}
      />
    </main>
  );
}

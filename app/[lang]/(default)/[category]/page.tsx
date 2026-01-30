import { getCategoryStaticParams, getServicesData } from "@/app/lib/getService";
import { getDictionary } from "@/app/lib/getDictionary";
import SubcategoryShowcase from "@/components/categories/subcategory-grid"; // Check your path matches your project
import { CategoryHero } from "@/components/categories/categoryHero"; // Check your path matches your project
import { Category } from "@/types/definitions"; // ✅ Use the global type

interface PageProps {
  params: Promise<{
    lang: string;
    category: string;
  }>;
}

export async function generateStaticParams() {
  return getCategoryStaticParams();
}

export default async function CategoryPage({ params }: PageProps) {
  const { lang, category } = await params;

  // 2. Load Data & Dictionary
  const [services, dict] = await Promise.all([
    getServicesData(lang),
    getDictionary(lang),
  ]);

  // 3. Find the specific category efficiently
  // We look through navItems and stop looking as soon as we find it.
  // No flatMap overhead.
  let data: Category | undefined;

  for (const group of services.navItems) {
    const found = group.categories.find((c) => c.slug === category);
    if (found) {
      data = found;
      break; // Stop searching once found
    }
  }

  // 4. Handle Not Found
  if (!data) {
    return (
      <div className="p-20 text-center text-gray-500">
        {dict.pages.category.notFound}
      </div>
    );
  }

  return (
    <main>
      {/* Hero — dynamic */}
      <CategoryHero
        title={data.title}
        // Ensure heroImages exists in JSON or provide fallback
        images={data.heroImages || [{ src: data.image, alt: data.title }]}
      />

      {/* Category description */}
      <div
        className="max-w-4xl mx-auto px-6 text-center py-12"
        data-aos="fade-up"
      >
        <p className="text-gray-600 text-lg">{data.shortDescription}</p>
      </div>

      {/* Subcategories */}
      <SubcategoryShowcase
        ctaLabel={dict.common.seeMore}
        items={data.subcategories.map((s) => ({
          ...s,
          // Handle cases where image might be missing in subcategory logic if needed
          image: s.image || "/images/placeholder.jpg",
          link: `/${lang}/${data!.slug}/${s.slug}`, // data! is safe here because of the check above
        }))}
        title={data.showCase?.title}
        description={data.showCase?.description}
      />
    </main>
  );
}

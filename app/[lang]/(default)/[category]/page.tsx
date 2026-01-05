import { getServicesData } from "@/app/lib/getService"; // Use the helper we made
import { getDictionary } from "@/app/lib/getDictionary";
import SubcategoryShowcase from "@/components/categories/subcategory-grid";
import { CategoryHero } from "@/components/categories/categoryHero";

// 1. Generate Static Params
// We use the 'es' (Spanish) data as the "Master" list of slugs.
// Since slugs are the same across languages, this works for all.
export async function generateStaticParams() {
  const data = await getServicesData("es");

  // Fix "Parameter 'c' implicitly has any type" by defining shape or using any temporarily
  return data.categories.map((c: { slug: string }) => ({
    category: c.slug,
  }));
}

interface PageProps {
  params: Promise<{
    lang: string;
    category: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { lang, category } = await params;

  // 2. Load Data & Dictionary dynamically
  const [services, dict] = await Promise.all([
    getServicesData(lang),
    getDictionary(lang),
  ]);

  // 3. Find the specific category in the correct language
  // We explicitly type 'c' as any here because we know the JSON structure
  const data = services.categories.find((c: any) => c.slug === category);

  // 4. Handle Not Found using Dictionary
  if (!data) {
    return (
      <div className="p-20 text-center">{dict.pages.category.notFound}</div>
    );
  }

  return (
    <main>
      {/* Hero — dynamic */}
      <CategoryHero title={data.title} images={data.heroImages} />

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
        items={data.subcategories.map((s: any) => ({
          ...s,
          // 6. IMPORTANT: Inject the current language into the links
          link: `/${lang}/${data.slug}/${s.slug}`,
        }))}
        title={data.showCase?.title}
        description={data.showCase?.description}
      />
    </main>
  );
}

import { getCategory } from "@/app/lib/getCategory";
import servicesData from "@/data/services.json";
import SubcategoryShowcase from "@/components/categories/subcategory-grid";
import { CategoryHero } from "@/components/categories/categoryHero";

export async function generateStaticParams() {
  return servicesData.categories.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params; // ⬅ required by Next 15
  const data = getCategory(category);

  if (!data) {
    return <div className="p-20 text-center">Categoría no encontrada</div>;
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
        items={data.subcategories.map((s) => ({
          ...s,
          link: `/${data.slug}/${s.slug}`,
        }))}
        title={data.showCase?.title}
        description={data.showCase?.description}
      />
    </main>
  );
}

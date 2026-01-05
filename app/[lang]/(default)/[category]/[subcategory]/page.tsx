import TreatmentDetail from "@/components/treatment-detail";
import { getServicesData } from "@/app/lib/getService";
import { getService } from "@/app/lib/getService";
import { getDictionary } from "@/app/lib/getDictionary";

interface PageProps {
  params: {
    lang: string;
    category: string;
    subcategory: string;
  };
}

export default async function SubcategoryPage({ params }: PageProps) {
  // 1. Await params (Next.js 15 requirement)
  const { lang, category, subcategory } = await params;

  // 2. Fetch the service using the language
  const svc = await getService(lang, category, subcategory);

  if (!svc) {
    return (
      <div className="py-24 text-center">
        Service not found / Servicio no encontrado
      </div>
    );
  }

  const { subcategory: sub } = svc;

  // 3. We also need the "Default Background" from the main JSON
  // Since we are already here, let's grab it efficiently
  // (Or you can return it from getService if you modify that function)
  const allData = await getServicesData(lang);
  const dict = await getDictionary(lang);
  const backgroundImage = sub.backgroundImage ?? allData.defaultBackground;

  // 4. Compose title
  const composedTitle = [
    sub.emoji,
    sub.title,
    sub.tagline ? `— ${sub.tagline}` : null,
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
        description={sub.longDescription}
        options={sub.options ?? []}
        lang={lang}
        dict={dict.booking}
      />
    </main>
  );
}

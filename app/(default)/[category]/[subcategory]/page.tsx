import TreatmentDetail from "@/components/treatment-detail";
import servicesData from "@/data/services.json";
import { getService } from "@/app/lib/getService";

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  // ✅ Await params FIRST
  const { category, subcategory } = await params;

  const svc = getService(category, subcategory);

  if (!svc) {
    return <div className="py-24 text-center">Servicio no encontrado</div>;
  }

  const { subcategory: sub } = svc;

  // ✅ Compose title cleanly
  const composedTitle = [
    sub.emoji,
    sub.title,
    sub.tagline ? `— ${sub.tagline}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const backgroundImage =
    sub.backgroundImage ?? servicesData.defaultBackground;

  return (
    <main>
      <TreatmentDetail
        title={composedTitle}
        backgroundImage={backgroundImage}
        description={sub.longDescription}
        options={sub.options ?? []}
      />
    </main>
  );
}

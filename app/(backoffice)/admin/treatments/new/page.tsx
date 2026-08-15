import { db } from "@/db";
import TreatmentForm from "../_components/treatment-form"; // Adjust path if needed

export default async function NewTreatmentPage() {
  const [allCategories, allGroups] = await Promise.all([
    db.query.categories.findMany(),
    db.query.serviceGroups.findMany({
      orderBy: (serviceGroups, { asc }) => [asc(serviceGroups.orderIndex)],
    }),
  ]);

  // Create an empty shell for the form to use
  const emptyTreatment = {
    serviceGroupId: "",
    categoryId: null,
    slug: "",
    emoji: "💆‍♀️",
    title: { es: "", en: "", ca: "" },
    tagline: { es: "", en: "", ca: "" },
    shortDescription: { es: "", en: "", ca: "" },
    longDescription: { es: "", en: "", ca: "" },
    image: "",
    backgroundImage: "",
    variants: [],
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add New Treatment</h1>
      <TreatmentForm
        initialData={emptyTreatment}
        categories={allCategories}
        groups={allGroups}
      />
    </div>
  );
}

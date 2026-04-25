import { db } from "@/db";
import TreatmentForm from "../_components/treatment-form"; // Adjust path if needed

export default async function NewTreatmentPage() {
  const allCategories = await db.query.categories.findMany();

  // Create an empty shell for the form to use
  const emptyTreatment = {
    categoryId: allCategories[0]?.id || "",
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
      <TreatmentForm initialData={emptyTreatment} categories={allCategories} />
    </div>
  );
}

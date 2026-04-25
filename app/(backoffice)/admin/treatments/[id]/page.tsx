import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { notFound } from "next/navigation";
import TreatmentForm from "../_components/treatment-form";

export default async function EditTreatmentPage(props: {
  params: Promise<{ id: string }>;
}) {
  // In Next.js 15, params is a Promise, so we must await it!
  const params = await props.params;

  // 1. Fetch treatment with its variants
  const treatment = await db.query.treatments.findFirst({
    where: eq(schema.treatments.id, params.id),
    with: { variants: true },
  });

  // 2. Fetch all categories (so she can change a treatment's category if needed)
  const allCategories = await db.query.categories.findMany();

  // If the ID is fake/wrong, show a 404 page
  if (!treatment) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Treatment: {treatment.title?.es}
        </h1>
        <p className="text-gray-500">
          Make changes to descriptions and details.
        </p>
      </div>

      {/* 3. Pass the database data to your Client Form */}
      <TreatmentForm initialData={treatment} categories={allCategories} />
    </div>
  );
}

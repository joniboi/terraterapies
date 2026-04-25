import { db } from "@/db";
import { eq } from "drizzle-orm";
import { categories, serviceGroups } from "@/db/schema";
import { notFound } from "next/navigation";
import CategoryForm from "../_components/category-form";

export default async function EditCategoryPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, params.id),
  });

  const groups = await db.query.serviceGroups.findMany();

  if (!category) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Edit Category: {category.title?.es}
      </h1>
      <CategoryForm initialData={category} groups={groups} />
    </div>
  );
}

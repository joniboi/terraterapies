import { db } from "@/db";
import { eq } from "drizzle-orm";
import { categories, serviceGroups } from "@/db/schema";
import { notFound } from "next/navigation";
import CategoryForm from "../_components/category-form";
import { AdminPage } from "@/components/admin/layout/admin-page";

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
    <AdminPage
      title={`Edit Category: ${category.title?.es}`}
      subtitle="Update translations, images and homepage visibility."
    >
      <CategoryForm initialData={category} groups={groups} />
    </AdminPage>
  );
}

import { db } from "@/db";
import CategoryForm from "../_components/category-form";
import { AdminPage } from "@/components/admin/layout/admin-page";

export default async function NewCategoryPage() {
  const groups = await db.query.serviceGroups.findMany();

  return (
    <AdminPage
      title="Create Category"
      subtitle="Create a new category for your treatments."
    >
      <CategoryForm groups={groups} />
    </AdminPage>
  );
}

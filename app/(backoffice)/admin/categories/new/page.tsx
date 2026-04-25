import { db } from "@/db";
import CategoryForm from "../_components/category-form";

export default async function NewCategoryPage() {
  const groups = await db.query.serviceGroups.findMany();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Category</h1>
      <CategoryForm groups={groups} />
    </div>
  );
}

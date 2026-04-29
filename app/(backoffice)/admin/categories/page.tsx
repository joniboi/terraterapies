import { db } from "@/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminTable, ColumnDef } from "@/components/admin/table/admin-table";
import { AdminHeader } from "@/components/admin/table/admin-header";
import { AdminAction } from "@/components/admin/admin-action";

export default async function CategoriesListPage() {
  const allCategories = await db.query.categories.findMany({
    with: { group: true },
    orderBy: (categories, { asc }) => [asc(categories.orderIndex)],
  });

  // Define how the generic table should render Category rows
  const columns: ColumnDef<(typeof allCategories)[0]>[] = [
    {
      header: "Image",
      render: (cat) => (
        <img
          src={cat.image}
          alt=""
          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
        />
      ),
    },
    {
      header: "Category (ES)",
      render: (cat) => (
        <>
          <div className="font-semibold text-gray-800">
            {cat.title?.es || "Unnamed Category"}
          </div>
          <div className="text-xs text-gray-400 font-mono">{cat.slug}</div>
        </>
      ),
    },
    {
      header: "Parent Group",
      render: (cat) => (
        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium uppercase text-gray-500">
          {cat.group?.label?.es}
        </span>
      ),
    },
    {
      header: "Status",
      render: (cat) =>
        cat.isFeatured ? (
          <span className="text-amber-500 text-sm flex items-center gap-1">
            ⭐ Featured
          </span>
        ) : (
          <span className="text-gray-400 text-sm">Standard</span>
        ),
    },
    {
      header: "Action",
      className: "text-right w-32", // Keeps the column tight to the right
      render: (row) => (
        <div className="flex justify-end gap-2">
          <AdminAction type="edit" href={`/admin/categories/${row.id}`} />
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <AdminHeader
        title="Categories"
        subtitle="Manage families of treatments (e.g., Facials, Oriental)"
        actionLabel="+ Add Category"
        actionHref="/admin/categories/new"
      />
      <AdminTable data={allCategories} columns={columns} />
    </div>
  );
}

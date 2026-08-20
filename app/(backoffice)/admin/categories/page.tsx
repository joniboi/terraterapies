import { db } from "@/db";
import { AdminTable, ColumnDef } from "@/components/admin/table/admin-table";
import { AdminHeader } from "@/components/admin/table/admin-header";
import Image from "next/image";

export default async function CategoriesListPage() {
  const allCategories = await db.query.categories.findMany({
    with: { group: true },
    orderBy: (categories, { asc }) => [asc(categories.orderIndex)],
  });

  const columns: ColumnDef<(typeof allCategories)[0]>[] = [
    {
      header: "Category",
      className: "flex-1 min-w-0",
      render: (cat) => (
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 bg-muted rounded-lg overflow-hidden relative border border-border">
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.slug || ""}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                No Img
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-heading font-bold text-base text-foreground">
              {cat.title?.es || "Unnamed Category"}
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-0.5">
              /{cat.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Parent Group",
      className: "hidden md:flex shrink-0 w-48",
      render: (cat) => (
        <span className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border border-border">
          {cat.group?.label?.es || "No Parent"}
        </span>
      ),
    },
    {
      header: "Status",
      className: "hidden md:flex shrink-0 w-32",
      render: (cat) =>
        cat.isFeatured ? (
          <span className="bg-highlight-background text-highlight border border-highlight-border px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
            ⭐ Featured
          </span>
        ) : (
          <span className="text-muted-foreground text-xs font-medium">
            Standard
          </span>
        ),
    },
    {
      header: "Action",
      className:
        "text-right w-24 shrink-0 text-muted-foreground group-hover:text-primary transition-colors",
      render: () => <>Edit &rarr;</>,
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
      <AdminTable
        data={allCategories}
        columns={columns}
        rowHref={(category) => `/admin/categories/${category.id}`}
      />
    </div>
  );
}

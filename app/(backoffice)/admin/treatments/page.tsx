import { AdminAction } from "@/components/admin/admin-action";
import { AdminHeader } from "@/components/admin/table/admin-header";
import { AdminTable, ColumnDef } from "@/components/admin/table/admin-table";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import Link from "next/link";

export const metadata = {
  title: "Treatments | Admin",
};

export default async function AdminServicesList() {
  // 1. Fetch all data
  const rawTreatments = await db.query.treatments.findMany({
    with: {
      category: {
        with: {
          group: true,
        },
      },
    },
  });

  const treatmentsList = rawTreatments.sort((a, b) => {
    const groupA = a.category.group;
    const groupB = b.category.group;
    const catA = a.category;
    const catB = b.category;

    // RULE 1: Group Priority (Treatments vs Rituals)
    // Keeps Highlighted groups (usually Rituals) at the top
    if (groupA.highlight !== groupB.highlight) {
      return groupB.highlight ? 1 : -1;
    }
    if ((groupA.orderIndex || 0) !== (groupB.orderIndex || 0)) {
      return (groupA.orderIndex || 0) - (groupB.orderIndex || 0);
    }

    // RULE 2: Category Cluster (The grouping you asked for)
    // First by Featured flag, then by OrderIndex, then Alphabetically
    if (catA.isFeatured !== catB.isFeatured) {
      return catB.isFeatured ? 1 : -1;
    }
    if ((catA.orderIndex || 0) !== (catB.orderIndex || 0)) {
      return (catA.orderIndex || 0) - (catB.orderIndex || 0);
    }

    // Alphabetical Category Sort (e.g., 'Orientales' before 'Relajantes')
    const catTitleA = catA.title?.es || "";
    const catTitleB = catB.title?.es || "";
    const catCompare = catTitleA.localeCompare(catTitleB);
    if (catCompare !== 0) return catCompare;

    // RULE 3: Treatment Alphabetical Sort (Inside the Category)
    const titleA = a.title?.es || "";
    const titleB = b.title?.es || "";
    return titleA.localeCompare(titleB);
  });
  const columns: ColumnDef<(typeof treatmentsList)[0]>[] = [
    {
      header: "Treatment (ES)",
      render: (t) => (
        <div className="flex items-center gap-3">
          <span className="text-xl">{t.emoji}</span>
          <span className="font-semibold text-gray-800">
            {t.title?.es || "Unnamed"}
          </span>
        </div>
      ),
    },
    {
      header: "Category",
      render: (t) => (
        <div className="text-sm text-gray-600">
          {t.category?.title?.es}
          {t.category?.isFeatured && (
            <span className="ml-2 text-amber-500" title="Featured">
              ⭐
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Group",
      render: (t) => (
        <div className="text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium uppercase">
            {t.category?.group?.label?.es || "Unknown"}
          </span>
          {t.category?.group?.highlight && (
            <span className="ml-2 text-amber-500" title="Highlighted">
              ⭐
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Action",
      className: "text-right w-32", // Keeps the column tight to the right
      render: (row) => (
        <div className="flex justify-end gap-2">
          <AdminAction type="edit" href={`/admin/treatments/${row.id}`} />
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <AdminHeader
        title="Treatments & Rituals"
        subtitle="Manage individual massages, prices, and promos."
        actionLabel="+ Add New Treatment"
        actionHref="/admin/treatments/new"
      />
      <AdminTable data={treatmentsList} columns={columns} />
    </div>
  );
}

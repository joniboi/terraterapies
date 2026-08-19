import { AdminAction } from "@/components/admin/admin-action";
import { AdminHeader } from "@/components/admin/table/admin-header";
import { AdminTable, ColumnDef } from "@/components/admin/table/admin-table";
import { db } from "@/db";

export const metadata = {
  title: "Treatments | Admin",
};

export default async function AdminServicesList() {
  // 1. Fetch all data with direct relations
  const rawTreatments = await db.query.treatments.findMany({
    with: {
      category: true,
      serviceGroup: true, // <-- Fetch direct serviceGroup relation
    },
  });

  const treatmentsList = rawTreatments.sort((a, b) => {
    const groupA = a.serviceGroup;
    const groupB = b.serviceGroup;
    const catA = a.category;
    const catB = b.category;

    // RULE 1: Group Priority (Masajes vs Rituales, etc.)
    // Keeps Highlighted groups (usually Rituals) at the top
    if (groupA.highlight !== groupB.highlight) {
      return groupB.highlight ? 1 : -1;
    }
    if ((groupA.orderIndex || 0) !== (groupB.orderIndex || 0)) {
      return (groupA.orderIndex || 0) - (groupB.orderIndex || 0);
    }

    // RULE 2: Category Cluster (Optional handling)
    if (catA && catB) {
      // Both have categories -> sort using category configurations
      if (catA.isFeatured !== catB.isFeatured) {
        return catB.isFeatured ? 1 : -1;
      }
      if ((catA.orderIndex || 0) !== (catB.orderIndex || 0)) {
        return (catA.orderIndex || 0) - (catB.orderIndex || 0);
      }

      // Alphabetical Category Sort
      const catTitleA = catA.title?.es || "";
      const catTitleB = catB.title?.es || "";
      const catCompare = catTitleA.localeCompare(catTitleB);
      if (catCompare !== 0) return catCompare;
    } else if (catA && !catB) {
      return -1; // Categorized treatments come before direct treatments
    } else if (!catA && catB) {
      return 1; // Direct treatments come after categorized ones
    }

    // RULE 3: Treatment Alphabetical Sort (Inside the Category or Group)
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
          {t.category?.title?.es || (
            <span className="text-gray-400 italic text-xs bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
              Direct (No Category)
            </span>
          )}
          {t.category?.isFeatured && (
            <span className="ml-2" title="Featured Category">
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
          <span className="bg-muted px-2 py-1 rounded text-xs font-medium uppercase">
            {t.serviceGroup?.label?.es || "Unknown"}
          </span>
          {t.serviceGroup?.highlight && (
            <span className="ml-2 text-amber-500" title="Highlighted Group">
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

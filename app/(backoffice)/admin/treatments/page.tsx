import { AdminHeader } from "@/components/admin/table/admin-header";
import { AdminTable, ColumnDef } from "@/components/admin/table/admin-table";
import { db } from "@/db";

export const metadata = {
  title: "Treatments | Admin",
};

export default async function AdminServicesList() {
  const rawTreatments = await db.query.treatments.findMany({
    with: {
      category: true,
      serviceGroup: true,
    },
  });

  const treatmentsList = rawTreatments.sort((a, b) => {
    const groupA = a.serviceGroup;
    const groupB = b.serviceGroup;
    const catA = a.category;
    const catB = b.category;

    if (groupA.highlight !== groupB.highlight) {
      return groupB.highlight ? 1 : -1;
    }
    if ((groupA.orderIndex || 0) !== (groupB.orderIndex || 0)) {
      return (groupA.orderIndex || 0) - (groupB.orderIndex || 0);
    }

    if (catA && catB) {
      if (catA.isFeatured !== catB.isFeatured) {
        return catB.isFeatured ? 1 : -1;
      }
      if ((catA.orderIndex || 0) !== (catB.orderIndex || 0)) {
        return (catA.orderIndex || 0) - (catB.orderIndex || 0);
      }
      const catTitleA = catA.title?.es || "";
      const catTitleB = catB.title?.es || "";
      const catCompare = catTitleA.localeCompare(catTitleB);
      if (catCompare !== 0) return catCompare;
    } else if (catA && !catB) {
      return -1;
    } else if (!catA && catB) {
      return 1;
    }

    const titleA = a.title?.es || "";
    const titleB = b.title?.es || "";
    return titleA.localeCompare(titleB);
  });

  const columns: ColumnDef<(typeof treatmentsList)[0]>[] = [
    {
      header: "Treatment (ES)",
      className: "flex-1 min-w-0",
      render: (t) => (
        <div className="flex items-center gap-3">
          <span className="text-xl shrink-0 select-none">{t.emoji}</span>
          <span className="font-heading font-bold text-base text-foreground">
            {t.title?.es || "Unnamed"}
          </span>
        </div>
      ),
    },
    {
      header: "Category",
      className: "hidden md:flex shrink-0 w-48",
      render: (t) => (
        <div className="text-sm text-foreground">
          {t.category?.title?.es || (
            <span className="text-muted-foreground italic text-xs bg-secondary border border-border px-2.5 py-0.5 rounded-md">
              Direct (No Category)
            </span>
          )}
          {t.category?.isFeatured && (
            <span className="ml-2 text-highlight" title="Featured Category">
              ⭐
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Group",
      className: "hidden md:flex shrink-0 w-48",
      render: (t) => (
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
          <span className="bg-secondary text-secondary-foreground border border-border px-2.5 py-0.5 rounded-md text-xs font-medium uppercase">
            {t.serviceGroup?.label?.es || "Unknown"}
          </span>
          {t.serviceGroup?.highlight && (
            <span className="text-highlight" title="Highlighted Group">
              ⭐
            </span>
          )}
        </div>
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
        title="Treatments & Rituals"
        subtitle="Manage individual massages, prices, and promos."
        actionLabel="+ Add New Treatment"
        actionHref="/admin/treatments/new"
      />
      <AdminTable
        data={treatmentsList}
        columns={columns}
        rowHref={(treatment) => `/admin/treatments/${treatment.id}`}
      />
    </div>
  );
}

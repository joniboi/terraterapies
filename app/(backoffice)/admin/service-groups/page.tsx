import { db } from "@/db";
import { AdminHeader } from "@/components/admin/table/admin-header";
import { AdminTable, ColumnDef } from "@/components/admin/table/admin-table";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ServiceGroupsPage() {
  // Query all service groups and eager load relations so we can count them
  const groups = await db.query.serviceGroups.findMany({
    orderBy: (groups, { asc }) => [asc(groups.orderIndex)],
    with: {
      categories: true,
      treatments: true,
    },
  });

  const columns: ColumnDef<(typeof groups)[0]>[] = [
    {
      header: "Service Group",
      className: "flex-1 min-w-0",
      render: (group) => (
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          <div className="w-16 h-16 shrink-0 bg-muted rounded-lg overflow-hidden relative border border-border">
            {group.image ? (
              <Image
                src={group.image}
                alt={group.slug}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                No Img
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2 text-foreground">
              {group.emoji && <span>{group.emoji}</span>}
              <span>{group.label?.es || "Unnamed Group"}</span>
              {group.highlight && (
                <span className="text-[10px] uppercase font-bold tracking-wider bg-highlight-background text-highlight border border-highlight-border px-2 py-0.5 rounded-full">
                  Highlighted
                </span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">
              /{group.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Structure",
      className:
        "hidden md:flex flex-col items-end mr-6 text-sm text-muted-foreground text-right shrink-0",
      render: (group) => (
        <>
          <span>
            Layout: <strong className="text-foreground">{group.layout}</strong>
          </span>
          <span>
            Contains:{" "}
            <strong className="text-foreground">
              {group.categories.length}
            </strong>{" "}
            categories,{" "}
            <strong className="text-foreground">
              {group.treatments.length}
            </strong>{" "}
            direct treatments
          </span>
        </>
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
        title="Service Groups"
        subtitle="Manage the top-level structural families of your catalog."
        actionLabel="+ Add Group"
        actionHref="/admin/service-groups/new"
      />
      <AdminTable
        data={groups}
        columns={columns}
        rowHref={(group) => `/admin/service-groups/${group.id}`}
      />
    </div>
  );
}

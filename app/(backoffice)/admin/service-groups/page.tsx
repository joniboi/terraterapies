import { db } from "@/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold">Service Groups</h1>
          <p className="text-muted-foreground mt-1">
            Manage the top-level structural families of your catalog.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/service-groups/new">
            <Plus className="mr-2 size-4" /> New Group
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {groups.map((group) => (
          <Link key={group.id} href={`/admin/service-groups/${group.id}`}>
            <div className="flex items-center p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-sm transition-all group">
              {/* Thumbnail */}
              <div className="w-16 h-16 shrink-0 bg-muted rounded-lg overflow-hidden relative mr-4">
                {group.image ? (
                  <Image
                    src={group.image}
                    alt={group.slug}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    No Img
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                  {group.emoji} {group.label?.es}
                  {group.highlight && (
                    <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Highlighted
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground font-mono">
                  /{group.slug}
                </p>
              </div>

              {/* Hierarchy Stats */}
              <div className="hidden md:flex flex-col items-end mr-6 text-sm text-muted-foreground text-right">
                <span>
                  Layout:{" "}
                  <strong className="text-foreground">{group.layout}</strong>
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
              </div>

              <div className="text-muted-foreground group-hover:text-primary transition-colors">
                Edit &rarr;
              </div>
            </div>
          </Link>
        ))}

        {groups.length === 0 && (
          <div className="text-center p-12 bg-muted/20 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">
              No service groups created yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

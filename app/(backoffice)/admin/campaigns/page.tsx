// app/(backoffice)/admin/campaigns/page.tsx
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { campaignReservations } from "@/db/schema";
import { AdminHeader } from "@/components/admin/table/admin-header";
import { AdminTable, ColumnDef } from "@/components/admin/table/admin-table";
import { getCampaignOperationalStatus } from "@/app/lib/campaign-targeting";
import { CampaignWithRelations } from "@/types/definitions";
import CampaignActionsCell from "./_components/campaign-actions-cell";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  const allCampaigns = (await db.query.campaigns.findMany({
    orderBy: (c, { desc }) => [desc(c.createdAt)],
    with: {
      serviceGroupTargets: { columns: { serviceGroupId: true } },
      categoryTargets: { columns: { categoryId: true } },
      treatmentTargets: { columns: { treatmentId: true } },
    },
  })) as CampaignWithRelations[];

  // Compute active usage (completed sales + active unexpired reservations)
  const usageCounts = await db
    .select({
      campaignId: campaignReservations.campaignId,
      count: sql<number>`count(*)::int`,
    })
    .from(campaignReservations)
    .where(
      sql`${campaignReservations.status} = 'completed' OR (${campaignReservations.status} = 'reserved' AND ${campaignReservations.expiresAt} > now())`,
    )
    .groupBy(campaignReservations.campaignId);

  const countMap = new Map(usageCounts.map((u) => [u.campaignId, u.count]));

  const campaignsWithUsage = allCampaigns.map((c) => ({
    ...c,
    currentPurchases: countMap.get(c.id) || 0,
  }));

  const columns: ColumnDef<CampaignWithRelations>[] = [
    {
      header: "Campaign",
      className: "w-full md:w-64",
      render: (row) => (
        <div>
          <div className="font-semibold text-foreground">{row.name}</div>
          <div className="text-xs text-muted-foreground font-mono">
            slug: {row.slug}
          </div>
        </div>
      ),
    },
    {
      header: "Discount",
      className: "w-28",
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-highlight-background text-highlight-foreground border border-highlight-border">
          {row.discountPercentage}% OFF
        </span>
      ),
    },
    {
      header: "Operational Status",
      className: "w-44",
      render: (row) => {
        const opStatus = getCampaignOperationalStatus({
          isActive: row.isActive,
          startDate: row.startDate,
          endDate: row.endDate,
          maxPurchases: row.maxPurchases,
          currentPurchases: row.currentPurchases,
        });

        return (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${opStatus.className}`}
          >
            {opStatus.label}
          </span>
        );
      },
    },
    {
      header: "Schedule",
      className: "w-52 text-xs text-muted-foreground",
      render: (row) =>
        row.startDate || row.endDate ? (
          <div>
            {row.startDate
              ? new Date(row.startDate).toLocaleDateString()
              : "Open start"}
            {" → "}
            {row.endDate
              ? new Date(row.endDate).toLocaleDateString()
              : "No end"}
          </div>
        ) : (
          <span className="italic">Always active</span>
        ),
    },
    {
      header: "Sales / Quota",
      className: "w-36 text-xs",
      render: (row) => {
        const sold = row.currentPurchases ?? 0;
        const total = row.maxPurchases;
        return (
          <div>
            <div className="font-medium text-foreground">
              {sold} {total ? `/ ${total}` : "(Unlimited)"}
            </div>
            {total && (
              <div className="w-24 bg-muted rounded-full h-1.5 mt-1 overflow-hidden border border-border">
                <div
                  className={`h-full ${sold >= total ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${Math.min(100, (sold / total) * 100)}%` }}
                />
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Targets",
      className: "w-32 text-xs text-muted-foreground",
      render: (row) => {
        const count =
          (row.serviceGroupTargets?.length || 0) +
          (row.categoryTargets?.length || 0) +
          (row.treatmentTargets?.length || 0);
        return count === 0 ? (
          <span className="text-warning font-semibold">No targets</span>
        ) : (
          <span>{count} target rule(s)</span>
        );
      },
    },
    {
      header: "Actions",
      className: "text-right w-40",
      render: (row) => <CampaignActionsCell campaign={row} />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <AdminHeader
        title="Promotional Campaigns"
        subtitle="Configure seasonal discounts, dynamic targets, and purchase quotas."
        actionLabel="+ New Campaign"
        actionHref="/admin/campaigns/new"
      />

      <AdminTable<CampaignWithRelations>
        data={campaignsWithUsage}
        columns={columns}
      />
    </div>
  );
}

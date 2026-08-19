import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { GiftCardActions } from "@/app/(backoffice)/admin/gift-cards/_components/gift-card-actions";
import { AdminHeader } from "@/components/admin/table/admin-header";
import { AdminTable, ColumnDef } from "@/components/admin/table/admin-table";

import { GiftCardStatusFilter } from "./_components/gift-cards-filter";

export const metadata = { title: "Gift Cards Log | Admin" };

export default async function AdminGiftCardsPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const statusFilter = searchParams.status;

  const cards = await db.query.giftCards.findMany({
    where: statusFilter
      ? eq(schema.giftCards.status, statusFilter as any)
      : undefined,
    orderBy: [desc(schema.giftCards.purchasedAt)],
  });

  const columns: ColumnDef<(typeof cards)[0]>[] = [
    {
      header: "Date",
      className: "w-24 shrink-0 text-muted-foreground",
      render: (card) => card.purchasedAt?.toLocaleDateString() || "N/A",
    },
    {
      header: "Usage",
      className: "w-32 shrink-0",
      render: (card) => {
        const isBono = card.totalSessions > 1;
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  card.status === "redeemed"
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "bg-success-background text-success border-success-border"
                }`}
              >
                {card.usedSessions} / {card.totalSessions}
              </span>
            </div>
            {isBono && (
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-wider">
                {card.totalSessions - card.usedSessions} sessions left
              </p>
            )}
          </div>
        );
      },
    },
    {
      header: "Locator",
      className: "w-28 shrink-0",
      render: (card) => (
        <span className="font-mono font-bold text-info bg-info-background border border-info-border px-2.5 py-1 rounded-md text-xs">
          {card.locatorCode}
        </span>
      ),
    },
    {
      header: "Treatment",
      className: "flex-1 min-w-0",
      render: (card) => (
        <>
          <div className="text-sm font-semibold text-foreground">
            {card.treatmentNameSnapshot}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {card.durationSnapshot} — {card.priceSnapshot}€
          </div>
        </>
      ),
    },
    {
      header: "Recipient / Buyer",
      className: "w-48 shrink-0",
      render: (card) => (
        <>
          <div className="text-sm font-medium text-foreground">
            {card.recipientName}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">
            From: {card.buyerName}
          </div>
          <div
            className="text-[10px] text-muted-foreground lowercase truncate max-w-[150px] mt-0.5"
            title={card.buyerEmail}
          >
            {card.buyerEmail}
          </div>
        </>
      ),
    },
    {
      header: "Action",
      className: "text-right w-24 shrink-0",
      render: (card) => <GiftCardActions card={card} />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <AdminHeader
        title="Gift Cards"
        subtitle="View and manage all treatment gift cards"
        actionLabel="+ Create Manual"
        actionHref="/admin/gift-cards/new"
      >
        <GiftCardStatusFilter currentStatus={statusFilter} />
      </AdminHeader>
      <AdminTable data={cards} columns={columns} />
    </div>
  );
}

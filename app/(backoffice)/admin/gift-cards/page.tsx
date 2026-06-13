import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import RedeemButton from "@/app/(backoffice)/admin/gift-cards/_components/redeem-button";
import { AdminHeader } from "@/components/admin/table/admin-header";
import { AdminTable, ColumnDef } from "@/components/admin/table/admin-table";

import { GiftCardStatusFilter } from "./_components/gift-cards-filter";

export const metadata = { title: "Gift Cards Log | Admin" };

export default async function AdminGiftCardsPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const statusFilter = searchParams.status;

  // 1. Fetch cards based on status
  const cards = await db.query.giftCards.findMany({
    // If statusFilter exists, filter by it. If not, don't apply a where clause.
    where: statusFilter
      ? eq(schema.giftCards.status, statusFilter as any)
      : undefined,
    orderBy: [desc(schema.giftCards.purchasedAt)],
  });

  const columns: ColumnDef<(typeof cards)[0]>[] = [
    {
      header: "Date",
      render: (card) => (
        <span className="text-sm text-gray-500">
          {card.purchasedAt?.toLocaleDateString() || "N/A"}
        </span>
      ),
    },
    {
      header: "Usage",
      render: (card) => {
        const isBono = card.totalSessions > 1;
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  card.status === "redeemed"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-success-background text-success"
                }`}
              >
                {card.usedSessions} / {card.totalSessions}
              </span>
            </div>
            {isBono && (
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">
                {card.totalSessions - card.usedSessions} sessions left
              </p>
            )}
          </div>
        );
      },
    },
    {
      header: "Locator",
      render: (card) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">
          {card.locatorCode}
        </span>
      ),
    },
    {
      header: "Treatment",
      render: (card) => (
        <>
          <div className="text-sm font-semibold text-gray-800">
            {card.treatmentNameSnapshot}
          </div>
          <div className="text-xs text-gray-400">
            {card.durationSnapshot} — {card.priceSnapshot}€
          </div>
        </>
      ),
    },
    {
      header: "Recipient",
      render: (card) => (
        <>
          <div className="text-sm text-gray-800">{card.recipientName}</div>
          <div className="text-[10px] text-gray-400 uppercase">
            From: {card.buyerName}
          </div>
        </>
      ),
    },

    {
      header: "Action",
      className: "text-right",
      render: (card) => (
        <div className="flex justify-end">
          {card.status === "valid" ? (
            <RedeemButton
              id={card.id}
              code={card.locatorCode}
              isBono={card.totalSessions > 1}
              remaining={card.totalSessions - card.usedSessions}
            />
          ) : (
            <div className="text-[10px] text-success font-black uppercase tracking-widest">
              Completed {card.redeemedAt?.toLocaleDateString("en-GB")}
            </div>
          )}
        </div>
      ),
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

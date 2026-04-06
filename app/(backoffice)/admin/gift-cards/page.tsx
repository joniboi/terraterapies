import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import RedeemButton from "@/components/admin/redeem-button";

export const metadata = { title: "Gift Cards Log | Admin" };

export default async function AdminGiftCardsPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const statusFilter = searchParams.status || "valid";

  // 1. Fetch cards based on status
  const cards = await db.query.giftCards.findMany({
    where: eq(schema.giftCards.status, statusFilter as any),
    orderBy: [desc(schema.giftCards.purchasedAt)],
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gift Cards Log</h1>

        {/* Status Tabs */}
        <div className="flex bg-gray-200 p-1 rounded-lg">
          <a
            href="/admin/gift-cards?status=valid"
            className={`px-4 py-1.5 rounded-md text-sm font-medium ${statusFilter === "valid" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
          >
            Valid
          </a>
          <a
            href="/admin/gift-cards?status=redeemed"
            className={`px-4 py-1.5 rounded-md text-sm font-medium ${statusFilter === "redeemed" ? "bg-white shadow-sm text-green-600" : "text-gray-500"}`}
          >
            Redeemed
          </a>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-400">
              <th className="p-4 font-bold">Purchase Date</th>
              <th className="p-4 font-bold">Locator</th>
              <th className="p-4 font-bold">Treatment</th>
              <th className="p-4 font-bold">Recipient</th>
              <th className="p-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cards.map((card) => (
              <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm text-gray-500">
                  {/* Add the '?' and a fallback string just in case */}
                  {card.purchasedAt?.toLocaleDateString() || "N/A"}
                </td>
                <td className="p-4">
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {card.locatorCode}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm font-semibold text-gray-800">
                    {card.treatmentNameSnapshot}
                  </div>
                  <div className="text-xs text-gray-400">
                    {card.durationSnapshot} — {card.priceSnapshot}€
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-800">
                    {card.recipientName}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase">
                    From: {card.buyerName}
                  </div>
                </td>
                <td className="p-4 text-right">
                  {card.status === "valid" ? (
                    <RedeemButton id={card.id} code={card.locatorCode} />
                  ) : (
                    <div className="text-[10px] text-green-600 font-bold uppercase">
                      Used {card.redeemedAt?.toLocaleDateString()}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cards.length === 0 && (
          <div className="p-20 text-center text-gray-400 italic">
            No gift cards found for this status.
          </div>
        )}
      </div>
    </div>
  );
}

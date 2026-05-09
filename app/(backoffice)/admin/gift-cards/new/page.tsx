import { db } from "@/db";
import ManualGiftCardForm from "../_components/manual-gift-card-form";
import { AdminHeader } from "@/components/admin/table/admin-header";

export const metadata = { title: "New Gift Card | Admin" };

export default async function NewGiftCardPage() {
  // Load treatments on the server
  const treatments = await db.query.treatments.findMany({
    with: {
      variants: true,
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <AdminHeader
        title="Manual Gift Card"
        subtitle="Generate a card for in-store purchases"
      />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <ManualGiftCardForm treatments={treatments} />
      </div>
    </div>
  );
}

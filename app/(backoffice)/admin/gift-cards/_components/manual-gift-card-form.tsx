"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import AdminFormFooter from "@/components/admin/admin-form-footer";
import * as schema from "@/db/schema";

type TreatmentWithVariants = typeof schema.treatments.$inferSelect & {
  variants: (typeof schema.treatmentVariants.$inferSelect)[];
};

interface GiftCardFormData {
  buyerName: string;
  buyerEmail: string;
  recipientName: string;
  message: string;
  lang: string | null; // Explicitly string, not string | null
  treatmentId: string | null;
  variantId: string | null;
}

export default function ManualGiftCardForm({
  treatments = [],
}: {
  treatments: TreatmentWithVariants[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Unified State following your Category pattern
  const [formData, setFormData] = useState<GiftCardFormData>({
    buyerName: "",
    buyerEmail: "",
    recipientName: "",
    message: "",
    lang: "es",
    treatmentId: "",
    variantId: "",
  });

  // Derived state for selection logic
  const activeT = treatments.find((t) => t.id === formData.treatmentId);
  const activeV = activeT?.variants.find((v) => v.id === formData.variantId);

  const treatmentDisplay = activeT ? activeT.title.es : "Select treatment";
  const variantDisplay = activeV
    ? `${activeV.duration} ${activeV.unit} - ${activeV.price}€`
    : "Select duration";

  async function handleSave() {
    if (!activeT || !activeV)
      return alert("Please select a treatment and variant.");

    setLoading(true);
    try {
      const payload = {
        ...formData,
        treatmentName: activeT.title.es,
        duration: `${activeV.duration} ${activeV.unit}`,
        price: activeV.price,
        sessionsCount: activeV.sessionsCount,
      };

      const res = await fetch("/api/admin/gift-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/gift-cards");
        router.refresh();
      } else {
        alert("Failed to generate gift card.");
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">
          Gift Card Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BUYER INFO */}
          <div className="space-y-2">
            <Label>Buyer Name</Label>
            <Input
              value={formData.buyerName}
              onChange={(e) =>
                setFormData({ ...formData, buyerName: e.target.value })
              }
              placeholder="Full name of person paying"
            />
          </div>

          <div className="space-y-2">
            <Label>Buyer Email</Label>
            <Input
              type="email"
              value={formData.buyerEmail}
              onChange={(e) =>
                setFormData({ ...formData, buyerEmail: e.target.value })
              }
              placeholder="Where to send the PDF"
            />
          </div>

          {/* RECIPIENT INFO */}
          <div className="space-y-2">
            <Label>Recipient Name</Label>
            <Input
              value={formData.recipientName}
              onChange={(e) =>
                setFormData({ ...formData, recipientName: e.target.value })
              }
              placeholder="Name on the gift card"
            />
          </div>

          <div className="space-y-2">
            <Label>PDF Language</Label>
            <Select
              // Fallback to "es" if the value is null or undefined
              value={formData.lang ?? "es"}
              onValueChange={(val) => setFormData({ ...formData, lang: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ca">Català</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Personal Message</Label>
          <Textarea
            rows={3}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            placeholder="Write a dedication..."
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">
          Service Selection
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Treatment</Label>
            <Select
              value={formData.treatmentId ?? ""} // Ensure it falls back to "" if null
              onValueChange={(val) =>
                setFormData({ ...formData, treatmentId: val, variantId: "" })
              }
            >
              <SelectTrigger>
                <SelectValue>{treatmentDisplay}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {treatments.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title.es}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Duration & Price</Label>
            <Select
              value={formData.variantId ?? ""} // Ensure it falls back to "" if null
              onValueChange={(val) =>
                setFormData({ ...formData, variantId: val })
              }
              disabled={!formData.treatmentId}
            >
              <SelectTrigger>
                <SelectValue>{variantDisplay}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {activeT?.variants.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.duration} {v.unit} — {v.price}€
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <AdminFormFooter
        isLoading={loading}
        onSave={handleSave}
        isEdit={false} // Always false as we are only creating
      />
    </div>
  );
}

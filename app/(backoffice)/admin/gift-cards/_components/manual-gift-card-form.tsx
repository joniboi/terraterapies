"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
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
import { FormSection } from "@/components/admin/form-logic/form-section";
import { FormField } from "@/components/admin/form-logic/form-field";
import { FormGrid } from "@/components/admin/form-logic/form-grid";

type TreatmentWithVariants = typeof schema.treatments.$inferSelect & {
  variants: (typeof schema.treatmentVariants.$inferSelect)[];
};

export default function ManualGiftCardForm({
  treatments = [],
}: {
  treatments: TreatmentWithVariants[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    recipientName: "",
    message: "",
    lang: "es",
    treatmentId: "",
    variantId: "",
  });

  const activeT = treatments.find((t) => t.id === formData.treatmentId);
  const activeV = activeT?.variants.find((v) => v.id === formData.variantId);

  async function handleSave() {
    if (!activeT || !activeV) return alert("Select treatment and variant.");
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
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/gift-cards");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      <FormSection title="Gift Card Details">
        <FormGrid cols={2}>
          <FormField label="Buyer Name">
            <Input
              value={formData.buyerName}
              onChange={(e) =>
                setFormData({ ...formData, buyerName: e.target.value })
              }
            />
          </FormField>
          <FormField label="Buyer Email">
            <Input
              type="email"
              value={formData.buyerEmail}
              onChange={(e) =>
                setFormData({ ...formData, buyerEmail: e.target.value })
              }
            />
          </FormField>
          <FormField label="Recipient Name">
            <Input
              value={formData.recipientName}
              onChange={(e) =>
                setFormData({ ...formData, recipientName: e.target.value })
              }
            />
          </FormField>
          <FormField label="PDF Language">
            <Select
              value={formData.lang}
              onValueChange={(val) =>
                setFormData({ ...formData, lang: val || "es" })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español 🇪🇸</SelectItem>
                <SelectItem value="en">English 🇬🇧</SelectItem>
                <SelectItem value="ca">Català 🟦</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </FormGrid>
        <FormField label="Personal Message">
          <Textarea
            rows={3}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            placeholder="Dedication text..."
          />
        </FormField>
      </FormSection>

      <FormSection title="Service Selection">
        <FormGrid cols={2}>
          <FormField label="Treatment">
            <Select
              value={formData.treatmentId || ""}
              onValueChange={(val) =>
                setFormData({
                  ...formData,
                  treatmentId: val || "",
                  variantId: "",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select treatment">
                  {activeT?.title.es}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {treatments.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title.es}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Duration & Price">
            <Select
              value={formData.variantId}
              onValueChange={(val) =>
                setFormData({ ...formData, variantId: val || "" })
              }
              disabled={!formData.treatmentId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration">
                  {activeV
                    ? `${activeV.duration} ${activeV.unit} — ${activeV.price}€`
                    : ""}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {activeT?.variants.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.duration} {v.unit} — {v.price}€
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </FormGrid>
      </FormSection>

      <AdminFormFooter isLoading={loading} onSave={handleSave} isEdit={false} />
    </div>
  );
}

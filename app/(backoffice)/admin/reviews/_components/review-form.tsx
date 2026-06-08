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
import LanguageTabs from "@/components/admin/language-tabs";
import AdminFormFooter from "@/components/admin/admin-form-footer";
import Accordion from "@/components/ui/accordion";

export default function ReviewForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData?.id;

  const [formData, setFormData] = useState({
    authorName: initialData?.authorName || "",
    rating: initialData?.rating || 5,
    isActive: initialData?.isActive ?? true,
    orderIndex: initialData?.orderIndex || 0,
    text: initialData?.text || { es: "", en: "", ca: "" },
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  async function handleSave() {
    if (!formData.authorName || !formData.text.es) {
      alert("Please fill at least the Author Name and Spanish Text.");
      return;
    }

    setLoading(true);
    try {
      const url = isEdit
        ? `/api/admin/reviews/${initialData.id}`
        : `/api/admin/reviews`;
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/reviews");
        router.refresh();
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!isEdit) return;
    if (!confirm("Are you sure you want to delete this review?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${initialData.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/reviews");
        router.refresh();
      }
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      {/* SECTION 1: PRIMARY CONFIGURATION */}
      <div className="bg-background p-6 rounded-xl border border-border shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">
          Review Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Author Name</Label>
            <Input
              value={formData.authorName}
              onChange={(e) =>
                setFormData({ ...formData, authorName: e.target.value })
              }
              placeholder="e.g. Maria G."
            />
            <p className="text-xs text-muted-foreground">
              Use initial for privacy.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Rating (1-5 Stars)</Label>
            <Select
              value={formData.rating.toString()}
              onValueChange={(val) =>
                setFormData({ ...formData, rating: parseInt(val) })
              }
            >
              <SelectTrigger>
                <SelectValue>{formData.rating} Stars</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Stars ⭐⭐⭐⭐⭐</SelectItem>
                <SelectItem value="4">4 Stars ⭐⭐⭐⭐</SelectItem>
                <SelectItem value="3">3 Stars ⭐⭐⭐</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Display Order</Label>
            <Input
              type="number"
              value={formData.orderIndex}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  orderIndex: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className="flex items-center gap-3 pt-4 col-span-full border-t border-border mt-2">
            <input
              type="checkbox"
              className="size-4 rounded border-border text-primary focus:ring-ring"
              id="active"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
            />
            <Label
              htmlFor="active"
              className="text-muted-foreground cursor-pointer"
            >
              Visible on public website
            </Label>
          </div>
        </div>
      </div>

      {/* SECTION 2: TRANSLATED CONTENT */}
      <Accordion
        id="content"
        title="Review Text & Dates (Translations)"
        active={true}
      >
        <LanguageTabs headerText="Translate the review so it reads naturally for all users">
          {(lang) => (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>The Review ({lang.toUpperCase()})</Label>
                <Textarea
                  rows={4}
                  placeholder={`Write the review in ${lang.toUpperCase()}`}
                  value={formData.text[lang] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      text: { ...formData.text, [lang]: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Date of Review</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        </LanguageTabs>
      </Accordion>

      <AdminFormFooter
        isLoading={loading}
        onSave={handleSave}
        onDelete={handleDelete}
        isEdit={!!initialData}
      />
    </div>
  );
}

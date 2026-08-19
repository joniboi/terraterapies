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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogClose,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function ReviewForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
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
      setValidationError(
        "Please fill in at least the Author Name and Spanish Text.",
      );
      return false;
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
        router.refresh();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Save failed", error);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!isEdit) return;
    // Native confirm removed; footer handles the modal confirmation

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
        <h2 className="font-heading text-lg font-bold text-foreground border-b border-border pb-2">
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
        onSaveSuccess={() => router.push("/admin/reviews")}
        onDelete={handleDelete}
        isEdit={!!initialData}
      />

      {/* Validation Warning Alert Dialog */}
      <AlertDialog
        open={!!validationError}
        onOpenChange={(open) => !open && setValidationError(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Required Selection Missing</AlertDialogTitle>
            <AlertDialogDescription>{validationError}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose
              render={
                <Button onClick={() => setValidationError(null)}>OK</Button>
              }
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

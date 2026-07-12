"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ImageUploadField from "@/components/admin/image-upload-field";
import AdminFormFooter from "@/components/admin/admin-form-footer";
import Accordion from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";
import { FormGrid } from "@/components/admin/form-logic/form-grid";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/admin/form-logic/form-section";
import { I18nField } from "@/components/admin/form-logic/i18-field";
import { FormField } from "@/components/admin/form-logic/form-field";

export default function CategoryForm({
  initialData,
  groups,
}: {
  initialData?: any;
  groups: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData?.id;
  // Unified State
  const [formData, setFormData] = useState({
    groupId: initialData?.groupId || "",
    slug: initialData?.slug || "",
    image: initialData?.image || "",
    isFeatured: initialData?.isFeatured || false,
    title: initialData?.title || { es: "", en: "", ca: "" },
    description: initialData?.description || { es: "", en: "", ca: "" },
    badge: initialData?.badge || { es: "", en: "", ca: "" },
    heroImages: initialData?.heroImages || [],
    showCase: initialData?.showCase || { items: [] },
  });

  // HELPER: Updates standard fields
  const updateField = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // HELPER: Updates translation objects
  const updateI18n = (field: string, lang: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...((prev as any)[field] || {}), [lang]: value },
    }));
  };

  const addHeroImage = () => {
    setFormData({
      ...formData,
      heroImages: [...formData.heroImages, { src: "", alt: "" }],
    });
  };

  const removeHeroImage = (index: number) => {
    const newHeros = [...formData.heroImages];
    newHeros.splice(index, 1);
    setFormData({ ...formData, heroImages: newHeros });
  };

  async function handleSave() {
    setLoading(true);
    try {
      const url = isEdit
        ? `/api/admin/categories/${initialData.id}`
        : `/api/admin/categories`;
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/categories");
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
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${initialData.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        const data = await res.text();
        alert(data || "Cannot delete category while it has treatments.");
      }
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      {/* SECTION 1: CONFIGURATION */}
      <FormSection title="Primary Configuration">
        <FormGrid cols={3}>
          <FormField label="Service Group">
            <Select
              value={formData.groupId}
              onValueChange={(v) => updateField("groupId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Group">
                  {groups.find((g) => g.id === formData.groupId)?.label.es}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.label.es}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="URL Slug"
            description="Used for the browser address."
          >
            <Input
              value={formData.slug}
              onChange={(e) =>
                updateField(
                  "slug",
                  e.target.value.toLowerCase().replace(/\s+/g, "-"),
                )
              }
            />
          </FormField>

          <div className="flex items-center gap-3 pt-6">
            <Checkbox
              id="featured"
              checked={formData.isFeatured}
              onCheckedChange={(v) => updateField("isFeatured", !!v)}
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium cursor-pointer"
            >
              Feature on Homepage
            </label>
          </div>
        </FormGrid>
      </FormSection>

      {/* SECTION 2: TRANSLATED CONTENT (No more manual Accordion/Tabs nesting!) */}
      <FormSection title="Content & Messaging">
        <FormGrid cols={2}>
          <I18nField
            label="Category Title"
            value={formData.title}
            onChange={(l, v) => updateI18n("title", l, v)}
          />
          <I18nField
            label="Badge / Mini Promo"
            placeholder="e.g. 10% Off"
            value={formData.badge}
            onChange={(l, v) => updateI18n("badge", l, v)}
          />
        </FormGrid>
        <I18nField
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={(l, v) => updateI18n("description", l, v)}
        />
      </FormSection>

      {/* SECTION 3: MEDIA (Using Accordion for less visual clutter) */}
      <Accordion title="Images & Gallery" active={false}>
        <div className="space-y-8">
          <ImageUploadField
            label="Main Category Image"
            description="The thumbnail used in listings and menus."
            currentImage={formData.image}
            aspectRatioClass="aspect-square max-w-[200px]"
            onUploadSuccess={(url) => updateField("image", url)}
          />

          <hr className="border-border" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold uppercase text-muted-foreground tracking-widest">
                Hero Gallery
              </label>
              <Button
                type="button"
                onClick={addHeroImage}
                variant="soft"
                size="sm-pill"
              >
                <Plus className="size-3" /> Add Hero
              </Button>
            </div>

            <FormGrid cols={2}>
              {formData.heroImages.map((hero: any, index: number) => (
                <div
                  key={index}
                  className="relative p-4 border border-dashed border-border rounded-xl bg-muted/20"
                >
                  <Button
                    onClick={() => removeHeroImage(index)}
                    variant="destructive-soft"
                    size="icon-sm"
                    className="absolute -top-2 -right-2 z-10"
                  >
                    <Trash2 />
                  </Button>
                  <ImageUploadField
                    label={`Hero Image #${index + 1}`}
                    currentImage={hero.src}
                    aspectRatioClass="aspect-video"
                    onUploadSuccess={(url) => {
                      const newHeros = [...formData.heroImages];
                      newHeros[index].src = url;
                      updateField("heroImages", newHeros);
                    }}
                  />
                </div>
              ))}
            </FormGrid>
          </div>
        </div>
      </Accordion>

      <AdminFormFooter
        isLoading={loading}
        onSave={handleSave}
        onDelete={handleDelete}
        isEdit={isEdit}
      />
    </div>
  );
}

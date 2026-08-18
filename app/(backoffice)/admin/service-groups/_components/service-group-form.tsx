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

export default function ServiceGroupForm({
  initialData,
}: {
  initialData?: any;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData?.id;

  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    layout: initialData?.layout || "mega-menu",
    highlight: initialData?.highlight || false,
    emoji: initialData?.emoji || "",
    orderIndex: initialData?.orderIndex || 0,
    image: initialData?.image || "",
    heroImages: initialData?.heroImages || [],

    // Translatable JSON fields
    label: initialData?.label || { es: "", en: "", ca: "" },
    description: initialData?.description || { es: "", en: "", ca: "" },
    badge: initialData?.badge || { es: "", en: "", ca: "" },

    // Nested Translatable JSON
    showCase: initialData?.showCase || {
      title: { es: "", en: "", ca: "" },
      description: { es: "", en: "", ca: "" },
    },
  });

  const updateField = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const updateI18n = (field: string, lang: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...((prev as any)[field] || {}), [lang]: value },
    }));
  };

  const updateShowCaseI18n = (
    subField: "title" | "description",
    lang: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      showCase: {
        ...prev.showCase,
        [subField]: { ...(prev.showCase[subField] || {}), [lang]: value },
      },
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
        ? `/api/admin/service-groups/${initialData.id}`
        : `/api/admin/service-groups`;
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/service-groups");
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
      const res = await fetch(`/api/admin/service-groups/${initialData.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/service-groups");
        router.refresh();
      } else {
        const data = await res.text();
        alert(data || "Cannot delete service group.");
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
      <FormSection
        title="Primary Configuration"
        description="Structural settings for the Service Group."
      >
        <FormGrid cols={3}>
          <FormField
            label="URL Slug"
            description="Used in the browser address."
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

          <FormField label="Menu Layout">
            <Select
              value={formData.layout}
              onValueChange={(v) => updateField("layout", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mega-menu">Mega Menu (Grid)</SelectItem>
                <SelectItem value="rich-dropdown">
                  Rich Dropdown (List)
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Sort Order"
            description="Lower numbers appear first."
          >
            <Input
              type="number"
              value={formData.orderIndex}
              onChange={(e) =>
                updateField("orderIndex", Number(e.target.value))
              }
            />
          </FormField>

          <FormField label="Emoji Icon">
            <Input
              value={formData.emoji}
              onChange={(e) => updateField("emoji", e.target.value)}
              placeholder="e.g. 💆"
            />
          </FormField>

          <div className="flex items-center gap-3 pt-6 md:col-span-2">
            <Checkbox
              id="highlight"
              checked={formData.highlight}
              onCheckedChange={(v) => updateField("highlight", !!v)}
            />
            <label
              htmlFor="highlight"
              className="text-sm font-medium cursor-pointer"
            >
              Highlight this service group (Semantic emphasis)
            </label>
          </div>
        </FormGrid>
      </FormSection>

      {/* SECTION 2: TRANSLATED CONTENT */}
      <FormSection title="Content & Messaging">
        <FormGrid cols={2}>
          <I18nField
            label="Service Group Name"
            value={formData.label}
            onChange={(l, v) => updateI18n("label", l, v)}
          />
          <I18nField
            label="Badge / Promo Tag"
            placeholder="e.g. ✨ Exclusive"
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

      {/* SECTION 3: SHOWCASE CONFIGURATION */}
      <FormSection
        title="Showcase Settings"
        description="Text used inside the category navigation/showcase block."
      >
        <FormGrid cols={2}>
          <I18nField
            label="Showcase Title"
            value={formData.showCase.title}
            onChange={(l, v) => updateShowCaseI18n("title", l, v)}
          />
          <I18nField
            label="Showcase Description"
            type="textarea"
            value={formData.showCase.description}
            onChange={(l, v) => updateShowCaseI18n("description", l, v)}
          />
        </FormGrid>
      </FormSection>

      {/* SECTION 4: MEDIA */}
      <Accordion title="Images & Gallery" active={false}>
        <div className="space-y-8">
          <ImageUploadField
            label="Main Group Image"
            description="The thumbnail used in public listings."
            currentImage={formData.image}
            aspectRatioClass="aspect-video max-w-[400px]"
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

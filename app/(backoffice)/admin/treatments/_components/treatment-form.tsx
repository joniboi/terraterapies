"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import Accordion from "@/components/ui/accordion";
import ImageUploadField from "@/components/admin/image-upload-field";
import LanguageTabs from "@/components/admin/language-tabs";
import AdminFormFooter from "@/components/admin/admin-form-footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormGrid } from "@/components/admin/form-logic/form-grid";
import { FormSection } from "@/components/admin/form-logic/form-section";
import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/admin/form-logic/form-field";
import { Input } from "@/components/ui/input";
import { I18nField } from "@/components/admin/form-logic/i18-field";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const LANGUAGES = [
  { code: "es", label: "ES 🇪🇸" },
  { code: "en", label: "EN 🇬🇧" },
  { code: "ca", label: "CA 🟦" },
] as const;

export default function TreatmentForm({ initialData, categories }: any) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [variants, setVariants] = useState(initialData.variants || []);
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const updateField = (f: string, v: any) =>
    setFormData((p: any) => ({ ...p, [f]: v }));
  const updateI18n = (f: string, l: string, v: string) =>
    setFormData((p: any) => ({ ...p, [f]: { ...p[f], [l]: v } }));

  const isEdit = !!initialData?.id;

  const addVariant = () =>
    setVariants([
      ...variants,
      {
        duration: 60,
        unit: "min",
        price: "60.00",
        sessionsCount: 1,
        prefix: { es: "", ca: "", en: "" },
      },
    ]);
  const updateVariant = (i: number, f: string, v: any) => {
    const newV = [...variants];
    newV[i] = { ...newV[i], [f]: v };
    setVariants(newV);
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  async function handleSave() {
    setLoading(true);
    try {
      const payload = { ...formData, variants };
      const url = isEdit
        ? `/api/admin/treatments/${initialData.id}`
        : `/api/admin/treatments`;

      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/treatments");
        router.refresh();
      }
    } catch (error) {
      console.error("Update failed");
    } finally {
      setLoading(false);
    }
  }

  // 👇 COMPLETED DELETE LOGIC 👇
  async function handleDelete() {
    if (!isEdit) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/treatments/${initialData.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/treatments");
        router.refresh();
      }
    } catch (error) {
      console.error("Delete failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      {/* SECTION 1: PRIMARY CONFIG */}
      <FormSection title="Identity & Placement">
        <FormGrid cols={4}>
          <FormField label="Icon">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                className="h-10 w-full rounded-md border border-input bg-background text-xl hover:bg-muted/50 transition-colors"
              >
                {formData.emoji || "🌸"}
              </button>
              {showEmoji && (
                <div className="absolute z-50 mt-2">
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      updateField("emoji", e.emoji);
                      setShowEmoji(false);
                    }}
                  />
                </div>
              )}
            </div>
          </FormField>

          <FormField label="Category">
            <Select
              value={formData.categoryId}
              onValueChange={(v) => updateField("categoryId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category">
                  {
                    categories.find((c: any) => c.id === formData.categoryId)
                      ?.title.es
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title.es}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="URL Slug"
              description="e.g. 'thai-massage-classic'"
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
          </div>
        </FormGrid>

        <FormGrid cols={2}>
          <I18nField
            label="Treatment Title"
            value={formData.title}
            onChange={(l, v) => updateI18n("title", l, v)}
          />
          <I18nField
            label="Tagline (Catchphrase)"
            value={formData.tagline}
            onChange={(l, v) => updateI18n("tagline", l, v)}
          />
        </FormGrid>
        <I18nField
          label="Short Description"
          type="textarea"
          value={formData.shortDescription}
          onChange={(l, v) => updateI18n("shortDescription", l, v)}
        />
      </FormSection>

      {/* SECTION 2: PRICES & PROMOS */}
      <FormSection
        title="Pricing & Availability"
        action={
          <Button variant="soft" size="sm-pill" onClick={addVariant}>
            <Plus className="mr-1 size-3" /> Add Option
          </Button>
        }
      >
        <div className="space-y-3">
          {variants.map((v: any, i: number) => (
            <div
              key={i}
              className="flex flex-wrap items-end gap-3 p-4 bg-muted/20 border border-border rounded-xl relative group"
            >
              <div className="w-20">
                <FormField label="Mins">
                  <Input
                    type="number"
                    value={v.duration}
                    onChange={(e) =>
                      updateVariant(i, "duration", e.target.value)
                    }
                  />
                </FormField>
              </div>
              <div className="w-24">
                <FormField label="Price €">
                  <Input
                    type="number"
                    className="font-bold text-primary"
                    value={v.price}
                    onChange={(e) => updateVariant(i, "price", e.target.value)}
                  />
                </FormField>
              </div>
              <div className="w-24 p-2 bg-warning-background rounded-lg border border-warning-border">
                <FormField label="Promo €">
                  <Input
                    type="number"
                    value={v.promotionalPrice || ""}
                    onChange={(e) =>
                      updateVariant(i, "promotionalPrice", e.target.value)
                    }
                  />
                </FormField>
              </div>
              <div className="w-40 p-2 bg-highlight-background rounded-lg border border-highlight-border">
                <FormField label="Expires">
                  <Input
                    type="date"
                    value={
                      v.promoEndsAt
                        ? new Date(v.promoEndsAt).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      updateVariant(i, "promoEndsAt", e.target.value)
                    }
                  />
                </FormField>
              </div>
              <div className="flex-1">
                <FormField label="Tag (Optional)">
                  <Input
                    placeholder="e.g. Traditional"
                    value={v.prefix?.es || ""}
                    onChange={(e) =>
                      updateVariant(i, "prefix", {
                        es: e.target.value,
                        ca: e.target.value,
                        en: e.target.value,
                      })
                    }
                  />
                </FormField>
              </div>
              <Button
                variant="destructive-soft"
                size="icon-sm"
                onClick={() => removeVariant(i)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      </FormSection>

      {/* SECTION 3: MARKDOWN CONTENT */}
      <FormSection title="Detailed Experience (Markdown content)">
        <LanguageTabs variant="inline" useShortLabels>
          {(lang) => (
            <div
              data-color-mode="light"
              className="mt-2 border rounded-md overflow-hidden"
            >
              <MDEditor
                value={formData.longDescription[lang] || ""}
                onChange={(val) =>
                  updateI18n("longDescription", lang, val || "")
                }
                preview="edit"
                height={300}
              />
            </div>
          )}
        </LanguageTabs>
      </FormSection>

      {/* SECTION 4: MEDIA */}
      <Accordion title="Images & Banners" active={false}>
        <FormGrid cols={2}>
          <ImageUploadField
            label="Card Image (3:4)"
            currentImage={formData.image}
            onUploadSuccess={(url) => updateField("image", url)}
          />
          <ImageUploadField
            label="Wide Background Banner"
            currentImage={formData.backgroundImage}
            onUploadSuccess={(url) => updateField("backgroundImage", url)}
          />
        </FormGrid>
      </Accordion>

      <AdminFormFooter
        isLoading={loading}
        onSave={handleSave}
        onDelete={handleDelete}
        isEdit={!!initialData.id}
      />
    </div>
  );
}

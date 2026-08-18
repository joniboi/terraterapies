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
import { Switch } from "@/components/ui/switch";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const LANGUAGES = [
  { code: "es", label: "ES 🇪🇸" },
  { code: "en", label: "EN 🇬🇧" },
  { code: "ca", label: "CA 🟦" },
] as const;

export default function TreatmentForm({
  initialData,
  categories,
  groups,
}: any) {
  const router = useRouter();

  // 1. Initialize State with serviceGroupId and isActive
  const [formData, setFormData] = useState({
    ...initialData,
    serviceGroupId: initialData?.serviceGroupId || "",
    categoryId: initialData?.categoryId || null,
    isActive: initialData?.isActive ?? true, // Default to true if not defined
  });
  const [variants, setVariants] = useState(initialData.variants || []);
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const updateField = (f: string, v: any) =>
    setFormData((p: any) => ({ ...p, [f]: v }));
  const updateI18n = (f: string, l: string, v: string) =>
    setFormData((p: any) => ({ ...p, [f]: { ...p[f], [l]: v } }));

  // 2. Handle group change: automatically resets the category selection
  const handleGroupChange = (groupId: string) => {
    setFormData((p: any) => ({
      ...p,
      serviceGroupId: groupId,
      categoryId: null, // Reset category since we changed groups
    }));
  };

  // 3. Dynamically filter categories belonging to the selected Service Group
  const filteredCategories = categories.filter(
    (c: any) => c.groupId === formData.serviceGroupId,
  );

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
          {/* Service Group Selector */}
          <FormField label="Service Group (Required)">
            <Select
              value={formData.serviceGroupId}
              onValueChange={handleGroupChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Group">
                  {
                    groups.find((g: any) => g.id === formData.serviceGroupId)
                      ?.label.es
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {groups.map((g: any) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.label.es}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Dynamic Category Selector */}
          <FormField label="Category (Optional)">
            <Select
              value={formData.categoryId || "none"}
              onValueChange={(v) =>
                updateField("categoryId", v === "none" ? null : v)
              }
              disabled={filteredCategories.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    filteredCategories.length === 0
                      ? "Direct (No Categories)"
                      : "Select Category"
                  }
                >
                  {formData.categoryId
                    ? categories.find((c: any) => c.id === formData.categoryId)
                        ?.title.es
                    : "No Category (Direct)"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  -- No Category (Direct to Group) --
                </SelectItem>
                {filteredCategories.map((c: any) => (
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

          {/* Emoji/Icon Picker */}
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

          <div className="flex items-center justify-between gap-4 p-3 bg-muted/20 border border-border rounded-xl md:col-span-3 h-10 self-end">
            <div className="flex items-center gap-2 leading-none">
              <span className="text-sm font-semibold">
                Visible to Customers
              </span>

              <span className="text-xs text-muted-foreground">
                {formData.isActive ? "Active" : "Hidden"}
              </span>
            </div>

            <Switch
              checked={formData.isActive}
              onCheckedChange={(value) => updateField("isActive", value)}
              aria-label="Visible to Customers"
            />
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
              {/* 1. TIME / DURATION */}
              <div className="w-20 shrink-0">
                <FormField label="Time">
                  <Input
                    type="number"
                    value={v.duration}
                    onChange={(e) =>
                      updateVariant(i, "duration", e.target.value)
                    }
                  />
                </FormField>
              </div>

              {/* 2. UNIT */}
              <div className="w-20 shrink-0">
                <FormField label="Unit">
                  <Select
                    value={v.unit || "min"}
                    onValueChange={(val) => updateVariant(i, "unit", val)}
                  >
                    <SelectTrigger
                      size="sm"
                      className="!min-w-0 w-full h-10 px-2 text-xs"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="min">min</SelectItem>
                      <SelectItem value="pax">pax</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* 3. SESSIONS COUNT */}
              <div className="w-24 shrink-0 p-1.5 bg-info-background rounded-lg border border-info-border">
                <FormField label="Sessions">
                  <Input
                    type="number"
                    min="1"
                    className="bg-background text-center font-bold text-info h-9 px-1"
                    value={v.sessionsCount || 1}
                    onChange={(e) =>
                      updateVariant(
                        i,
                        "sessionsCount",
                        parseInt(e.target.value) || 1,
                      )
                    }
                  />
                </FormField>
              </div>

              {/* 4. PRICE */}
              <div className="w-24 shrink-0">
                <FormField label="Price €">
                  <Input
                    type="number"
                    className="font-bold text-primary"
                    value={v.price}
                    onChange={(e) => updateVariant(i, "price", e.target.value)}
                  />
                </FormField>
              </div>

              {/* 5. PROMO € */}
              <div className="w-24 shrink-0 p-1.5 bg-warning-background rounded-lg border border-warning-border">
                <FormField label="Promo €">
                  <Input
                    type="number"
                    className="h-9 bg-background"
                    value={v.promotionalPrice || ""}
                    onChange={(e) =>
                      updateVariant(i, "promotionalPrice", e.target.value)
                    }
                  />
                </FormField>
              </div>

              {/* 6. PROMO EXPIRED DATE */}
              <div className="w-36 shrink-0 p-1.5 bg-highlight-background rounded-lg border border-highlight-border">
                <FormField label="Expires">
                  <Input
                    type="date"
                    className="h-9 bg-background px-1 text-xs"
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

              {/* 7. TAG / PREFIX */}
              <div className="flex-1 min-w-[140px]">
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

              {/* 8. DELETE */}
              <Button
                variant="destructive-soft"
                size="icon-sm"
                className="mb-1 shrink-0"
                onClick={() => removeVariant(i)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}

          {variants.length === 0 && (
            <p className="text-sm text-muted-foreground italic text-center py-4">
              No price variants added yet. Click "+ Add Option".
            </p>
          )}
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

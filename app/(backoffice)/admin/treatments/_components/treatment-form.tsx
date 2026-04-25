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
  const [isSaving, setIsSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    description: "",
    type: "success" as "success" | "error",
  });

  const isEdit = !!initialData?.id;

  const updateI18n = (lang: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        duration: 60,
        unit: "min",
        price: "60.00",
        prefix: { es: "", ca: "", en: "" },
        suffix: { es: "", ca: "", en: "" },
      },
    ]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  async function handleSave() {
    setIsSaving(true);
    try {
      const payload = { ...formData, variants };
      const url = isEdit
        ? `/api/admin/services/${initialData.id}`
        : `/api/admin/services`;

      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/services");
        router.refresh();
      }
    } catch (error) {
      console.error("Update failed");
    } finally {
      setIsSaving(false);
    }
  }

  // 👇 COMPLETED DELETE LOGIC 👇
  async function handleDelete() {
    if (!isEdit) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/services/${initialData.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/services");
        router.refresh();
      }
    } catch (error) {
      console.error("Delete failed");
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      {/* ROW 1: SPLIT 1/4 & 3/4 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* 1/4 COLUMN: Emoji & Category */}
        <div className="md:col-span-1 bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Icon
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex h-16 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-3xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {formData.emoji || "🌸"}
              </button>
              {showEmojiPicker && (
                <div className="absolute left-0 top-18 z-50 shadow-2xl">
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowEmojiPicker(false)}
                  />
                  <div className="relative z-50">
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setFormData({ ...formData, emoji: e.emoji });
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              className="w-full rounded-lg border-gray-300 text-sm py-2"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            >
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.title.es}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              URL Slug
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 text-sm py-2"
              placeholder="e.g. thai-massage"
              value={formData.slug || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                })
              }
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Unique ID for the link.
            </p>
          </div>
        </div>

        {/* 3/4 COLUMN: Multilingual Title/Tagline */}
        <div className="md:col-span-3">
          {/* IDENTITY & TRANSLATIONS */}
          <LanguageTabs
            headerText="Identity & Translations"
            className="shadow-sm"
          >
            {(lang) => (
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Title
                    </label>
                    <input
                      className="form-input w-full rounded-lg border-gray-300 focus:ring-blue-500 font-semibold"
                      placeholder="Treatment name..."
                      value={formData.title[lang] || ""}
                      onChange={(e) =>
                        updateI18n(lang, "title", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Tagline (Short Summary)
                    </label>
                    <input
                      className="form-input w-full rounded-lg border-gray-300 focus:ring-blue-500"
                      placeholder="A brief catchphrase..."
                      value={formData.tagline[lang] || ""}
                      onChange={(e) =>
                        updateI18n(lang, "tagline", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </LanguageTabs>
        </div>
      </div>

      {/* ROW 2: PRICES (COLLAPSIBLE - Active by default) */}
      <Accordion id="prices-accordion" title="Prices & Durations" active={true}>
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
          <p className="text-xs text-gray-500">
            Configure time and pricing variants for this treatment.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={addVariant}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            + Add Option
          </Button>
        </div>

        <div className="space-y-3">
          {variants.map((v: any, index: number) => (
            <div
              key={index}
              className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200"
            >
              <div className="w-24">
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Time
                </label>
                <input
                  type="number"
                  className="w-full rounded border-gray-300 text-sm py-1"
                  value={v.duration}
                  onChange={(e) =>
                    updateVariant(index, "duration", e.target.value)
                  }
                />
              </div>
              <div className="w-20">
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Unit
                </label>
                <select
                  className="w-full rounded border-gray-300 text-sm py-1"
                  value={v.unit}
                  onChange={(e) => updateVariant(index, "unit", e.target.value)}
                >
                  <option value="min">Mins</option>
                  <option value="pax">Pax</option>
                </select>
              </div>
              <div className="w-24">
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Price (€)
                </label>
                <input
                  type="number"
                  step="1.00"
                  className="w-full rounded border-gray-300 text-sm py-1 font-bold text-blue-700"
                  value={v.price}
                  onChange={(e) =>
                    updateVariant(index, "price", e.target.value)
                  }
                />
              </div>
              {/* 2. PROMOTION FIELDS (New!) */}
              <div className="w-28 bg-amber-50 p-2 rounded-lg border border-amber-100">
                <label className="block text-[10px] uppercase font-bold text-amber-600 mb-1">
                  Promo €
                </label>
                <input
                  type="number"
                  step="1.00"
                  placeholder="None"
                  className="form-input w-full text-sm py-1.5 bg-white border-amber-200"
                  value={v.promotionalPrice || ""}
                  onChange={(e) =>
                    updateVariant(index, "promotionalPrice", e.target.value)
                  }
                />
              </div>

              <div className="w-40 bg-amber-50 p-2 rounded-lg border border-amber-100">
                <label className="block text-[10px] uppercase font-bold text-amber-600 mb-1">
                  Expires On
                </label>
                <input
                  type="date"
                  className="form-input w-full text-sm py-1.5 bg-white border-amber-200"
                  value={
                    v.promoEndsAt
                      ? new Date(v.promoEndsAt).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateVariant(index, "promoEndsAt", e.target.value)
                  }
                />
              </div>

              <div className="flex-1">
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Tag (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Traditional"
                  className="w-full rounded border-gray-300 text-sm py-1"
                  value={v.prefix?.es || ""}
                  onChange={(e) =>
                    updateVariant(index, "prefix", {
                      es: e.target.value,
                      ca: e.target.value,
                      en: e.target.value,
                    })
                  }
                />
              </div>
              <div className="pt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => removeVariant(index)}
                >
                  🗑️
                </Button>
              </div>
            </div>
          ))}
          {variants.length === 0 && (
            <p className="text-sm text-gray-400 italic text-center py-4">
              No prices added yet. Click "+ Add Option".
            </p>
          )}
        </div>
      </Accordion>

      {/* ROW 3: LONG DESCRIPTION (COLLAPSIBLE) */}
      <Accordion
        id="description-accordion"
        title="Long Description (Markdown)"
        active={false}
      >
        <LanguageTabs
          headerText="Edit content detailing the experience."
          useShortLabels
        >
          {(lang) => (
            <div data-color-mode="light" className="p-0">
              <MDEditor
                value={formData.longDescription[lang] || ""}
                onChange={(val) =>
                  updateI18n(lang, "longDescription", val || "")
                }
                preview="edit"
                height={350}
                className="rounded-none border-0"
              />
            </div>
          )}
        </LanguageTabs>
      </Accordion>
      {/* ROW 4: IMAGES & MEDIA (COLLAPSIBLE) */}
      <Accordion id="images-accordion" title="Images & Media" active={false}>
        <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploadField
            label="Card Image"
            description="Used in the grid on the category pages (Portrait)."
            currentImage={formData.image}
            aspectRatioClass="aspect-[3/4] max-w-[250px]"
            onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
          />

          <ImageUploadField
            label="Detail Page Background"
            description="Used as the wide hero banner when reading about the treatment."
            currentImage={formData.backgroundImage}
            aspectRatioClass="aspect-video"
            onUploadSuccess={(url) =>
              setFormData({ ...formData, backgroundImage: url })
            }
          />
        </div>
      </Accordion>
      {/* REUSABLE FLOATING FOOTER */}
      <AdminFormFooter
        isLoading={isSaving}
        onSave={handleSave}
        onDelete={handleDelete}
        isEdit={!!initialData} // If initialData exists, it's an edit, so the Delete button will show
      />
    </div>
  );
}

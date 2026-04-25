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
import ImageUploadField from "@/components/admin/image-upload-field";
import AdminFormFooter from "@/components/admin/admin-form-footer";
import Accordion from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";

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

  const selectedGroup = groups.find((g) => g.id === formData.groupId);
  const displayValue = selectedGroup
    ? selectedGroup.label.es
    : "Select a Group";

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
      {/* SECTION 1: CONFIGURATION (Non-collapsible Card) */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">
          Primary Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Service Group</Label>
            <Select
              value={formData.groupId}
              onValueChange={(val) =>
                setFormData({ ...formData, groupId: val })
              }
            >
              <SelectTrigger>
                <SelectValue>{displayValue}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.label.es}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>URL Slug</Label>
            <Input
              value={formData.slug}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                })
              }
              placeholder="e.g. facials-special"
            />
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input
              type="checkbox"
              className="size-4 rounded border-gray-300 text-blue-600"
              id="featured"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
            />
            <Label htmlFor="featured" className="text-gray-600 cursor-pointer">
              Feature on Homepage
            </Label>
          </div>
        </div>
      </div>

      {/* SECTION 2: TRANSLATED CONTENT (Accordion) */}
      <Accordion id="content" title="Content & Translations" active={true}>
        <LanguageTabs headerText="Manage language specific fields">
          {(lang) => (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Category Title ({lang.toUpperCase()})</Label>
                  <Input
                    value={formData.title[lang] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: { ...formData.title, [lang]: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Badge / Mini Promo ({lang.toUpperCase()})</Label>
                  <Input
                    placeholder="e.g. 10% Off or New"
                    value={formData.badge[lang] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        badge: { ...formData.badge, [lang]: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description ({lang.toUpperCase()})</Label>
                <Textarea
                  rows={3}
                  value={formData.description[lang] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: {
                        ...formData.description,
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
        </LanguageTabs>
      </Accordion>

      {/* SECTION 3: MEDIA (Accordion) */}
      <Accordion id="media" title="Images & Media" active={false}>
        <div className="space-y-8">
          <ImageUploadField
            label="Main Category Image"
            description="The thumbnail used in listings and menus."
            currentImage={formData.image}
            aspectRatioClass="aspect-square max-w-[200px]"
            onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
          />

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Hero Gallery</Label>
                <p className="text-xs text-gray-500">
                  Wide images used for the category header background.
                </p>
              </div>
              <button
                type="button"
                onClick={addHeroImage}
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold hover:bg-blue-100 flex items-center gap-1"
              >
                <Plus className="size-3" /> Add Hero
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.heroImages.map((hero: any, index: number) => (
                <div
                  key={index}
                  className="relative p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50"
                >
                  <button
                    onClick={() => removeHeroImage(index)}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 shadow-sm z-10"
                  >
                    <Trash2 className="size-3" />
                  </button>
                  <ImageUploadField
                    label={`Hero #${index + 1}`}
                    currentImage={hero.src}
                    aspectRatioClass="aspect-video"
                    onUploadSuccess={(url) => {
                      const newHeros = [...formData.heroImages];
                      newHeros[index].src = url;
                      setFormData({ ...formData, heroImages: newHeros });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Accordion>

      {/* FOOTER */}
      <AdminFormFooter
        isLoading={loading}
        onSave={handleSave}
        onDelete={handleDelete}
        isEdit={!!initialData}
      />
    </div>
  );
}

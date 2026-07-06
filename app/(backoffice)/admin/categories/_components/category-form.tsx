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
import { Plus, Trash2 } from "lucide-react";
import { AdminGrid } from "@/components/admin/layout/admin-grid";
import { AdminSection } from "@/components/admin/layout/admin-section";
import { Button } from "@/components/ui/button";

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
    <AdminGrid columns={1} className="max-w-7xl mx-auto">
      {/* SECTION 1: CONFIGURATION (Non-collapsible Card) */}
      <AdminSection
        title="Primary Configuration"
        description="Configure the basic settings for this category"
      >
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

          <div className="space-y-2">
            <Label htmlFor="featured">Homepage</Label>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="size-4 rounded border-gray-300 text-blue-600"
                id="featured"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
              />
            </div>
          </div>
        </div>
      </AdminSection>

      {/* SECTION 2: TRANSLATED CONTENT (Accordion) */}
      <AdminSection
        title="Content"
        description="Manage language specific fields"
      >
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
      </AdminSection>

      {/* SECTION 3: MEDIA (Accordion) */}
      <AdminSection
        title="Images & Media"
        description="Manage category images and media assets"
      >
        <div className="space-y-8">
          <ImageUploadField
            label="Main Category Image"
            description="The thumbnail used in listings and menus."
            currentImage={formData.image}
            aspectRatioClass="aspect-square max-w-[200px]"
            onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Hero Gallery</Label>
                <p className="text-xs text-foreground">
                  Wide images used for the category header background.
                </p>
              </div>
              <Button onClick={addHeroImage} variant="secondary">
                <Plus className="size-4" /> Add Hero
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.heroImages.map((hero: any, index: number) => (
                <AdminSection title={`Hero Image ${index + 1}`} key={index}>
                  <Button
                    onClick={() => removeHeroImage(index)}
                    variant="destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
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
                </AdminSection>
              ))}
            </div>
          </div>
        </div>
      </AdminSection>

      {/* FOOTER */}
      <AdminFormFooter
        isLoading={loading}
        onSave={handleSave}
        onDelete={handleDelete}
        isEdit={!!initialData}
      />
    </AdminGrid>
  );
}

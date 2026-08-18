"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import ImageUploadField from "@/components/admin/image-upload-field";
import { I18nField } from "@/components/admin/form-logic/i18-field";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function HeroGalleryManager({
  slides = [],
  onChange,
  availableTreatments = [],
}: {
  slides: any[];
  onChange: (newSlides: any[]) => void;
  availableTreatments: any[];
}) {
  // Store the ID of the currently active tab
  const [activeTab, setActiveTab] = useState<string>(slides[0]?.id || "");

  const addSlide = () => {
    const newId = Math.random().toString(36).substring(7);
    onChange([
      ...slides,
      {
        id: newId,
        treatmentId: "",
        desktopUrl: "",
        mobileUrl: "",
        title: { es: "", ca: "", en: "" },
        subtitle: { es: "", ca: "", en: "" },
        buttonText: { es: "Ver", ca: "Veure", en: "View" },
        isActive: true,
      },
    ]);
    setActiveTab(newId); // Instantly switch to the new slide
  };

  const updateSlide = (index: number, field: string, value: any) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    onChange(newSlides);
  };

  const updateI18n = (
    index: number,
    field: string,
    lang: string,
    value: string,
  ) => {
    const newSlides = [...slides];
    newSlides[index][field] = { ...newSlides[index][field], [lang]: value };
    onChange(newSlides);
  };

  const removeSlide = (index: number) => {
    const newSlides = slides.filter((_, i) => i !== index);
    onChange(newSlides);
    // If we deleted the active tab, fallback to the first available slide
    if (slides[index].id === activeTab) {
      setActiveTab(newSlides[0]?.id || "");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg border border-border">
        <h3 className="font-semibold">Homepage Dynamic Gallery</h3>
        <p className="text-sm text-muted-foreground">
          Link photos to treatments. The system automatically handles links and
          discount badges.
        </p>
      </div>

      {slides.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground flex flex-col items-center gap-4">
          <p>No slides added yet. The gallery is hidden.</p>
          <Button onClick={addSlide} variant="default" type="button">
            <Plus className="w-4 h-4 mr-2" /> Create First Slide
          </Button>
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full min-w-0"
        >
          {/* 🚀 THE DYNAMIC SCROLLABLE TABS BAR */}
          <div className="flex items-center gap-4 mb-6 w-full">
            {/* The Scrollable Tabs (flex-1 lets it fill the space and overflow) */}
            <div className="flex-1 min-w-0">
              <TabsList scrollable variant="default" className="w-full">
                {slides.map((slide, index) => {
                  const treatmentName = slide.treatmentId
                    ? availableTreatments.find(
                        (t: any) => t.id === slide.treatmentId,
                      )?.title?.es
                    : null;
                  const displayTitle = treatmentName || `Slide ${index + 1}`;

                  return (
                    <TabsTrigger
                      key={slide.id}
                      value={slide.id}
                      className="min-w-[120px]"
                    >
                      <span className="truncate max-w-[160px]">
                        {displayTitle}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* ADD SLIDE BUTTON (Permanently pinned to the right) */}
            <Button
              onClick={addSlide}
              variant="outline"
              size="sm"
              className="shrink-0 rounded-full bg-background shadow-sm border-dashed"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          {/* ... (Keep your existing TabsContent mapping down here) ... */}

          {/* 🚀 THE TAB CONTENT (Only renders the active slide) */}
          {slides.map((slide, index) => (
            <TabsContent
              key={slide.id}
              value={slide.id}
              className="border border-border rounded-xl p-6 bg-background shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {/* SLIDE HEADER & ACTIONS */}
              <div className="flex justify-between items-center border-b border-border pb-4">
                <h4 className="font-bold text-lg text-foreground">
                  Slide Configuration
                </h4>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Status: {slide.isActive ? "Active" : "Hidden"}
                    </span>
                    <Switch
                      checked={slide.isActive}
                      onCheckedChange={(v) => updateSlide(index, "isActive", v)}
                    />
                  </div>
                  <div className="h-4 w-px bg-border" /> {/* Divider */}
                  <Button
                    variant="destructive-soft"
                    size="sm"
                    onClick={() => removeSlide(index)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Slide
                  </Button>
                </div>
              </div>

              {/* 1. WHICH TREATMENT? */}
              <div className="flex flex-col gap-3 p-5 bg-primary/5 rounded-xl border border-primary/20">
                <label className="block text-sm font-bold text-primary">
                  🔗 Which treatment does this promote?
                </label>
                <Select
                  value={slide.treatmentId || ""}
                  onValueChange={(v) => updateSlide(index, "treatmentId", v)}
                >
                  <SelectTrigger className="w-full md:w-1/2 bg-background shadow-sm">
                    <SelectValue placeholder="Select a treatment to link...">
                      {
                        availableTreatments.find(
                          (t: any) => t.id === slide.treatmentId,
                        )?.title?.es
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableTreatments.map((t: any) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title.es || "Unnamed Treatment"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 2. IMAGES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-semibold">
                    Desktop Image (Landscape 16:9)
                  </label>
                  <ImageUploadField
                    currentImage={slide.desktopUrl}
                    aspectRatioClass="aspect-video"
                    onUploadSuccess={(url) =>
                      updateSlide(index, "desktopUrl", url)
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold">
                    Mobile Image (Portrait 3:4)
                  </label>
                  <ImageUploadField
                    currentImage={slide.mobileUrl}
                    aspectRatioClass="aspect-[3/4] max-w-[250px]"
                    onUploadSuccess={(url) =>
                      updateSlide(index, "mobileUrl", url)
                    }
                  />
                </div>
              </div>

              {/* 3. TEXT OVERRIDES */}
              <div className="pt-8 mt-2 border-t border-border">
                <h4 className="font-semibold text-foreground mb-1">
                  Text Overrides (Optional)
                </h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Leave these blank to automatically use the selected
                  treatment's title and description.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <I18nField
                      label="Custom Headline"
                      value={slide.title}
                      onChange={(l, v) => updateI18n(index, "title", l, v)}
                    />
                  </div>
                  <div className="space-y-4">
                    <I18nField
                      label="Custom Subheadline"
                      value={slide.subtitle}
                      onChange={(l, v) => updateI18n(index, "subtitle", l, v)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

// app/(backoffice)/admin/settings/_components/hero-gallery-manager.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Tag, Sparkles } from "lucide-react";
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
  availableCampaigns = [],
}: {
  slides: any[];
  onChange: (newSlides: any[]) => void;
  availableTreatments: any[];
  availableCampaigns?: any[];
}) {
  const [activeTab, setActiveTab] = useState<string>(slides[0]?.id || "");

  const addSlide = () => {
    const newId = Math.random().toString(36).substring(7);
    onChange([
      ...slides,
      {
        id: newId,
        slideType: "treatment",
        treatmentId: "",
        campaignId: "",
        desktopUrl: "",
        mobileUrl: "",
        title: { es: "", ca: "", en: "" },
        subtitle: { es: "", ca: "", en: "" },
        buttonText: { es: "Ver", ca: "Veure", en: "View" },
        isActive: true,
      },
    ]);
    setActiveTab(newId);
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
    if (slides[index].id === activeTab) {
      setActiveTab(newSlides[0]?.id || "");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-xl border border-border">
        <h3 className="font-heading font-semibold text-foreground">
          Homepage Dynamic Gallery
        </h3>
        <p className="text-sm text-muted-foreground">
          Promote individual treatments or seasonal campaigns. The system
          automatically handles links, discount badges, and fallback marketing
          text.
        </p>
      </div>

      {slides.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-border rounded-xl text-muted-foreground flex flex-col items-center gap-4">
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
          {/* TABS BAR */}
          <div className="flex items-center gap-4 mb-6 w-full">
            <div className="flex-1 min-w-0">
              <TabsList scrollable variant="default" className="w-full">
                {slides.map((slide, index) => {
                  const slideType =
                    slide.slideType ||
                    (slide.treatmentId ? "treatment" : "campaign");

                  let displayTitle = `Slide ${index + 1}`;
                  if (slideType === "campaign" && slide.campaignId) {
                    const c = availableCampaigns.find(
                      (item) => item.id === slide.campaignId,
                    );
                    displayTitle = c
                      ? `🔥 ${c.name}`
                      : `Campaign Slide ${index + 1}`;
                  } else if (slide.treatmentId) {
                    const t = availableTreatments.find(
                      (item) => item.id === slide.treatmentId,
                    );
                    displayTitle =
                      t?.title?.es || `Treatment Slide ${index + 1}`;
                  }

                  return (
                    <TabsTrigger
                      key={slide.id}
                      value={slide.id}
                      className="min-w-[130px]"
                    >
                      <span className="truncate max-w-[170px]">
                        {displayTitle}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <Button
              onClick={addSlide}
              variant="outline"
              size="sm"
              className="shrink-0 rounded-full bg-background shadow-xs border-dashed"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          {/* TAB CONTENT */}
          {slides.map((slide, index) => {
            const slideType =
              slide.slideType || (slide.treatmentId ? "treatment" : "campaign");
            const selectedCampaign = availableCampaigns.find(
              (c) => c.id === slide.campaignId,
            );

            return (
              <TabsContent
                key={slide.id}
                value={slide.id}
                className="border border-border rounded-xl p-6 bg-card shadow-xs space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                {/* HEADER & ACTIONS */}
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
                        onCheckedChange={(v) =>
                          updateSlide(index, "isActive", v)
                        }
                      />
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <Button
                      variant="destructive-soft"
                      size="sm"
                      onClick={() => removeSlide(index)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Slide
                    </Button>
                  </div>
                </div>

                {/* 1. SLIDE TARGET TYPE: TREATMENT OR CAMPAIGN */}
                <div className="p-5 bg-muted/30 rounded-xl border border-border space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Promotes
                      </label>
                      <Select
                        value={slideType}
                        onValueChange={(val: "treatment" | "campaign") => {
                          updateSlide(index, "slideType", val);
                          if (val === "treatment")
                            updateSlide(index, "campaignId", "");
                          if (val === "campaign")
                            updateSlide(index, "treatmentId", "");
                        }}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="treatment">
                            💆 Specific Treatment
                          </SelectItem>
                          <SelectItem value="campaign">
                            🔥 Promotional Campaign
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* SELECT SPECIFIC TREATMENT */}
                    {slideType === "treatment" && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Target Treatment
                        </label>
                        <Select
                          value={slide.treatmentId || ""}
                          onValueChange={(v) =>
                            updateSlide(index, "treatmentId", v)
                          }
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select treatment...">
                              {
                                availableTreatments.find(
                                  (t) => t.id === slide.treatmentId,
                                )?.title?.es
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {availableTreatments.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.title.es || "Unnamed Treatment"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* SELECT SPECIFIC CAMPAIGN */}
                    {slideType === "campaign" && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Target Campaign
                        </label>
                        <Select
                          value={slide.campaignId || ""}
                          onValueChange={(v) =>
                            updateSlide(index, "campaignId", v)
                          }
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select campaign...">
                              {selectedCampaign?.name}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {availableCampaigns.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name} ({c.discountPercentage}% OFF)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* CAMPAIGN DEFAULT TEXT PREVIEW */}
                  {slideType === "campaign" && selectedCampaign && (
                    <div className="p-3 bg-card border border-border rounded-lg text-xs space-y-1">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />{" "}
                        Default Campaign Content (Automatic Fallback):
                      </div>
                      <div className="text-muted-foreground">
                        <strong>Headline:</strong>{" "}
                        {selectedCampaign.headline?.es || "No default headline"}
                      </div>
                      <div className="text-muted-foreground">
                        <strong>Description:</strong>{" "}
                        {selectedCampaign.description?.es ||
                          "No default description"}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. IMAGES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">
                      Desktop Hero Image (Panoramic)
                    </label>
                    <ImageUploadField
                      currentImage={slide.desktopUrl}
                      uploadType="hero-desktop"
                      aspectRatioClass="aspect-video"
                      onUploadSuccess={(url) =>
                        updateSlide(index, "desktopUrl", url)
                      }
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">
                      Mobile Image (Portrait 3:4)
                    </label>
                    <ImageUploadField
                      currentImage={slide.mobileUrl}
                      uploadType="hero-mobile"
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
                    Leave these blank to automatically display the{" "}
                    {slideType === "campaign" ? "campaign's" : "treatment's"}{" "}
                    default headline and description.
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
            );
          })}
        </Tabs>
      )}
    </div>
  );
}

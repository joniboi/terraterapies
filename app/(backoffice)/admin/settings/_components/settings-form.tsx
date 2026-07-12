"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ImageUploadField from "@/components/admin/image-upload-field";
import { Plus, Trash2 } from "lucide-react";
import { FormSection } from "@/components/admin/form-logic/form-section";
import { FormGrid } from "@/components/admin/form-logic/form-grid";
import { FormField } from "@/components/admin/form-logic/form-field";
import { I18nField } from "@/components/admin/form-logic/i18-field";

const DAY_OPTIONS = [
  { value: 1, label: "Monday / Lunes" },
  { value: 2, label: "Tuesday / Martes" },
  { value: 3, label: "Wednesday / Miércoles" },
  { value: 4, label: "Thursday / Jueves" },
  { value: 5, label: "Friday / Viernes" },
  { value: 6, label: "Saturday / Sábado" },
  { value: 7, label: "Sunday / Domingo" },
  { value: 8, label: "Holidays / Festivos" },
];

export default function SettingsForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);

  // HELPERS
  const updateField = (f: string, v: any) =>
    setFormData((p: any) => ({ ...p, [f]: v }));
  const updateI18n = (f: string, l: string, v: string) =>
    setFormData((p: any) => ({ ...p, [f]: { ...p[f], [l]: v } }));

  // ARRAY HELPERS (Partners & Schedules)
  const addItem = (field: string, template: any) =>
    updateField(field, [...formData[field], template]);
  const removeItem = (field: string, index: number) => {
    const list = [...formData[field]];
    list.splice(index, 1);
    updateField(field, list);
  };
  const updateItem = (
    field: string,
    index: number,
    subField: string,
    value: any,
  ) => {
    const list = [...formData[field]];
    list[index][subField] = value;
    updateField(field, list);
  };

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Settings saved!");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-24 max-w-7xl mx-auto">
      <Tabs defaultValue="location" className="w-full">
        <TabsList
          variant="underline"
          className="mb-8 w-full justify-start border-b border-border"
        >
          <TabsTrigger value="location">Business & Location</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="links">Links & Partners</TabsTrigger>
          <TabsTrigger value="content">Content & Media</TabsTrigger>
        </TabsList>

        {/* TAB 1: LOCATION */}
        <TabsContent value="location">
          <FormSection title="Core Contact Information">
            <FormGrid cols={2}>
              <FormField label="Business Name">
                <Input
                  value={formData.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                />
              </FormField>
              <FormField label="Contact Email">
                <Input
                  value={formData.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                />
              </FormField>
              <FormField label="Phone / WhatsApp">
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => updateField("contactPhone", e.target.value)}
                />
              </FormField>
              <FormField label="Google Maps URL">
                <Input
                  value={formData.mapsLink}
                  onChange={(e) => updateField("mapsLink", e.target.value)}
                />
              </FormField>
              <FormField label="Address Line 1">
                <Input
                  value={formData.addressLine1}
                  onChange={(e) => updateField("addressLine1", e.target.value)}
                />
              </FormField>
              <FormField label="City, Province, Zip">
                <Input
                  value={formData.addressLine2}
                  onChange={(e) => updateField("addressLine2", e.target.value)}
                />
              </FormField>
            </FormGrid>
          </FormSection>
        </TabsContent>

        {/* TAB 2: SCHEDULE */}
        <TabsContent value="schedule">
          <FormSection
            title="Opening Hours"
            action={
              <Button
                variant="soft"
                size="sm-pill"
                onClick={() =>
                  addItem("schedules", { startDay: 1, endDay: 5, hours: "" })
                }
              >
                <Plus className="size-3 mr-1" /> Add Line
              </Button>
            }
          >
            <div className="space-y-4">
              {formData.schedules.map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-muted/20 p-4 rounded-xl border border-border grid grid-cols-1 md:grid-cols-[180px_180px_1fr_auto] items-end gap-4 relative group"
                >
                  <FormField label="From">
                    <Select
                      value={String(item.startDay)}
                      onValueChange={(v) =>
                        updateItem(
                          "schedules",
                          index,
                          "startDay",
                          parseInt(v || "0"),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {
                            DAY_OPTIONS.find((d) => d.value === item.startDay)
                              ?.label
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {DAY_OPTIONS.map((d) => (
                          <SelectItem key={d.value} value={String(d.value)}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="To (Optional)">
                    <Select
                      value={String(item.endDay || 0)}
                      onValueChange={(v) =>
                        updateItem(
                          "schedules",
                          index,
                          "endDay",
                          parseInt(v || "0"),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {DAY_OPTIONS.find((d) => d.value === item.endDay)
                            ?.label || "None"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">-- Single Day --</SelectItem>
                        {DAY_OPTIONS.map((d) => (
                          <SelectItem key={d.value} value={String(d.value)}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <div className="flex-1">
                    <FormField label="Hours">
                      <Input
                        placeholder="09:00 - 21:00"
                        value={item.hours}
                        onChange={(e) =>
                          updateItem(
                            "schedules",
                            index,
                            "hours",
                            e.target.value,
                          )
                        }
                      />
                    </FormField>
                  </div>
                  <Button
                    variant="destructive-soft"
                    size="icon-sm"
                    onClick={() => removeItem("schedules", index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          </FormSection>
        </TabsContent>

        {/* TAB 3: LINKS & PARTNERS */}
        <TabsContent value="links" className="space-y-6">
          <FormSection title="Social Media">
            <FormGrid cols={3}>
              <FormField label="Booking Link (Fresha)">
                <Input
                  value={formData.freshaUrl}
                  onChange={(e) => updateField("freshaUrl", e.target.value)}
                />
              </FormField>
              <FormField label="Facebook">
                <Input
                  value={formData.facebookUrl}
                  onChange={(e) => updateField("facebookUrl", e.target.value)}
                />
              </FormField>
              <FormField label="Instagram">
                <Input
                  value={formData.instagramUrl}
                  onChange={(e) => updateField("instagramUrl", e.target.value)}
                />
              </FormField>
            </FormGrid>
          </FormSection>

          <FormSection
            title="Collaborations"
            action={
              <Button
                variant="soft"
                size="sm-pill"
                onClick={() => addItem("partners", { name: "", url: "" })}
              >
                <Plus className="size-3 mr-1" /> Add Partner
              </Button>
            }
          >
            <FormGrid cols={2}>
              {formData.partners.map((partner: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 items-end bg-muted/20 p-4 rounded-xl border border-border"
                >
                  <div className="flex-1">
                    <FormField label="Brand Name">
                      <Input
                        value={partner.name}
                        onChange={(e) =>
                          updateItem("partners", index, "name", e.target.value)
                        }
                      />
                    </FormField>
                  </div>
                  <div className="flex-1">
                    <FormField label="URL">
                      <Input
                        value={partner.url}
                        onChange={(e) =>
                          updateItem("partners", index, "url", e.target.value)
                        }
                      />
                    </FormField>
                  </div>
                  <Button
                    variant="destructive-soft"
                    size="icon-sm"
                    onClick={() => removeItem("partners", index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </FormGrid>
          </FormSection>
        </TabsContent>

        {/* TAB 4: CONTENT & MEDIA */}
        <TabsContent value="content" className="space-y-6">
          <FormSection title="Marketing Copy">
            <I18nField
              label="Hero Tagline"
              value={formData.heroTagline}
              onChange={(l, v) => updateI18n("heroTagline", l, v)}
            />
            <I18nField
              label="About Us Text"
              type="textarea"
              rows={6}
              value={formData.aboutUsText}
              onChange={(l, v) => updateI18n("aboutUsText", l, v)}
            />
          </FormSection>

          <FormSection title="Visual Assets">
            <FormGrid cols={4}>
              <FormField label="Brand Logo">
                <ImageUploadField
                  currentImage={formData.logoUrl}
                  aspectRatioClass="aspect-video"
                  onUploadSuccess={(url) => updateField("logoUrl", url)}
                />
              </FormField>
              <FormField label="Favicon">
                <ImageUploadField
                  currentImage={formData.faviconUrl}
                  aspectRatioClass="aspect-square max-w-[80px]"
                  onUploadSuccess={(url) => updateField("faviconUrl", url)}
                />
              </FormField>
              <FormField label="About Image">
                <ImageUploadField
                  currentImage={formData.aboutImage}
                  aspectRatioClass="aspect-[3/4]"
                  onUploadSuccess={(url) => updateField("aboutImage", url)}
                />
              </FormField>
              <FormField label="Gift Card Background">
                <ImageUploadField
                  currentImage={formData.pdfBackgroundUrl}
                  aspectRatioClass="aspect-video"
                  onUploadSuccess={(url) =>
                    updateField("pdfBackgroundUrl", url)
                  }
                />
              </FormField>
            </FormGrid>
          </FormSection>
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-0 left-0 right-0 md:left-64 p-4 bg-background border-t border-border z-50 flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="px-8">
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}

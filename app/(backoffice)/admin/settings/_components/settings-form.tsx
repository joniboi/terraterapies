"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LanguageTabs from "@/components/admin/language-tabs";
import ImageUploadField from "@/components/admin/image-upload-field";
import { Plus, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // <-- IMPORTED BUTTON
import { I18nString } from "@/db/schema";

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

  const [formData, setFormData] = useState({
    businessName: initialData?.businessName || "",
    contactEmail: initialData?.contactEmail || "",
    contactPhone: initialData?.contactPhone || "",
    addressLine1: initialData?.addressLine1 || "",
    addressLine2: initialData?.addressLine2 || "",
    mapsLink: initialData?.mapsLink || "",
    facebookUrl: initialData?.facebookUrl || "",
    instagramUrl: initialData?.instagramUrl || "",
    freshaUrl: initialData?.freshaUrl || "",
    partners: initialData?.partners || [],
    schedules: initialData?.schedules || [],
    heroTagline: initialData?.heroTagline || { es: "", en: "", ca: "" },
    aboutUsText: initialData?.aboutUsText || { es: "", en: "", ca: "" },
    aboutImage: initialData?.aboutImage || "",
    logoUrl: initialData?.logoUrl || "",
    faviconUrl: initialData?.faviconUrl || "",
    pdfBackgroundUrl: initialData?.pdfBackgroundUrl || "",
  });

  // --- Helpers for Arrays ---
  const addPartner = () => {
    setFormData({
      ...formData,
      partners: [...formData.partners, { name: "", url: "" }],
    });
  };
  const updatePartner = (
    index: number,
    field: "name" | "url",
    value: string,
  ) => {
    const newPartners = [...formData.partners];
    newPartners[index][field] = value;
    setFormData({ ...formData, partners: newPartners });
  };
  const removePartner = (index: number) => {
    const newPartners = [...formData.partners];
    newPartners.splice(index, 1);
    setFormData({ ...formData, partners: newPartners });
  };

  const addSchedule = () => {
    setFormData({
      ...formData,
      // Default to Monday (1) to Friday (5)
      schedules: [...formData.schedules, { startDay: 1, endDay: 5, hours: "" }],
    });
  };
  const updateSchedule = (
    index: number,
    field: "startDay" | "endDay" | "hours",
    value: any,
  ) => {
    const newSchedules = [...formData.schedules];
    newSchedules[index][field] = value;
    setFormData({ ...formData, schedules: newSchedules });
  };
  const updateScheduleHours = (index: number, value: string) => {
    const newSchedules = [...formData.schedules];
    newSchedules[index].hours = value;
    setFormData({ ...formData, schedules: newSchedules });
  };
  const removeSchedule = (index: number) => {
    const newSchedules = [...formData.schedules];
    newSchedules.splice(index, 1);
    setFormData({ ...formData, schedules: newSchedules });
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
        alert("Settings saved successfully!");
        router.refresh();
      } else alert("Failed to save settings.");
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-24 max-w-7xl mx-auto">
      <Tabs defaultValue="location" className="w-full">
        {/* TAB NAVIGATION */}
        <TabsList
          variant="underline"
          className="mb-6 w-full justify-start overflow-x-auto"
        >
          <TabsTrigger value="location">Business & Location</TabsTrigger>
          <TabsTrigger value="schedule">Schedule / Horarios</TabsTrigger>
          <TabsTrigger value="links">Links & Partners</TabsTrigger>
          <TabsTrigger value="content">Content & Media</TabsTrigger>
        </TabsList>

        {/* TAB 1: LOCATION */}
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Business & Location Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Phone / WhatsApp</Label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Google Maps Link</Label>
                <Input
                  value={formData.mapsLink}
                  onChange={(e) =>
                    setFormData({ ...formData, mapsLink: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Address Line 1 (Street)</Label>
                <Input
                  value={formData.addressLine1}
                  onChange={(e) =>
                    setFormData({ ...formData, addressLine1: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Address Line 2 (City & Zip)</Label>
                <Input
                  value={formData.addressLine2}
                  onChange={(e) =>
                    setFormData({ ...formData, addressLine2: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: SCHEDULE */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Opening Hours</CardTitle>
                <Button
                  type="button"
                  onClick={addSchedule}
                  variant="soft"
                  size="sm-pill"
                >
                  <Plus /> Add Schedule Line
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.schedules.map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-muted/30 p-5 rounded-lg border border-border relative"
                >
                  <Button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    variant="destructive-soft"
                    size="icon-sm"
                    className="absolute top-3 right-3"
                  >
                    <Trash2 />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 pr-8">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground font-bold">
                        From Day
                      </Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
                        value={item.startDay || 1}
                        onChange={(e) =>
                          updateSchedule(
                            index,
                            "startDay",
                            parseInt(e.target.value),
                          )
                        }
                      >
                        {DAY_OPTIONS.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground font-bold">
                        To Day (Optional)
                      </Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
                        value={item.endDay || 0}
                        onChange={(e) =>
                          updateSchedule(
                            index,
                            "endDay",
                            parseInt(e.target.value),
                          )
                        }
                      >
                        <option value={0}>-- None (Single Day) --</option>
                        {DAY_OPTIONS.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground font-bold">
                        Hours
                      </Label>
                      <Input
                        placeholder="09:30 - 21:30"
                        value={item.hours}
                        onChange={(e) =>
                          updateSchedule(index, "hours", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.schedules.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No schedules added yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: LINKS & PARTNERS */}
        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media & Booking</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Booking Link</Label>
                <Input
                  value={formData.freshaUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, freshaUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input
                  value={formData.facebookUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, facebookUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input
                  value={formData.instagramUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, instagramUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Collaborations & Partners</CardTitle>
                <Button
                  type="button"
                  onClick={addPartner}
                  variant="soft"
                  size="sm-pill"
                >
                  <Plus /> Add Partner
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.partners.map((partner: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 items-center bg-muted/30 p-4 rounded-lg border border-border"
                >
                  <div className="flex-1 space-y-2">
                    <Label>Brand Name</Label>
                    <Input
                      value={partner.name}
                      onChange={(e) =>
                        updatePartner(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Website URL</Label>
                    <Input
                      value={partner.url}
                      onChange={(e) =>
                        updatePartner(index, "url", e.target.value)
                      }
                    />
                  </div>

                  {/* CLEAN TRASH BUTTON HERE */}
                  <Button
                    type="button"
                    onClick={() => removePartner(index)}
                    variant="destructive-soft"
                    size="icon-sm"
                    className="mt-6"
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              {formData.partners.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No partners added yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: CONTENT & MEDIA */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Text</CardTitle>
            </CardHeader>
            <CardContent>
              <LanguageTabs headerText="Manage translatable marketing text">
                {(lang) => (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Hero Tagline ({lang.toUpperCase()})</Label>
                      <Input
                        value={formData.heroTagline[lang] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            heroTagline: {
                              ...formData.heroTagline,
                              [lang]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>About Us Text ({lang.toUpperCase()})</Label>
                      <Textarea
                        rows={6}
                        value={formData.aboutUsText[lang] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aboutUsText: {
                              ...formData.aboutUsText,
                              [lang]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </LanguageTabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visual Assets</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 bg-muted/30 p-4 rounded-lg border border-border">
                <Label className="text-base font-semibold">Brand Logo</Label>
                <ImageUploadField
                  label=""
                  currentImage={formData.logoUrl}
                  aspectRatioClass="aspect-video max-w-[200px]"
                  onUploadSuccess={(url) =>
                    setFormData({ ...formData, logoUrl: url })
                  }
                />
              </div>
              <div className="space-y-2 bg-muted/30 p-4 rounded-lg border border-border">
                <Label className="text-base font-semibold">Favicon</Label>
                <ImageUploadField
                  label=""
                  currentImage={formData.faviconUrl}
                  aspectRatioClass="aspect-square max-w-[80px]"
                  onUploadSuccess={(url) =>
                    setFormData({ ...formData, faviconUrl: url })
                  }
                />
              </div>
              <div className="space-y-2 bg-muted/30 p-4 rounded-lg border border-border">
                <Label className="text-base font-semibold">
                  About Us Image
                </Label>
                <ImageUploadField
                  label=""
                  currentImage={formData.aboutImage}
                  aspectRatioClass="aspect-[3/4] max-w-[200px]"
                  onUploadSuccess={(url) =>
                    setFormData({ ...formData, aboutImage: url })
                  }
                />
              </div>
              <div className="space-y-2 bg-muted/30 p-4 rounded-lg border border-border md:col-span-2">
                <Label className="text-base font-semibold">
                  Gift Card PDF Background
                </Label>
                <ImageUploadField
                  label=""
                  currentImage={formData.pdfBackgroundUrl}
                  aspectRatioClass="aspect-[1724/947]"
                  uploadType="pdf-bg"
                  onUploadSuccess={(url) =>
                    setFormData({ ...formData, pdfBackgroundUrl: url })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* FIXED FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 p-4 bg-background border-t border-border z-50 flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-6" // Adds a bit more padding if you want it wider
        >
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}

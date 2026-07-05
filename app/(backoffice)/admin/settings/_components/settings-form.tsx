"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LanguageTabs from "@/components/admin/language-tabs";
import Accordion from "@/components/ui/accordion";
import ImageUploadField from "@/components/admin/image-upload-field";
import { Plus, Trash2 } from "lucide-react";

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
    heroTagline: initialData?.heroTagline || { es: "", en: "", ca: "" },
    aboutUsText: initialData?.aboutUsText || { es: "", en: "", ca: "" },
    aboutImage: initialData?.aboutImage || "",
    logoUrl: initialData?.logoUrl || "",
    faviconUrl: initialData?.faviconUrl || "",
    pdfBackgroundUrl: initialData?.pdfBackgroundUrl || "",
  });

  // Partner array helpers
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
      } else {
        alert("Failed to save settings.");
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      {/* 1. BRAND & CONTACT */}
      <div className="bg-background p-6 rounded-xl border border-border shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">
          Business & Location
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>

      {/* 2. EXTERNAL LINKS */}
      <Accordion id="external" title="Social Media & Booking" active={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Booking Link (Fresha / Treatwell)</Label>
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
        </div>
      </Accordion>

      {/* 3. PARTNERS */}
      <Accordion id="partners" title="Collaborations & Partners" active={true}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Partner Websites</Label>
            <button
              onClick={addPartner}
              className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary/20 flex items-center gap-1 transition-colors"
            >
              <Plus className="size-3" /> Add Partner
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
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
                    placeholder="e.g. Scens"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Website URL</Label>
                  <Input
                    value={partner.url}
                    onChange={(e) =>
                      updatePartner(index, "url", e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>
                <button
                  onClick={() => removePartner(index)}
                  className="mt-6 p-2 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            {formData.partners.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No partners added yet.
              </p>
            )}
          </div>
        </div>
      </Accordion>

      {/* 4. MARKETING TEXT & MEDIA */}
      <Accordion id="content" title="Marketing Text & Media" active={true}>
        <div className="space-y-8">
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

          <hr className="border-border" />

          <h3 className="text-lg font-bold text-foreground">
            Visual Assets (SaaS Templates)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LOGO UPLOADER */}
            <div className="space-y-2 bg-muted/30 p-4 rounded-lg border border-border">
              <Label className="text-base font-semibold">Brand Logo</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Used in the Header, Footer, and Admin Panel. (Use a PNG/SVG with
                a transparent background).
              </p>
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
              <Label className="text-base font-semibold">
                Favicon (Tab Icon)
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                The tiny icon shown in the browser tab. Use a square PNG (32x32
                or 64x64).
              </p>
              <ImageUploadField
                label=""
                currentImage={formData.faviconUrl}
                aspectRatioClass="aspect-square max-w-[80px]"
                onUploadSuccess={(url) =>
                  setFormData({ ...formData, faviconUrl: url })
                }
              />
            </div>
            {/* ABOUT IMAGE UPLOADER */}
            <div className="space-y-2 bg-muted/30 p-4 rounded-lg border border-border">
              <Label className="text-base font-semibold">About Us Image</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Appears on the About page. (Recommended: Portrait/Vertical).
              </p>
              <ImageUploadField
                label=""
                currentImage={formData.aboutImage}
                aspectRatioClass="aspect-[3/4] max-w-[200px]"
                onUploadSuccess={(url) =>
                  setFormData({ ...formData, aboutImage: url })
                }
              />
            </div>
            {/* PDF BACKGROUND UPLOADER */}
            <div className="space-y-2 bg-muted/30 p-4 rounded-lg border border-border md:col-span-2">
              <Label className="text-base font-semibold">
                Gift Card PDF Background
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                The exact background image used when generating PDF Gift Cards.
                Must be exactly 1724x947 pixels.
              </p>
              <ImageUploadField
                label=""
                currentImage={formData.pdfBackgroundUrl}
                aspectRatioClass="aspect-[1724/947] max-w-[400px]"
                onUploadSuccess={(url) =>
                  setFormData({ ...formData, pdfBackgroundUrl: url })
                }
              />
            </div>
          </div>
        </div>
      </Accordion>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 p-4 bg-background border-t border-border z-50 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

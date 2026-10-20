"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormSection } from "@/components/admin/form-logic/form-section";
import { FormGrid } from "@/components/admin/form-logic/form-grid";
import { FormField } from "@/components/admin/form-logic/form-field";
import { I18nField } from "@/components/admin/form-logic/i18-field";
import AdminFormFooter from "@/components/admin/admin-form-footer";
import {
  resolveMatchingTreatments,
  calculateDiscountedPrice,
} from "@/app/lib/campaign-targeting";
import { DBTreatmentWithVariants } from "@/types/definitions";
import { Check, Sparkles, AlertTriangle } from "lucide-react";

export default function CampaignForm({
  initialData,
  availableServiceGroups,
  availableCategories,
  availableTreatments,
  existingActiveCampaigns = [],
}: {
  initialData?: any;
  availableServiceGroups: any[];
  availableCategories: any[];
  availableTreatments: DBTreatmentWithVariants[];
  existingActiveCampaigns?: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    isActive: initialData?.isActive ?? true,
    discountPercentage: initialData?.discountPercentage || "20",
    maxPurchases: initialData?.maxPurchases?.toString() || "",
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().slice(0, 16)
      : "",
    endDate: initialData?.endDate
      ? new Date(initialData.endDate).toISOString().slice(0, 16)
      : "",
    headline: initialData?.headline || { es: "", ca: "", en: "" },
    description: initialData?.description || { es: "", ca: "", en: "" },
    badge: initialData?.badge || { es: "", ca: "", en: "" },
    serviceGroupIds: (initialData?.serviceGroupIds || []) as string[],
    categoryIds: (initialData?.categoryIds || []) as string[],
    treatmentIds: (initialData?.treatmentIds || []) as string[],
  });

  const updateField = (f: string, v: any) =>
    setFormData((p) => ({ ...p, [f]: v }));
  const updateI18n = (f: string, l: string, v: string) =>
    setFormData((p: any) => ({ ...p, [f]: { ...p[f], [l]: v } }));

  const toggleTarget = (
    field: "serviceGroupIds" | "categoryIds" | "treatmentIds",
    id: string,
  ) => {
    setFormData((prev) => {
      const list = prev[field];
      return {
        ...prev,
        [field]: list.includes(id)
          ? list.filter((x) => x !== id)
          : [...list, id],
      };
    });
  };

  // Pure dynamic target resolution
  const matchedTreatments = useMemo(() => {
    return resolveMatchingTreatments(
      {
        serviceGroupIds: formData.serviceGroupIds,
        categoryIds: formData.categoryIds,
        treatmentIds: formData.treatmentIds,
      },
      availableTreatments,
    );
  }, [
    formData.serviceGroupIds,
    formData.categoryIds,
    formData.treatmentIds,
    availableTreatments,
  ]);

  // Overlap warning detection
  const overlappingWarnings = useMemo(() => {
    if (!formData.isActive) return [];
    const matchedIds = new Set(matchedTreatments.map((m) => m.treatment.id));

    return existingActiveCampaigns
      .filter((c) => c.id !== initialData?.id && c.isActive)
      .map((c) => {
        const otherMatched = resolveMatchingTreatments(
          {
            serviceGroupIds:
              c.serviceGroupTargets?.map((t: any) => t.serviceGroupId) || [],
            categoryIds: c.categoryTargets?.map((t: any) => t.categoryId) || [],
            treatmentIds:
              c.treatmentTargets?.map((t: any) => t.treatmentId) || [],
          },
          availableTreatments,
        );
        const overlap = otherMatched.filter((m) =>
          matchedIds.has(m.treatment.id),
        );
        return {
          campaignName: c.name,
          discount: c.discountPercentage,
          overlap,
        };
      })
      .filter((res) => res.overlap.length > 0);
  }, [
    matchedTreatments,
    existingActiveCampaigns,
    initialData?.id,
    availableTreatments,
    formData.isActive,
  ]);

  async function handleSave(): Promise<boolean> {
    setLoading(true);
    setErrorMsg("");

    try {
      const url = initialData?.id
        ? `/api/admin/campaigns/${initialData.id}`
        : `/api/admin/campaigns`;
      const method = initialData?.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorMsg(json.error || "Save failed");
        return false;
      }
      return true;
    } catch (err: any) {
      setErrorMsg(err.message || "Network error");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    try {
      const res = await fetch(`/api/admin/campaigns/${initialData.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/campaigns");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Could not delete campaign.");
      }
    } catch {
      alert("Network error.");
    }
  }

  return (
    <div className="pb-28 max-w-7xl mx-auto space-y-6">
      {errorMsg && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {errorMsg}
        </div>
      )}

      {overlappingWarnings.length > 0 && (
        <div className="p-4 bg-warning-background border border-warning-border text-warning rounded-xl text-sm space-y-1">
          <div className="font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Shared Treatments Detected
          </div>
          <p className="text-xs text-foreground">
            The following treatments also qualify for other active campaigns.
            Customers will automatically receive whichever discount percentage
            is higher:
          </p>
          <ul className="list-disc list-inside text-xs mt-1 text-foreground">
            {overlappingWarnings.map((w, idx) => (
              <li key={idx}>
                Campaign <strong>"{w.campaignName}"</strong> ({w.discount}% OFF)
                shares {w.overlap.length} treatment(s).
              </li>
            ))}
          </ul>
        </div>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList
          variant="underline"
          className="mb-8 w-full justify-start border-b border-border"
        >
          <TabsTrigger value="general">Configuration & Limits</TabsTrigger>
          <TabsTrigger value="content">Marketing Content</TabsTrigger>
          <TabsTrigger value="targets">
            Dynamic Targeting ({matchedTreatments.length} Matched)
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: GENERAL CONFIGURATION */}
        <TabsContent value="general" className="space-y-6">
          <FormSection title="Campaign Identity & Status">
            <FormGrid cols={2}>
              <FormField label="Internal Campaign Name">
                <Input
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Black Friday 2026, Easter Special"
                />
              </FormField>
              <FormField label="URL Slug">
                <Input
                  value={formData.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="e.g. black-friday-2026"
                />
              </FormField>
            </FormGrid>

            <div className="flex items-center gap-3 p-4 bg-muted border border-border rounded-xl">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(val) => updateField("isActive", val)}
              />
              <div>
                <div className="font-semibold text-sm text-foreground">
                  {formData.isActive
                    ? "Campaign Manually Enabled"
                    : "Campaign Manually Disabled"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Manual killswitch. When disabled, the promotion will not be
                  applied regardless of dates.
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Pricing & Quota">
            <FormGrid cols={2}>
              <FormField label="Discount Percentage (%)">
                <Input
                  type="number"
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    updateField("discountPercentage", e.target.value)
                  }
                  placeholder="20"
                />
              </FormField>
              <FormField label="Purchase Limit (Shared Quota)">
                <Input
                  type="number"
                  min="1"
                  value={formData.maxPurchases}
                  onChange={(e) => updateField("maxPurchases", e.target.value)}
                  placeholder="Unlimited (leave blank)"
                />
              </FormField>
            </FormGrid>
          </FormSection>

          <FormSection title="Scheduled Window (Optional)">
            <FormGrid cols={2}>
              <FormField label="Starts At (UTC/Local)">
                <Input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                />
              </FormField>
              <FormField label="Ends At (UTC/Local)">
                <Input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => updateField("endDate", e.target.value)}
                />
              </FormField>
            </FormGrid>
          </FormSection>
        </TabsContent>

        {/* TAB 2: MARKETING CONTENT */}
        <TabsContent value="content" className="space-y-6">
          <FormSection title="Public Marketing Headline">
            <I18nField
              label="Headline"
              value={formData.headline}
              onChange={(l, v) => updateI18n("headline", l, v)}
            />
          </FormSection>

          <FormSection title="Public Marketing Description">
            <I18nField
              label="Description"
              type="textarea"
              rows={4}
              value={formData.description}
              onChange={(l, v) => updateI18n("description", l, v)}
            />
          </FormSection>

          <FormSection title="Promotional Badge (Optional)">
            <I18nField
              label="Badge Text (e.g. 'Edición Limitada')"
              value={formData.badge}
              onChange={(l, v) => updateI18n("badge", l, v)}
            />
          </FormSection>
        </TabsContent>

        {/* TAB 3: DYNAMIC TARGETING & PREVIEW */}
        <TabsContent value="targets" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SERVICE GROUPS */}
            <div className="p-5 bg-card border border-border rounded-xl space-y-4">
              <h3 className="font-heading font-semibold text-sm text-foreground flex items-center justify-between">
                <span>1. Service Groups</span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-mono">
                  {formData.serviceGroupIds.length}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                All treatments inside selected groups dynamically inherit the
                discount.
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {availableServiceGroups.map((sg) => {
                  const isChecked = formData.serviceGroupIds.includes(sg.id);
                  return (
                    <button
                      type="button"
                      key={sg.id}
                      onClick={() => toggleTarget("serviceGroupIds", sg.id)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                        isChecked
                          ? "bg-primary/10 border-primary text-primary font-medium"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <span>{sg.label?.es || sg.slug}</span>
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CATEGORIES */}
            <div className="p-5 bg-card border border-border rounded-xl space-y-4">
              <h3 className="font-heading font-semibold text-sm text-foreground flex items-center justify-between">
                <span>2. Categories</span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-mono">
                  {formData.categoryIds.length}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Target specific categories across any parent service group.
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {availableCategories.map((c) => {
                  const isChecked = formData.categoryIds.includes(c.id);
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => toggleTarget("categoryIds", c.id)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                        isChecked
                          ? "bg-primary/10 border-primary text-primary font-medium"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <span className="truncate">{c.title?.es || c.slug}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TREATMENTS */}
            <div className="p-5 bg-card border border-border rounded-xl space-y-4">
              <h3 className="font-heading font-semibold text-sm text-foreground flex items-center justify-between">
                <span>3. Specific Treatments</span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-mono">
                  {formData.treatmentIds.length}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Target individual rituals or massages directly.
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {availableTreatments.map((t) => {
                  const isChecked = formData.treatmentIds.includes(t.id);
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => toggleTarget("treatmentIds", t.id)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                        isChecked
                          ? "bg-primary/10 border-primary text-primary font-medium"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <span className="truncate">
                        {(t.title as any)?.es || t.slug}
                      </span>
                      {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DYNAMIC LIVE MATCHED TREATMENTS PREVIEW */}
          <div className="p-6 bg-card border border-border rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Live Matched
                  Treatments Preview
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Calculated dynamically in memory from selected target rules.
                  Zero static snapshots saved.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-highlight-background text-highlight-foreground border border-highlight-border rounded-full">
                {matchedTreatments.length} treatment(s) eligible
              </span>
            </div>

            {matchedTreatments.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-lg text-muted-foreground text-sm">
                No treatments match the selected target rules. Select a service
                group, category, or treatment above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {matchedTreatments.map(({ treatment, matchReasons }) => (
                  <div
                    key={treatment.id}
                    className="p-3 bg-background border border-border rounded-lg space-y-2 text-xs"
                  >
                    <div className="font-semibold text-foreground truncate">
                      {(treatment.title as any)?.es || treatment.slug}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {matchReasons.map((r, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground"
                        >
                          via {r.type.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                    {/* Simulated price preview */}
                    {treatment.variants && treatment.variants.length > 0 && (
                      <div className="border-t border-border pt-2 space-y-1">
                        {treatment.variants.map((v) => {
                          const { discountedPriceFormatted } =
                            calculateDiscountedPrice(
                              v.price,
                              formData.discountPercentage,
                            );
                          return (
                            <div
                              key={v.id}
                              className="flex justify-between items-center text-[11px]"
                            >
                              <span className="text-muted-foreground">
                                {v.duration} {v.unit}:
                              </span>
                              <span>
                                <span className="line-through text-muted-foreground mr-1">
                                  {v.price}€
                                </span>
                                <span className="font-bold text-primary">
                                  {discountedPriceFormatted}€
                                </span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AdminFormFooter
        isLoading={loading}
        onSave={handleSave}
        onSaveSuccess={() => {
          router.push("/admin/campaigns");
          router.refresh();
        }}
        onDelete={handleDelete}
        isEdit={!!initialData?.id}
      />
    </div>
  );
}

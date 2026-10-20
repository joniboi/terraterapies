// app/lib/campaign-targeting.ts

import {
  TargetSelection,
  MatchedTreatmentResult,
  MatchReason,
  DBTreatmentWithVariants,
  CampaignOperationalStatus,
} from "@/types/definitions";

/**
 * Dynamically resolves all treatments matched by selected targets.
 * Evaluates relations at runtime without persisting snapshots.
 */
export function resolveMatchingTreatments(
  targets: TargetSelection,
  allTreatments: DBTreatmentWithVariants[],
): MatchedTreatmentResult[] {
  const groupSet = new Set(targets.serviceGroupIds || []);
  const categorySet = new Set(targets.categoryIds || []);
  const treatmentSet = new Set(targets.treatmentIds || []);

  const results: MatchedTreatmentResult[] = [];

  for (const treatment of allTreatments) {
    const reasons: MatchReason[] = [];

    if (treatmentSet.has(treatment.id)) {
      reasons.push({ type: "treatment", targetId: treatment.id });
    }
    if (treatment.categoryId && categorySet.has(treatment.categoryId)) {
      reasons.push({ type: "category", targetId: treatment.categoryId });
    }
    if (groupSet.has(treatment.serviceGroupId)) {
      reasons.push({
        type: "service_group",
        targetId: treatment.serviceGroupId,
      });
    }

    if (reasons.length > 0) {
      results.push({ treatment, matchReasons: reasons });
    }
  }

  return results;
}

/**
 * Calculates operational status and semantic theme CSS classes.
 * Strictly uses tokens defined in theme.css (no hardcoded palette colors).
 */
export function getCampaignOperationalStatus(campaign: {
  isActive: boolean;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  maxPurchases?: number | null;
  currentPurchases?: number;
}): {
  status: CampaignOperationalStatus;
  label: string;
  className: string;
} {
  if (!campaign.isActive) {
    return {
      status: "disabled",
      label: "Disabled (Manual)",
      className: "bg-muted text-muted-foreground border border-border",
    };
  }

  const now = new Date();

  if (campaign.startDate && new Date(campaign.startDate) > now) {
    return {
      status: "scheduled",
      label: "Scheduled",
      className: "bg-info-background text-info border border-info-border",
    };
  }

  if (campaign.endDate && new Date(campaign.endDate) < now) {
    return {
      status: "expired",
      label: "Expired",
      className:
        "bg-destructive/10 text-destructive border border-destructive/20",
    };
  }

  if (
    campaign.maxPurchases &&
    (campaign.currentPurchases ?? 0) >= campaign.maxPurchases
  ) {
    return {
      status: "sold_out",
      label: "Sold Out",
      className:
        "bg-warning-background text-warning border border-warning-border",
    };
  }

  return {
    status: "active",
    label: "Active & Live",
    className:
      "bg-success-background text-success border border-success-border",
  };
}

/**
 * Computes price under campaign discount using exact cent rounding.
 */
export function calculateDiscountedPrice(
  regularPrice: string | number,
  discountPercentage: string | number,
): { discountedPrice: number; discountedPriceFormatted: string } {
  const numericPrice =
    typeof regularPrice === "string" ? parseFloat(regularPrice) : regularPrice;
  const numericDiscount =
    typeof discountPercentage === "string"
      ? parseFloat(discountPercentage)
      : discountPercentage;

  if (isNaN(numericPrice) || isNaN(numericDiscount)) {
    return { discountedPrice: 0, discountedPriceFormatted: "0.00" };
  }

  const multiplier = (100 - numericDiscount) / 100;
  const discountedPrice = Math.round(numericPrice * multiplier * 100) / 100;

  return {
    discountedPrice,
    discountedPriceFormatted: discountedPrice.toFixed(2),
  };
}

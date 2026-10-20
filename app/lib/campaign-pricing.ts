// app/lib/campaign-pricing.ts
import { db } from "@/db";
import { campaigns, campaignReservations } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import {
  DBVariant,
  DBTreatmentWithVariants,
  DBCampaign,
  CampaignWithRelations,
  ResolvedVariantPrice,
} from "@/types/definitions";

/**
 * Checks if a campaign is currently valid and eligible based on UTC time and quota.
 */
export function isCampaignEligible(
  campaign: DBCampaign & { currentPurchases?: number },
  now: Date = new Date(),
): boolean {
  if (!campaign.isActive) return false;

  // Start Date boundary (inclusive)
  if (campaign.startDate && now < new Date(campaign.startDate)) {
    return false;
  }

  // End Date boundary (inclusive)
  if (campaign.endDate && now > new Date(campaign.endDate)) {
    return false;
  }

  // Max Purchases quota
  if (
    campaign.maxPurchases !== null &&
    campaign.maxPurchases !== undefined &&
    (campaign.currentPurchases ?? 0) >= campaign.maxPurchases
  ) {
    return false;
  }

  return true;
}

/**
 * Checks if a treatment dynamically qualifies for a campaign's target rules.
 * Deduplicates multiple matching paths (group, category, treatment).
 */
export function doesTreatmentMatchCampaign(
  treatment: {
    id: string;
    serviceGroupId: string;
    categoryId: string | null;
  },
  campaign: {
    serviceGroupTargets?: { serviceGroupId: string }[];
    categoryTargets?: { categoryId: string }[];
    treatmentTargets?: { treatmentId: string }[];
  },
): boolean {
  if (campaign.treatmentTargets?.some((t) => t.treatmentId === treatment.id)) {
    return true;
  }
  if (
    treatment.categoryId &&
    campaign.categoryTargets?.some((c) => c.categoryId === treatment.categoryId)
  ) {
    return true;
  }
  if (
    campaign.serviceGroupTargets?.some(
      (g) => g.serviceGroupId === treatment.serviceGroupId,
    )
  ) {
    return true;
  }
  return false;
}

/**
 * Parses monetary price string or number into exact integer cents.
 * Fixes the bug where parseInt("65.50€") truncated decimal cents to 6500.
 */
export function parsePriceToCents(price: string | number): number {
  if (typeof price === "number") {
    return Math.round(price * 100);
  }
  const cleanStr = price.replace(/[^\d.,]/g, "").replace(",", ".");
  const val = parseFloat(cleanStr);
  return isNaN(val) ? 0 : Math.round(val * 100);
}

export function formatPriceString(priceInCents: number): string {
  const euro = priceInCents / 100;
  return euro % 1 === 0 ? `${euro}€` : `${euro.toFixed(2)}€`;
}

/**
 * Resolves the single source of truth price for a variant given applicable campaigns.
 *
 * PRECEDENCE:
 * 1. Applicable Campaign: percentage applied to regular price.
 * 2. Legacy Promotional Price: if valid and unexpired.
 * 3. Regular Variant Price.
 * (Campaign and legacy discounts NEVER stack).
 */
export function resolveVariantPrice(
  variant: DBVariant,
  treatment: { id: string; serviceGroupId: string; categoryId: string | null },
  eligibleCampaigns: (CampaignWithRelations & { currentPurchases?: number })[],
  now: Date = new Date(),
  lang: string = "es",
): ResolvedVariantPrice {
  const regularCents = parsePriceToCents(variant.price);
  const regularPrice = regularCents / 100;

  // 1. Find all matching eligible campaigns for this treatment
  const matchingCampaigns = eligibleCampaigns.filter(
    (c) =>
      isCampaignEligible(c, now) && doesTreatmentMatchCampaign(treatment, c),
  );

  // 2. Overlap Runtime Guard:
  // If multiple campaigns match, resolve deterministically using highest discount
  // (most favorable to customer) and then most recently updated.
  let selectedCampaign:
    | (CampaignWithRelations & { currentPurchases?: number })
    | null = null;

  if (matchingCampaigns.length > 0) {
    selectedCampaign = matchingCampaigns.reduce((prev, curr) => {
      const prevDiscount = parseFloat(prev.discountPercentage);
      const currDiscount = parseFloat(curr.discountPercentage);
      if (currDiscount > prevDiscount) return curr;
      if (currDiscount < prevDiscount) return prev;
      // Tie-breaker: most recently updated
      return new Date(curr.updatedAt) > new Date(prev.updatedAt) ? curr : prev;
    });
  }

  // CASE 1: Active Campaign Applies
  if (selectedCampaign) {
    const discountPct = parseFloat(selectedCampaign.discountPercentage);
    const finalCents = Math.round((regularCents * (100 - discountPct)) / 100);
    const finalPrice = finalCents / 100;

    const badgeText = selectedCampaign.badge
      ? (selectedCampaign.badge as any)?.[lang] ||
        (selectedCampaign.badge as any)?.["es"]
      : undefined;

    return {
      variantId: variant.id,
      regularPrice,
      finalPrice,
      regularPriceFormatted: formatPriceString(regularCents),
      finalPriceFormatted: formatPriceString(finalCents),
      centsAmount: finalCents,
      isPromo: true,
      source: "campaign",
      discountPercentage: Math.round(discountPct),
      promoEndsAt: selectedCampaign.endDate
        ? new Date(selectedCampaign.endDate)
        : null,
      campaignId: selectedCampaign.id,
      campaignName: selectedCampaign.name,
      campaignBadge: badgeText,
    };
  }

  // CASE 2: Legacy Variant Promotion
  const promoExpiry = variant.promoEndsAt
    ? new Date(variant.promoEndsAt)
    : null;
  const isLegacyActive = !!(
    variant.promotionalPrice &&
    (!promoExpiry || now < promoExpiry)
  );

  if (isLegacyActive && variant.promotionalPrice) {
    const legacyCents = parsePriceToCents(variant.promotionalPrice);
    const finalPrice = legacyCents / 100;
    const discountPct = Math.round(100 - (legacyCents / regularCents) * 100);

    return {
      variantId: variant.id,
      regularPrice,
      finalPrice,
      regularPriceFormatted: formatPriceString(regularCents),
      finalPriceFormatted: formatPriceString(legacyCents),
      centsAmount: legacyCents,
      isPromo: true,
      source: "legacy_promo",
      discountPercentage: Math.max(0, discountPct),
      promoEndsAt: promoExpiry,
    };
  }

  // CASE 3: Regular Price (No Promotion)
  return {
    variantId: variant.id,
    regularPrice,
    finalPrice: regularPrice,
    regularPriceFormatted: formatPriceString(regularCents),
    finalPriceFormatted: formatPriceString(regularCents),
    centsAmount: regularCents,
    isPromo: false,
    source: "regular",
    discountPercentage: 0,
    promoEndsAt: null,
  };
}

/**
 * Server query helper to fetch all active campaigns with targeting and purchase counts.
 */
export async function getActiveCampaignsWithTargets(): Promise<
  CampaignWithRelations[]
> {
  const activeCampaigns = (await db.query.campaigns.findMany({
    where: eq(campaigns.isActive, true),
    with: {
      serviceGroupTargets: { columns: { serviceGroupId: true } },
      categoryTargets: { columns: { categoryId: true } },
      treatmentTargets: { columns: { treatmentId: true } },
    },
  })) as CampaignWithRelations[];

  if (activeCampaigns.length === 0) return [];

  const usageCounts = await db
    .select({
      campaignId: campaignReservations.campaignId,
      count: sql<number>`count(*)::int`,
    })
    .from(campaignReservations)
    .where(
      sql`${campaignReservations.status} = 'completed' OR (${campaignReservations.status} = 'reserved' AND ${campaignReservations.expiresAt} > now())`,
    )
    .groupBy(campaignReservations.campaignId);

  const countMap = new Map(usageCounts.map((u) => [u.campaignId, u.count]));

  return activeCampaigns.map((c) => ({
    ...c,
    currentPurchases: countMap.get(c.id) || 0,
  }));
}

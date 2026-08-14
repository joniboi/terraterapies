import "server-only";
import { db } from "@/db";
import {
  ServiceGroup,
  Category,
  Treatment,
  DBTreatmentWithVariants,
} from "@/types/definitions";
import { unstable_noStore as noStore } from "next/cache";
// 1. Languages definition
const SUPPORTED_LANGS = ["es", "en", "ca"];

/**
 * Helper to extract the correct language string from the DB JSONB object
 */
const getTranslation = (obj: any, lang: string) => {
  if (!obj) return "";
  return obj[lang] || obj["es"] || "";
};

/**
 * The core logic for translating units (min, pax)
 * ported exactly from your original JSON-based code.
 */
function formatDuration(variant: any, lang: string) {
  const unitText: Record<string, any> = {
    es: { min: "minutos", pax: "Persona", paxPlural: "Personas" },
    en: { min: "minutes", pax: "Person", paxPlural: "Persons" },
    ca: { min: "minuts", pax: "Persona", paxPlural: "Persones" },
  };
  const t = unitText[lang] || unitText.es;

  let generatedDuration = "";
  if (variant.unit === "min") {
    generatedDuration = `${variant.duration} ${t.min}`;
  } else if (variant.unit === "pax") {
    generatedDuration =
      variant.duration === 1
        ? `1 ${t.pax}`
        : `${variant.duration} ${t.paxPlural}`;
  }

  const prefix = getTranslation(variant.prefix, lang);
  const suffix = getTranslation(variant.suffix, lang);

  let finalDuration = generatedDuration;
  if (prefix) finalDuration = `${prefix} ${generatedDuration}`;
  if (suffix) finalDuration = `${finalDuration} ${suffix}`;

  return finalDuration;
}

/**
 * REPLACES: getServicesData(lang)
 * Fetches the entire structure from DB and merges it into the ServicesData shape.
 */
// Replace ONLY the getServicesData function inside app/lib/getService.ts

export const getServicesData = async (
  lang: string,
  includeInactive = false,
): Promise<ServiceGroup[]> => {
  noStore();

  const groups = await db.query.serviceGroups.findMany({
    with: {
      categories: {
        with: {
          treatments: { with: { variants: true } },
        },
      },
      treatments: {
        // Query direct treatments
        with: { variants: true },
      },
    },
    orderBy: (groups, { asc }) => [asc(groups.orderIndex)],
  });

  const parsedGroups: ServiceGroup[] = [];

  for (const group of groups) {
    // 1. Process Categories
    const validCategories: Category[] = [];
    for (const cat of group.categories) {
      // Filter out inactive treatments if required
      const activeCatTreatments = includeInactive
        ? cat.treatments
        : cat.treatments.filter((t) => t.isActive);

      if (activeCatTreatments.length > 0 || includeInactive) {
        validCategories.push({
          slug: cat.slug,
          title: getTranslation(cat.title, lang),
          description: getTranslation(cat.description, lang),
          image: cat.image,
          orderIndex: cat.orderIndex ?? 0,
          isFeatured: cat.isFeatured,
          badge: getTranslation(cat.badge, lang),
          heroImages: cat.heroImages || [],
          showCase: cat.showCase
            ? {
                title: getTranslation(cat.showCase.title, lang),
                description: getTranslation(cat.showCase.description, lang),
              }
            : undefined,
          treatments: activeCatTreatments.map((t) => mapTreatment(t, lang)),
        });
      }
    }

    // 2. Process Direct Treatments (where categoryId is null)
    const activeDirectTreatments = includeInactive
      ? group.treatments.filter((t) => !t.categoryId)
      : group.treatments.filter((t) => !t.categoryId && t.isActive);

    const parsedDirectTreatments = activeDirectTreatments.map((t) =>
      mapTreatment(t, lang),
    );

    // 3. Keep the Group only if it has valid content
    if (
      validCategories.length > 0 ||
      parsedDirectTreatments.length > 0 ||
      includeInactive
    ) {
      parsedGroups.push({
        id: group.slug,
        slug: group.slug,
        title: getTranslation(group.label, lang),
        description: getTranslation(group.description, lang),
        image: group.image || "",
        layout: group.layout as "mega-menu" | "rich-dropdown",
        highlight: group.highlight,
        emoji: group.emoji || "",
        badge: getTranslation(group.badge, lang),
        heroImages: group.heroImages || [],
        showCase: group.showCase
          ? {
              title: getTranslation(group.showCase.title, lang),
              description: getTranslation(group.showCase.description, lang),
            }
          : undefined,
        categories: validCategories,
        treatments: parsedDirectTreatments,
      });
    }
  }

  return parsedGroups;
};

function mapTreatment(t: DBTreatmentWithVariants, lang: string): Treatment {
  const now = new Date();
  let maxDiscountPercentage = 0;

  // Because 't' is typed, TypeScript instantly knows t.variants is DBVariant[]!
  // No casts needed. 'a', 'b', and 'v' are perfectly understood.
  const mappedOptions = t.variants
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .map((v) => {
      const promoExpiry = v.promoEndsAt ? new Date(v.promoEndsAt) : null;

      const isPromoActive = !!(
        v.promotionalPrice &&
        (!promoExpiry || now < promoExpiry)
      );

      let discountPercent = 0;
      if (isPromoActive && v.promotionalPrice) {
        discountPercent = Math.round(
          100 - (Number(v.promotionalPrice) / Number(v.price)) * 100,
        );
        if (discountPercent > maxDiscountPercentage) {
          maxDiscountPercentage = discountPercent;
        }
      }

      // We return exactly what the UI 'Option' interface expects
      return {
        duration: formatDuration(v, lang),
        price: isPromoActive ? `${v.promotionalPrice}€` : `${v.price}€`,
        originalPrice: isPromoActive ? `${v.price}€` : undefined,
        isPromo: isPromoActive,
        promoEnds: promoExpiry
          ? promoExpiry.toLocaleDateString(
              ["es", "en", "ca"].includes(lang)
                ? lang === "en"
                  ? "en-GB"
                  : "es-ES"
                : "es-ES",
            )
          : undefined,
        discountPercent,
        sessionsCount: v.sessionsCount || 1,
      };
    });

  return {
    slug: t.slug,
    // We cast these safely because we know our DB stores them as I18nString
    title: getTranslation(t.title, lang),
    emoji: t.emoji || "🌸",
    image: t.image,
    backgroundImage: t.backgroundImage || "/images/treatment-detail.jpg",
    shortDescription: getTranslation(t.shortDescription, lang),
    longDescription: getTranslation(t.longDescription, lang),
    options: mappedOptions, // Passes the mapped array directly
    hasPromo: maxDiscountPercentage > 0,
    promoBadgeText:
      maxDiscountPercentage > 0 ? `-${maxDiscountPercentage}%` : undefined,
    isActive: t.isActive,
  };
}

/**
 * Generates unified dynamic static params for the Catch-All router
 */
export async function getCatchAllStaticParams() {
  const params: { lang: string; slug: string[] }[] = [];

  for (const lang of SUPPORTED_LANGS) {
    // Only active treatments and non-empty categories/groups are returned
    const data = await getServicesData(lang);

    for (const group of data) {
      // 1. Group Landing (e.g. /masajes, /faciales, /rituales)
      params.push({ lang, slug: [group.slug] });

      // 2. Process Categories (if any)
      for (const cat of group.categories) {
        // Category Page (e.g. /orientales, /relajantes)
        params.push({ lang, slug: [cat.slug] });

        // Categorized Treatment Page (e.g. /orientales/balines)
        for (const t of cat.treatments) {
          params.push({ lang, slug: [cat.slug, t.slug] });
        }
      }

      // 3. Process Direct Group Treatments (if any, e.g. /faciales/hydraglow)
      for (const t of group.treatments) {
        params.push({ lang, slug: [group.slug, t.slug] });
      }
    }
  }
  return params;
}

/**
 * Type-safe definition representing the entity resolved by our dynamic Catch-All path
 */
export type ResolvedEntity =
  | { type: "group_landing"; group: ServiceGroup }
  | { type: "category_landing"; category: Category; parentGroup: ServiceGroup }
  | {
      type: "treatment_detail";
      treatment: Treatment;
      parent: ServiceGroup | Category;
      parentType: "group" | "category";
    };

/**
 * Resolves a 1-part or 2-part URL segment directly from the database state.
 * Hardcodes zero business slugs!
 */
export async function resolveSlugPath(
  lang: string,
  slug: string[],
): Promise<ResolvedEntity | null> {
  const data = await getServicesData(lang); // Respects treatments.isActive out-of-the-box

  // --- RESOLVE 1 SEGMENT (e.g., /masajes OR /orientales) ---
  if (slug.length === 1) {
    const targetSlug = slug[0];

    // Is it a Service Group? (e.g., /masajes, /faciales)
    const group = data.find((g) => g.slug === targetSlug);
    if (group) {
      return { type: "group_landing", group };
    }

    // Is it a Category? (e.g., /orientales, /relajantes)
    for (const g of data) {
      const category = g.categories.find((c) => c.slug === targetSlug);
      if (category) {
        return { type: "category_landing", category, parentGroup: g };
      }
    }
  }

  // --- RESOLVE 2 SEGMENTS (e.g., /orientales/balines OR /faciales/hydraglow) ---
  if (slug.length === 2) {
    const parentSlug = slug[0];
    const treatmentSlug = slug[1];

    for (const g of data) {
      // Case A: Is it a Group -> Direct Treatment? (e.g., /faciales/hydraglow)
      if (g.slug === parentSlug) {
        const treatment = g.treatments.find((t) => t.slug === treatmentSlug);
        if (treatment) {
          return {
            type: "treatment_detail",
            treatment,
            parent: g,
            parentType: "group",
          };
        }
      }

      // Case B: Is it a Category -> Treatment? (e.g., /orientales/balines)
      const category = g.categories.find((c) => c.slug === parentSlug);
      if (category) {
        const treatment = category.treatments.find(
          (t) => t.slug === treatmentSlug,
        );
        if (treatment) {
          return {
            type: "treatment_detail",
            treatment,
            parent: category,
            parentType: "category",
          };
        }
      }
    }
  }

  return null;
}

// =========================================================================
// BACKWARD-COMPATIBLE WRAPPERS (Prevents breaking metadata & secondary files)
// =========================================================================

/**
 * Legacy Category resolver - routes directly through resolveSlugPath
 */
export async function getCategory(
  lang: string,
  categorySlug: string,
): Promise<Category | null> {
  const resolved = await resolveSlugPath(lang, [categorySlug]);
  if (resolved && resolved.type === "category_landing") {
    return resolved.category;
  }
  return null;
}

/**
 * Legacy Treatment resolver - maps outputs dynamically into old { category, subcategory } format
 */
export async function getService(
  lang: string,
  categorySlug: string,
  subcategorySlug: string,
): Promise<{ category: any; subcategory: Treatment } | null> {
  const resolved = await resolveSlugPath(lang, [categorySlug, subcategorySlug]);
  if (resolved && resolved.type === "treatment_detail") {
    return {
      category: resolved.parent, // Maps parent (Group or Category) safely
      subcategory: resolved.treatment,
    };
  }
  return null;
}

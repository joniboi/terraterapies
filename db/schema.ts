import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  decimal,
  jsonb,
  varchar,
  boolean,
  serial,
  unique,
  foreignKey,
  check,
  index,
} from "drizzle-orm/pg-core";

import { relations, sql } from "drizzle-orm";

// Define a type for our translation objects to use in TypeScript
export type I18nString = {
  es: string;
  ca: string;
  en: string;
};

export type CategoryShowCase = {
  title: I18nString;
  description: I18nString;
};

// 1. SERVICE GROUPS
export const serviceGroups = pgTable("service_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  label: jsonb("label").$type<I18nString>().notNull(),
  layout: varchar("layout", { length: 50 }).default("mega-menu"),
  highlight: boolean("highlight").default(false).notNull(),
  emoji: varchar("emoji", { length: 10 }),
  orderIndex: integer("order_index").default(0),
  // New editorial fields
  description: jsonb("description").$type<I18nString>(),
  image: text("image"),
  heroImages: jsonb("hero_images").$type<{ src: string; alt: string }[]>(),
  showCase: jsonb("show_case").$type<CategoryShowCase>(),
  badge: jsonb("badge").$type<I18nString>(),
});

// 2. CATEGORIES
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    groupId: uuid("group_id")
      .references(() => serviceGroups.id)
      .notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: jsonb("title").$type<I18nString>().notNull(),
    description: jsonb("description").$type<I18nString>().notNull(),
    image: text("image").notNull(),
    // --- ADD THESE ---
    isFeatured: boolean("is_featured").default(false).notNull(),
    heroImages: jsonb("hero_images").$type<{ src: string; alt: string }[]>(),
    showCase: jsonb("show_case").$type<CategoryShowCase>(),
    badge: jsonb("badge").$type<I18nString>(),
    // -----------------
    orderIndex: integer("order_index").default(0),
  },
  (t) => [unique("categories_id_group_id_unq").on(t.id, t.groupId)],
);

export const treatments = pgTable(
  "treatments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    serviceGroupId: uuid("service_group_id")
      .references(() => serviceGroups.id)
      .notNull(),
    categoryId: uuid("category_id"), // Nullable
    isActive: boolean("is_active").default(true).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: jsonb("title").$type<I18nString>().notNull(),
    tagline: jsonb("tagline").$type<I18nString>(),
    shortDescription: jsonb("short_description").$type<I18nString>().notNull(),
    longDescription: jsonb("long_description").$type<I18nString>().notNull(),
    image: text("image").notNull(),
    // --- ADD THIS ---
    backgroundImage: text("background_image"),
    // ----------------
    emoji: varchar("emoji", { length: 10 }),
  },
  (t) => [
    foreignKey({
      columns: [t.categoryId, t.serviceGroupId],
      foreignColumns: [categories.id, categories.groupId],
      name: "treatments_category_group_fk",
    }),
    check(
      "slug_active_check",
      sql`is_active = false OR length(trim(slug)) > 0`,
    ),
  ],
);

// 4. VARIANTS (The actual sellable options: 60min, 90min)
export const treatmentVariants = pgTable("treatment_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  treatmentId: uuid("treatment_id")
    .references(() => treatments.id)
    .notNull(),
  duration: integer("duration").notNull(), // numeric value only
  unit: varchar("unit", { length: 20 }).default("min").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),

  sessionsCount: integer("sessions_count").default(1).notNull(),

  promotionalPrice: decimal("promotional_price", { precision: 10, scale: 2 }), // Discounted Price
  promoEndsAt: timestamp("promo_ends_at"), // When the discount expires

  prefix: jsonb("prefix").$type<I18nString>(), // e.g. "Traditional"
  suffix: jsonb("suffix").$type<I18nString>(), // e.g. "(stretching)"
  orderIndex: integer("order_index").default(0),
});
// db/schema.ts

// This table replaces Upstash for the Daily Counter logic
export const dailyCounters = pgTable("daily_counters", {
  dateKey: varchar("date_key", { length: 6 }).primaryKey(), // e.g. '010424' (DDMMYY)
  count: integer("count").default(0).notNull(),
});

// 5. CAMPAIGNS (Reusable promotional campaigns)
export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(), // Internal management name (e.g. "Black Friday 2026")
    isActive: boolean("is_active").default(true).notNull(),
    startDate: timestamp("start_date"), // Optional start timestamp
    endDate: timestamp("end_date"), // Optional end timestamp
    discountPercentage: decimal("discount_percentage", {
      precision: 5,
      scale: 2,
    }).notNull(),
    maxPurchases: integer("max_purchases"), // Shared limit across all gift cards under this campaign
    headline: jsonb("headline").$type<I18nString>().notNull(),
    description: jsonb("description").$type<I18nString>().notNull(),
    badge: jsonb("badge").$type<I18nString>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    check(
      "campaign_discount_percentage_range",
      sql`discount_percentage > 0 AND discount_percentage <= 100`,
    ),
    check(
      "campaign_max_purchases_positive",
      sql`max_purchases IS NULL OR max_purchases > 0`,
    ),
    check(
      "campaign_date_range_valid",
      sql`start_date IS NULL OR end_date IS NULL OR start_date <= end_date`,
    ),
  ],
);

// 6. DYNAMIC CAMPAIGN TARGETING
export const campaignServiceGroups = pgTable(
  "campaign_service_groups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    campaignId: uuid("campaign_id")
      .references(() => campaigns.id, { onDelete: "cascade" })
      .notNull(),
    serviceGroupId: uuid("service_group_id")
      .references(() => serviceGroups.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    unique("campaign_service_groups_campaign_group_unq").on(
      t.campaignId,
      t.serviceGroupId,
    ),
    index("campaign_service_groups_group_id_idx").on(t.serviceGroupId),
  ],
);

export const campaignCategories = pgTable(
  "campaign_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    campaignId: uuid("campaign_id")
      .references(() => campaigns.id, { onDelete: "cascade" })
      .notNull(),
    categoryId: uuid("category_id")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    unique("campaign_categories_campaign_cat_unq").on(
      t.campaignId,
      t.categoryId,
    ),
    index("campaign_categories_cat_id_idx").on(t.categoryId),
  ],
);

export const campaignTreatments = pgTable(
  "campaign_treatments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    campaignId: uuid("campaign_id")
      .references(() => campaigns.id, { onDelete: "cascade" })
      .notNull(),
    treatmentId: uuid("treatment_id")
      .references(() => treatments.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    unique("campaign_treatments_campaign_treatment_unq").on(
      t.campaignId,
      t.treatmentId,
    ),
    index("campaign_treatments_treatment_id_idx").on(t.treatmentId),
  ],
);

export const campaignReservations = pgTable(
  "campaign_reservations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    campaignId: uuid("campaign_id")
      .references(() => campaigns.id, { onDelete: "restrict" })
      .notNull(),
    stripeSessionId: varchar("stripe_session_id", { length: 255 }).unique(),
    giftCardId: uuid("gift_card_id").references(() => giftCards.id, {
      onDelete: "restrict",
    }),
    status: varchar("status", { length: 20 }).default("reserved").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    // Ensure strict 1:0..1 relationship between gift card and campaign reservation
    unique("campaign_reservations_gift_card_id_unq").on(t.giftCardId),
    check(
      "campaign_reservation_status_check",
      sql`status IN ('reserved', 'completed', 'released', 'expired')`,
    ),
    // Performance index for atomic quota reservation counting
    index("campaign_reservations_quota_idx").on(
      t.campaignId,
      t.status,
      t.expiresAt,
    ),
  ],
);

// 7. GIFT CARDS (The Registry)
export const giftCards = pgTable(
  "gift_cards",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    locatorCode: varchar("locator_code", { length: 50 }).notNull().unique(),
    stripeSessionId: varchar("stripe_session_id", { length: 255 })
      .notNull()
      .unique(),
    // Status: 'valid', 'redeemed', 'cancelled'
    status: varchar("status", { length: 20 }).default("valid").notNull(),
    treatmentNameSnapshot: varchar("treatment_name", { length: 255 }).notNull(),
    durationSnapshot: varchar("duration_snapshot", { length: 50 }).notNull(),
    priceSnapshot: decimal("price_snapshot", {
      precision: 10,
      scale: 2,
    }).notNull(),

    totalSessions: integer("total_sessions").default(1).notNull(),
    usedSessions: integer("used_sessions").default(0).notNull(),
    // Who bought it
    buyerName: varchar("buyer_name", { length: 255 }).notNull(),
    buyerEmail: varchar("buyer_email", { length: 255 }).notNull(),
    recipientName: varchar("recipient_name", { length: 255 }).notNull(),
    messageSnapshot: text("message_snapshot"), // ADD THIS! (The personal note)
    purchasedAt: timestamp("purchased_at").defaultNow(),
    redeemedAt: timestamp("redeemed_at"),
    campaignId: uuid("campaign_id").references(() => campaigns.id, {
      onDelete: "restrict",
    }),
    campaignDiscountPercentage: decimal("campaign_discount_percentage", {
      precision: 5,
      scale: 2,
    }),
  },
  (t) => [index("gift_cards_campaign_id_idx").on(t.campaignId)],
);

export const giftCardRedemptions = pgTable("gift_card_redemptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  giftCardId: uuid("gift_card_id")
    .references(() => giftCards.id)
    .notNull(),
  redeemedAt: timestamp("redeemed_at").defaultNow().notNull(),
});

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  serviceGroupTargets: many(campaignServiceGroups),
  categoryTargets: many(campaignCategories),
  treatmentTargets: many(campaignTreatments),
  reservations: many(campaignReservations),
  giftCards: many(giftCards),
}));

export const campaignServiceGroupsRelations = relations(
  campaignServiceGroups,
  ({ one }) => ({
    campaign: one(campaigns, {
      fields: [campaignServiceGroups.campaignId],
      references: [campaigns.id],
    }),
    serviceGroup: one(serviceGroups, {
      fields: [campaignServiceGroups.serviceGroupId],
      references: [serviceGroups.id],
    }),
  }),
);

export const campaignCategoriesRelations = relations(
  campaignCategories,
  ({ one }) => ({
    campaign: one(campaigns, {
      fields: [campaignCategories.campaignId],
      references: [campaigns.id],
    }),
    category: one(categories, {
      fields: [campaignCategories.categoryId],
      references: [categories.id],
    }),
  }),
);

export const campaignTreatmentsRelations = relations(
  campaignTreatments,
  ({ one }) => ({
    campaign: one(campaigns, {
      fields: [campaignTreatments.campaignId],
      references: [campaigns.id],
    }),
    treatment: one(treatments, {
      fields: [campaignTreatments.treatmentId],
      references: [treatments.id],
    }),
  }),
);

export const campaignReservationsRelations = relations(
  campaignReservations,
  ({ one }) => ({
    campaign: one(campaigns, {
      fields: [campaignReservations.campaignId],
      references: [campaigns.id],
    }),
    giftCard: one(giftCards, {
      fields: [campaignReservations.giftCardId],
      references: [giftCards.id],
    }),
  }),
);

export const giftCardsRelations = relations(giftCards, ({ one, many }) => ({
  redemptions: many(giftCardRedemptions),
  campaign: one(campaigns, {
    fields: [giftCards.campaignId],
    references: [campaigns.id],
  }),
  campaignReservation: one(campaignReservations),
}));

export const giftCardRedemptionsRelations = relations(
  giftCardRedemptions,
  ({ one }) => ({
    giftCard: one(giftCards, {
      fields: [giftCardRedemptions.giftCardId],
      references: [giftCards.id],
    }),
  }),
);

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  // The actual review text, translatable
  text: jsonb("text").$type<I18nString>().notNull(),
  rating: integer("rating").default(5).notNull(),
  // E.g., { es: "Hace 2 semanas", en: "2 weeks ago" }
  date: timestamp("date", { mode: "date" }).defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
});

export const siteSettings = pgTable("site_settings", {
  // We use a fixed string 'singleton' as the ID so there is only ever ONE row.
  id: varchar("id", { length: 20 }).primaryKey().default("singleton"),

  headingFont: varchar("heading_font", { length: 50 })
    .default("inter")
    .notNull(),
  bodyFont: varchar("body_font", { length: 50 }).default("inter").notNull(),
  uiFont: varchar("ui_font", { length: 50 }).default("inter").notNull(),

  // Translatable Marketing Copy
  businessName: varchar("business_name", { length: 255 }).notNull(),
  heroTagline: jsonb("hero_tagline").$type<I18nString>().notNull(),
  aboutUsText: jsonb("about_us_text").$type<I18nString>().notNull(),
  aboutImage: text("about_image"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  pdfBackgroundUrl: text("pdf_background_url"),
  // Contact & Location Data
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 50 }).notNull(),
  streetAddress: varchar("street_address", { length: 255 }).notNull(),
  addressLocality: varchar("address_locality", { length: 100 }).notNull(),
  addressRegion: varchar("address_region", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  addressCountry: varchar("address_country", { length: 2 })
    .default("ES")
    .notNull(),
  mapsLink: text("maps_link").notNull(),

  schedules: jsonb("schedules")
    .$type<
      {
        startDay: number;
        endDay: number | null;
        hours: string;
      }[]
    >()
    .default([]),

  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  freshaUrl: text("fresha_url"),

  partners: jsonb("partners")
    .$type<{ name: string; url: string }[]>()
    .default([]),
  faqHero: jsonb("faq_hero").$type<{
    title: I18nString;
    subtitle: I18nString;
  }>(),
  faqCta: jsonb("faq_cta").$type<{
    title: I18nString;
    subtitle: I18nString;
    button: I18nString;
    whatsappMsg: I18nString;
  }>(),
  faqSections: jsonb("faq_sections")
    .$type<
      {
        id: string;
        title: I18nString;
        questions: { question: I18nString; answer: I18nString }[];
      }[]
    >()
    .default([]),
  heroGallery: jsonb("hero_gallery")
    .$type<
      {
        id: string;
        slideType?: "treatment" | "campaign";
        treatmentId?: string;
        campaignId?: string;
        desktopUrl: string;
        mobileUrl: string;
        title: I18nString;
        subtitle: I18nString;
        buttonText: I18nString;
        isActive: boolean;
      }[]
    >()
    .default([]),
});

export const visits = pgTable("visits", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  visitedAt: timestamp("visited_at").defaultNow().notNull(),
  visitorHash: text("visitor_hash").notNull(),
  device: text("device").default("desktop"),
  source: text("source").default("direct"),
  userAgent: text("user_agent"),
  referer: text("referer"),
});

export const serviceGroupsRelations = relations(serviceGroups, ({ many }) => ({
  categories: many(categories),
  treatments: many(treatments),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  group: one(serviceGroups, {
    fields: [categories.groupId],
    references: [serviceGroups.id],
  }),
  treatments: many(treatments),
}));

export const treatmentsRelations = relations(treatments, ({ one, many }) => ({
  serviceGroup: one(serviceGroups, {
    // <-- ADD THIS BLOCK
    fields: [treatments.serviceGroupId],
    references: [serviceGroups.id],
  }),
  category: one(categories, {
    fields: [treatments.categoryId],
    references: [categories.id],
  }),
  variants: many(treatmentVariants),
}));

export const treatmentVariantsRelations = relations(
  treatmentVariants,
  ({ one }) => ({
    treatment: one(treatments, {
      fields: [treatmentVariants.treatmentId],
      references: [treatments.id],
    }),
  }),
);

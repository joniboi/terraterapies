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
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

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

// 1. SERVICE GROUPS (The high-level pillars: Massages, Rituals, Products)
export const serviceGroups = pgTable("service_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // 'treatments', 'rituals'
  label: jsonb("label").$type<I18nString>().notNull(),
  layout: varchar("layout", { length: 50 }).default("mega-menu"), // 'mega-menu', 'rich-dropdown'
  highlight: boolean("highlight").default(false).notNull(),
  emoji: varchar("emoji", { length: 10 }),
  orderIndex: integer("order_index").default(0),
});

// 2. CATEGORIES
export const categories = pgTable("categories", {
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
});

export const treatments = pgTable("treatments", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),
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
});

// 4. VARIANTS (The actual sellable options: 60min, 90min)
export const treatmentVariants = pgTable("treatment_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  treatmentId: uuid("treatment_id")
    .references(() => treatments.id)
    .notNull(),
  duration: integer("duration").notNull(), // numeric value only
  unit: varchar("unit", { length: 20 }).default("min").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),

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
// 5. GIFT CARDS (The Registry)
export const giftCards = pgTable("gift_cards", {
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
  // Who bought it
  buyerName: varchar("buyer_name", { length: 255 }).notNull(),
  buyerEmail: varchar("buyer_email", { length: 255 }).notNull(),
  recipientName: varchar("recipient_name", { length: 255 }).notNull(),
  messageSnapshot: text("message_snapshot"), // ADD THIS! (The personal note)
  purchasedAt: timestamp("purchased_at").defaultNow(),
  redeemedAt: timestamp("redeemed_at"),
});

export const serviceGroupsRelations = relations(serviceGroups, ({ many }) => ({
  categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  group: one(serviceGroups, {
    fields: [categories.groupId],
    references: [serviceGroups.id],
  }),
  treatments: many(treatments),
}));

export const treatmentsRelations = relations(treatments, ({ one, many }) => ({
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

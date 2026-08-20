Here is the complete **Phase 2 Implementation Plan**.

I have rigidly adhered to your constraints. Schema changes are cleanly separated from data transformations. The router dynamically infers the entity type strictly from the database state, hardcoding zero slugs. The `isActive` toggle securely prunes empty groups and categories from the public frontend while preserving them in the backoffice.

---

### 1. Old URL → New URL Mapping (SEO Protection)

Because we are preserving the **Option A** URL philosophy (2 segments maximum), 85% of your URLs remain completely untouched (e.g., `/es/orientales/balines`, `/es/rituales/ritual-luxury`).

We only need to map the four poorly-named legacy categories to their correct new Service Group / Category slugs.

| Treatment / Content          | Old URL (Indexed)                      | New URL (Target)                          |
| :--------------------------- | :------------------------------------- | :---------------------------------------- |
| **Bono de 3 sesiones**       | `/es/bono-sesion/bono-3`               | `/es/bonos/bono-3`                        |
| **Bono de 5 sesiones**       | `/es/bono-sesion/bono`                 | `/es/bonos/bono`                          |
| **Bono de 10 sesiones**      | `/es/bono-sesion/bono-sesion10`        | `/es/bonos/bono-sesion10`                 |
| **Facial Vegano**            | `/es/facials/vegan-cleansing`          | `/es/faciales/vegan-cleansing`            |
| **Facial Embarazadas**       | `/es/facials/facial-pregnant`          | `/es/faciales/facial-pregnant`            |
| **HydraGlow**                | `/es/facials/deep-vegan-facial`        | `/es/faciales/deep-vegan-facial`          |
| **Facial Detox**             | `/es/facials/facial-detox`             | `/es/faciales/facial-detox`               |
| **Vegan Vitamin C**          | `/es/facials/lumiere-vitc`             | `/es/faciales/lumiere-vitc`               |
| **Glow & Balance**           | `/es/facials/reflex-facial`            | `/es/faciales/reflex-facial`              |
| **Pareja Premium**           | `/es/pareja-01/pareaj-2`               | `/es/rituales-en-pareja/pareaj-2`         |
| **Exp. Completa Parejas**    | `/es/pareja-01/pareja2-complete`       | `/es/rituales-en-pareja/pareja2-complete` |
| **Masaje en Pareja**         | `/es/pareja-01/couple-1`               | `/es/rituales-en-pareja/couple-1`         |
| **Ritual Luxe Pareja**       | `/es/pareja-01/pareja-luxury1`         | `/es/rituales-en-pareja/pareja-luxury1`   |
| **Quiromasaje**              | `/es/terapeutico-relajante/quiromasje` | `/es/terapeuticos/quiromasje`             |
| _(Any other in Terapéutico)_ | `/es/terapeutico-relajante/[slug]`     | `/es/terapeuticos/[slug]`                 |

_Note: The Gastronomy package has no public URL because it will be migrated as `isActive = false`._

---

### 2. Database Migration Strategy (Safe & Repeatable)

You can run this safely against a production replica. It separates schema modifications from the data transformation.

#### Step 2A: Schema Preparation (SQL)

```sql
BEGIN;

-- 1. Add Service Group Editorial Fields
ALTER TABLE service_groups ADD COLUMN description JSONB;
ALTER TABLE service_groups ADD COLUMN image TEXT;
ALTER TABLE service_groups ADD COLUMN hero_images JSONB;
ALTER TABLE service_groups ADD COLUMN show_case JSONB;
ALTER TABLE service_groups ADD COLUMN badge JSONB;

-- 2. Modify Treatments Table
ALTER TABLE treatments ADD COLUMN service_group_id UUID;
ALTER TABLE treatments ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

COMMIT;
```

#### Step 2B: Data Transformation (SQL)

```sql
BEGIN;

-- 1. Ensure core groups exist (Idempotent)
INSERT INTO service_groups (id, slug, label, layout, highlight, emoji) VALUES
  ('38afb6ca-4d39-495d-baf2-5d2f6b7e67cf', 'masajes', '{"es":"Masajes", "ca":"Massatges", "en":"Massages"}', 'mega-menu', false, '💆')
  ON CONFLICT (id) DO UPDATE SET slug = 'masajes';

INSERT INTO service_groups (id, slug, label, layout, highlight, emoji) VALUES
  ('702c46e3-1600-431b-b326-b0861e860a8a', 'rituales', '{"es":"Rituales", "ca":"Rituals", "en":"Rituals"}', 'rich-dropdown', true, '✨')
  ON CONFLICT (id) DO UPDATE SET slug = 'rituales';

INSERT INTO service_groups (slug, label, layout, highlight, emoji) VALUES
  ('faciales', '{"es":"Faciales", "ca":"Facials", "en":"Facials"}', 'mega-menu', false, '✨'),
  ('rituales-en-pareja', '{"es":"Rituales en Pareja", "ca":"Rituals en Parella", "en":"Couples Rituals"}', 'mega-menu', true, '👫'),
  ('bonos', '{"es":"Bonos", "ca":"Bons", "en":"Vouchers"}', 'rich-dropdown', false, '🎁')
ON CONFLICT (slug) DO NOTHING;

-- 2. Link treatments to groups via their current categories
UPDATE treatments t SET service_group_id = c.group_id FROM categories c WHERE t.category_id = c.id;

-- 3. Correct the Groups for the newly created groups
UPDATE treatments SET service_group_id = (SELECT id FROM service_groups WHERE slug = 'faciales')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'facials');

UPDATE treatments SET service_group_id = (SELECT id FROM service_groups WHERE slug = 'bonos')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'bono-sesion');

UPDATE treatments SET service_group_id = (SELECT id FROM service_groups WHERE slug = 'rituales-en-pareja')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'pareja-01');

-- 4. Fix the Gastronomy Package (Set inactive, assign a valid slug)
UPDATE treatments
SET is_active = false, slug = 'pack-masaje-y-gastronomia'
WHERE slug = '';

-- 5. Flatten direct treatments (Nullify category_id)
UPDATE treatments
SET category_id = NULL
WHERE service_group_id != (SELECT id FROM service_groups WHERE slug = 'masajes');

-- 6. Clean up legacy categories & rename Terapéuticos
DELETE FROM categories WHERE slug IN ('facials', 'bono-sesion', 'rituales', 'pareja-01');
UPDATE categories SET slug = 'terapeuticos', title = '{"es":"Terapéuticos", "ca":"Terapèutics", "en":"Therapeutic"}' WHERE slug = 'terapeutico-relajante';

COMMIT;
```

#### Step 2C: Schema Constraint Locking (SQL)

```sql
BEGIN;

-- Apply rigorous architectural constraints
ALTER TABLE treatments ALTER COLUMN service_group_id SET NOT NULL;
ALTER TABLE treatments ALTER COLUMN category_id DROP NOT NULL;

ALTER TABLE categories ADD CONSTRAINT categories_id_group_id_unq UNIQUE (id, group_id);

ALTER TABLE treatments ADD CONSTRAINT treatments_category_group_fk
  FOREIGN KEY (category_id, service_group_id) REFERENCES categories(id, group_id) MATCH SIMPLE;

ALTER TABLE treatments ADD CONSTRAINT slug_active_check
  CHECK (is_active = false OR length(trim(slug)) > 0);

COMMIT;
```

```sql
BEGIN;

-- 1. Restore 'rituales' editorial data from 'rituales' category
UPDATE service_groups
SET
description = '{"ca": "Experiències completes que combinen el millor de les nostres tècniques. Dissenyades per renovar cos i ment a través d''una seqüència perfecta de tractaments.", "en": "Complete experiences combining the best of our techniques. Designed to reset body and mind through a perfect sequence of treatments.", "es": "Experiencias completas que combinan lo mejor de nuestras técnicas. Diseñadas para renovar cuerpo y mente a través de una secuencia perfecta de tratamientos."}'::jsonb,
image = '/images/categories/rituals.png',
hero_images = '[{"alt": "Ritual 1", "src": "/images/hero/rituals1.jpg"}, {"alt": "Ritual 2", "src": "/images/hero/rituals2.jpg"}, {"alt": "Ritual 3", "src": "/images/hero/rituals3.jpg"}]'::jsonb,
show_case = '{"title": {"ca": "Tria el teu Ritual", "en": "Choose your Ritual", "es": "Elige tu Ritual"}, "description": {"ca": "Més que un massatge, un viatge complet de renovació.", "en": "More than a massage, a complete journey of renewal.", "es": "Más que un masaje, un viaje completo de renovación."}}'::jsonb,
badge = '{"ca": "✨ Experiència Exclusiva", "en": "✨ Exclusive Experience", "es": "✨ Experiencia Exclusiva"}'::jsonb,
highlight = true, -- Matches 'is_featured = t' from production categories dump
order_index = 2
WHERE slug = 'rituales';

-- 2. Restore 'rituales-en-pareja' editorial data from 'pareja-01' category
UPDATE service_groups
SET
description = '{"ca": "Una experiència exclusiva per a parelles, creada per gaudir-la junts en un ambient de desconnexió total. Un ritual de benestar per renovar el cos, la ment i l''ànima.", "en": "An exclusive experience for couples, created to be enjoyed together in an atmosphere of complete disconnection. A wellness ritual to renew body, mind, and soul.", "es": "Una experiencia exclusiva para parejas, creada para disfrutar juntos en un ambiente de total desconexión. Un ritual de bienestar para renovar cuerpo, mente y alma."}'::jsonb,
image = '/uploads/3574163e-4925-4266-b7f1-7984203ddffa.webp',
hero_images = '[{"alt": "", "src": "/uploads/9bdb9445-f5ec-4b21-acea-04488deae859.webp"}]'::jsonb,
show_case = '{"items": []}'::jsonb,
badge = '{"ca": "✨ Experiència Exclusiva per a Parelles", "en": "✨ Exclusive Experience for Couples", "es": "✨ Experiencia Exclusiva para Pareja"}'::jsonb,
highlight = true, -- Matches 'is_featured = t' from production categories dump
order_index = 3
WHERE slug = 'rituales-en-pareja';

-- 3. Restore 'faciales' editorial data from 'facials' category
UPDATE service_groups
SET
description = '{"ca": "Treballem amb SCENS, un distribuïdor de confiança de cosmètica pura, orgànica i vegana, per oferir-te una experiència de cura facial natural amb resultats visibles des de la primera sessió.", "en": "We work with SCENS, a trusted distributor of pure, organic and vegan cosmetics, to offer you a natural facial care experience with visible results from the very first session.", "es": "Trabajamos con SCENS, un distribuidor de confianza de cosmética pura, orgánica y vegana, para ofrecerte una experiencia de cuidado facial natural con resultados visibles desde la primera sesión."}'::jsonb,
image = '/uploads/98aaefb3-0348-44d0-b301-981c5ad61d51.webp',
hero_images = '[{"alt": "", "src": "/uploads/f033c6c4-f447-4637-bb8b-ae6e32e3858c.webp"}]'::jsonb,
show_case = '{"items": []}'::jsonb,
badge = '{"ca": "Tractaments facials clàssics", "en": "Classic facial treatments", "es": "Tratamientos faciales clasicos"}'::jsonb,
highlight = true, -- Matches 'is_featured = t' from production categories dump
order_index = 1
WHERE slug = 'faciales';

-- 4. Restore 'bonos' editorial data from 'bono-sesion' category
UPDATE service_groups
SET
description = '{"ca": "“Aquest paquet és l’opció amb millor relació qualitat-preu de totes.”", "en": "This pack represents the most cost-effective option of all", "es": "Este pack representa la opción más económica de todas."}'::jsonb,
image = '/uploads/8e07cb98-4056-4d12-affa-4683044fa56a.webp',
hero_images = '[{"alt": "", "src": "/uploads/b846b604-6f3e-4923-96e5-30593a33b2f0.webp"}]'::jsonb,
show_case = '{"items": []}'::jsonb,
badge = '{"ca": "Fins a un 25% de descompte", "en": "Up to 25% discount", "es": "Hasta un 25% de descuento"}'::jsonb,
highlight = true, -- Matches 'is_featured = t' from production categories dump
order_index = 4
WHERE slug = 'bonos';

-- 5. Safe default for consolidated 'masajes' parent group using existing asset paths
UPDATE service_groups
SET
description = '{"ca": "Massatges terapèutics i relaxants dissenyats per alleujar la tensió i restaurar l''equilibri natural del cos.", "en": "Therapeutic and relaxing massages designed to relieve tension and restore the body''s natural balance.", "es": "Masajes terapéuticos y relajantes diseñados para aliviar la tensión y restaurar el equilibrio natural del cuerpo."}'::jsonb,
image = '/images/categories/relajantes.jpg', -- Safely reuse a production-known image asset
badge = '{"ca": "💆 Benestar Diari", "en": "💆 Daily Wellness", "es": "💆 Bienestar Diario"}'::jsonb,
highlight = false,
order_index = 0
WHERE slug = 'masajes';

COMMIT;
```

### 3. Application Code: Drizzle Schema (`db/schema.ts`)

Update the definitions inside `db/schema.ts`:

```typescript
import { unique, foreignKey, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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
    // ... existing fields ...
  },
  (t) => [unique("categories_id_group_id_unq").on(t.id, t.groupId)],
);

// 3. TREATMENTS
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
    // ... existing fields ...
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
```

---

### 4. Application Code: Domain Types (`types/definitions.ts`)

Replace `ServicesData` with a strictly typed Domain Model:

```typescript
export interface ServiceGroup {
  id: string; // The slug is used as the ID in the frontend
  slug: string;
  title: string;
  description?: string;
  image?: string;
  layout: "mega-menu" | "rich-dropdown";
  highlight: boolean;
  emoji?: string;
  badge?: string;
  heroImages?: { src: string; alt: string }[];
  showCase?: { title: string; description: string };
  // The crucial structural split
  categories: Category[];
  treatments: Treatment[]; // Direct treatments
}

export interface Category {
  slug: string;
  title: string;
  description: string;
  image: string;
  isFeatured: boolean;
  badge?: string;
  heroImages?: { src: string; alt: string }[];
  showCase?: { title: string; description: string };
  treatments: Treatment[];
}

export interface Treatment {
  slug: string;
  title: string;
  emoji: string;
  image: string;
  backgroundImage: string;
  tagline?: string;
  shortDescription: string;
  longDescription: string;
  options: Option[];
  hasPromo: boolean;
  promoBadgeText?: string;
  isActive: boolean;
}
// ... Option interface remains unchanged ...
```

---

### 5. Application Code: The Data Provider (`app/lib/getService.ts`)

This securely queries the DB and builds the domain model. It automatically strips empty groups/categories resulting from inactive treatments.

```typescript
import "server-only";
import { db } from "@/db";
import { ServiceGroup, Category, Treatment } from "@/types/definitions";
import { unstable_noStore as noStore } from "next/cache";

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

// Extracted mapping logic for reusability
function mapTreatment(t: any, lang: string): Treatment {
  // ... [Keep your exact existing promo mapping logic here] ...
  return {
    slug: t.slug,
    title: getTranslation(t.title, lang),
    emoji: t.emoji || "🌸",
    image: t.image,
    backgroundImage: t.backgroundImage || "/images/treatment-detail.jpg",
    shortDescription: getTranslation(t.shortDescription, lang),
    longDescription: getTranslation(t.longDescription, lang),
    options: mappedOptions,
    hasPromo: maxDiscountPercentage > 0,
    promoBadgeText:
      maxDiscountPercentage > 0 ? `-${maxDiscountPercentage}%` : undefined,
    isActive: t.isActive,
  };
}
```

---

### 6. Application Code: Next.js Catch-All Router (`app/[lang]/(default)/[...slug]/page.tsx`)

Delete the old `[category]` and `[subcategory]` folders. Create this file to intelligently route requests based on the database.

```typescript
import { getServicesData } from "@/app/lib/getService";
import { notFound } from "next/navigation";
import CategoryHero from "@/components/categories/categoryHero";
import SubcategoryShowcase from "@/components/categories/subcategory-grid";
import TreatmentDetail from "@/components/treatment-detail";
import { db } from "@/db";

export default async function CatchAllRoute(props: { params: Promise<{ lang: string; slug: string[] }> }) {
  const { lang, slug } = await props.params;
  const data = await getServicesData(lang); // By default, filters inactive treatments
  const settings = await db.query.siteSettings.findFirst();

  // PATH TYPE 1: Single Segment (e.g. /masajes OR /orientales)
  if (slug.length === 1) {
    const targetSlug = slug[0];

    // Check if it's a Service Group
    const group = data.find(g => g.slug === targetSlug);
    if (group) {
      if (group.categories.length > 0) {
        // Render Group Landing Page (shows Categories)
        return (
          <main>
             <CategoryHero title={group.title} images={group.heroImages || [{ src: group.image, alt: group.title }]} />
             <SubcategoryShowcase items={group.categories.map(c => ({ ...c, link: `/${lang}/${c.slug}` }))} />
          </main>
        );
      } else {
        // Render Group Treatment Listing (e.g. Faciales)
        return (
          <main>
             <CategoryHero title={group.title} images={group.heroImages || [{ src: group.image, alt: group.title }]} />
             <SubcategoryShowcase items={group.treatments.map(t => ({ ...t, link: `/${lang}/${group.slug}/${t.slug}` }))} />
          </main>
        );
      }
    }

    // Check if it's a Category (e.g. /orientales)
    for (const g of data) {
      const category = g.categories.find(c => c.slug === targetSlug);
      if (category) {
        return (
          <main>
             <CategoryHero title={category.title} images={category.heroImages || [{ src: category.image, alt: category.title }]} />
             <SubcategoryShowcase items={category.treatments.map(t => ({ ...t, link: `/${lang}/${category.slug}/${t.slug}` }))} />
          </main>
        );
      }
    }
  }

  // PATH TYPE 2: Two Segments (e.g. /orientales/balines OR /faciales/hydraglow)
  if (slug.length === 2) {
    const parentSlug = slug[0];
    const treatmentSlug = slug[1];

    for (const g of data) {
      // Is it Group -> Direct Treatment?
      if (g.slug === parentSlug) {
        const treatment = g.treatments.find(t => t.slug === treatmentSlug);
        if (treatment) return renderTreatment(treatment, lang, settings);
      }
      // Is it Category -> Treatment?
      const category = g.categories.find(c => c.slug === parentSlug);
      if (category) {
        const treatment = category.treatments.find(t => t.slug === treatmentSlug);
        if (treatment) return renderTreatment(treatment, lang, settings);
      }
    }
  }

  // Not found in active data -> 404 (Safely hides inactive treatments)
  notFound();
}

function renderTreatment(treatment: any, lang: string, settings: any) {
   return (
     <TreatmentDetail
       title={treatment.title}
       description={treatment.longDescription}
       options={treatment.options}
       lang={lang}
       backgroundImage={treatment.backgroundImage}
       bookingUrl={settings?.freshaUrl}
       businessName={settings?.businessName}
       // Pass necessary translation dictionaries here
     />
   );
}
```

---

### 7. Application Code: SEO Redirects (`next.config.ts`)

Map the legacy slugs so Google preserves the SEO juice smoothly.

```typescript
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:lang/facials/:slug*",
        destination: "/:lang/faciales/:slug*",
        permanent: true,
      },
      {
        source: "/:lang/bono-sesion/:slug*",
        destination: "/:lang/bonos/:slug*",
        permanent: true,
      },
      {
        source: "/:lang/pareja-01/:slug*",
        destination: "/:lang/rituales-en-pareja/:slug*",
        permanent: true,
      },
      {
        source: "/:lang/terapeutico-relajante/:slug*",
        destination: "/:lang/terapeuticos/:slug*",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
```

---

### 8. Admin Backoffice: Treatment Form Updates

Update `app/(backoffice)/admin/treatments/_components/treatment-form.tsx` to handle the new `Service Group` hierarchy and `isActive` toggle.

```tsx
// Inside the component...
const [formData, setFormData] = useState({
  ...initialData,
  serviceGroupId: initialData?.serviceGroupId || "",
  categoryId: initialData?.categoryId || null,
  isActive: initialData?.isActive ?? true,
});

// Calculate available categories dynamically based on selected group
const availableCategories = categories.filter(
  (c: any) => c.groupId === formData.serviceGroupId,
);

// Render Section 1 Updates:
<FormGrid cols={4}>
  <div className="md:col-span-4 flex justify-end pb-4">
    <label className="flex items-center space-x-2 bg-muted/30 p-2 rounded-md border cursor-pointer">
      <Checkbox
        checked={formData.isActive}
        onCheckedChange={(v) => updateField("isActive", !!v)}
      />
      <span className="font-semibold text-sm">
        Visible to Customers (Active)
      </span>
    </label>
  </div>

  <FormField label="Service Group (Required)">
    <Select
      value={formData.serviceGroupId}
      onValueChange={(v) => {
        updateField("serviceGroupId", v);
        updateField("categoryId", null); // Reset category when group changes
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Group" />
      </SelectTrigger>
      <SelectContent>
        {groups.map((g: any) => (
          <SelectItem key={g.id} value={g.id}>
            {g.label.es}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </FormField>

  {availableCategories.length > 0 && (
    <FormField label="Category (Optional)">
      <Select
        value={formData.categoryId || "none"}
        onValueChange={(v) =>
          updateField("categoryId", v === "none" ? null : v)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">
            -- No Category (Direct to Group) --
          </SelectItem>
          {availableCategories.map((c: any) => (
            <SelectItem key={c.id} value={c.id}>
              {c.title.es}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )}
  {/* ... slug and emoji inputs ... */}
</FormGrid>;
```

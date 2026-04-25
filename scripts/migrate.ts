import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import * as fs from "fs";
import * as path from "path";
import { db } from "../db/index"; // Ensure this path is correct for your db/index.ts
import * as schema from "../db/schema";

async function migrate() {
  console.log("🚀 Starting Migration: JSON ➡️ PostgreSQL");

  // 1. Load the 3 language files
  const esData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data/es/services.json"), "utf8"),
  );
  const caData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data/ca/services.json"), "utf8"),
  );
  const enData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data/en/services.json"), "utf8"),
  );

  // 2. Load the Prices file
  const pricesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data/prices.json"), "utf8"),
  );

  try {
    // We iterate through the "NavItems" (Service Groups) using the Spanish file as the structural guide
    for (const item of esData.navItems) {
      console.log(`📦 Processing Group: ${item.label}`);

      // Find the equivalent items in other languages for translation
      const caItem = caData.navItems.find((i: any) => i.id === item.id);
      const enItem = enData.navItems.find((i: any) => i.id === item.id);

      // INSERT SERVICE GROUP
      const [newGroup] = await db
        .insert(schema.serviceGroups)
        .values({
          slug: item.id, // e.g., 'treatments'
          label: {
            es: item.label,
            ca: caItem?.label || item.label,
            en: enItem?.label || item.label,
          },
          layout: item.layout || "mega-menu",
          highlight: item.highlight || false,
          emoji: item.emoji || "",
        })
        .returning();

      // ITERATE CATEGORIES (e.g., Orientales, Relajantes)
      for (const cat of item.categories) {
        console.log(`  📂 Processing Category: ${cat.title}`);

        const caCat = caItem.categories.find((c: any) => c.slug === cat.slug);
        const enCat = enItem.categories.find((c: any) => c.slug === cat.slug);

        // INSERT CATEGORY
        const [newCategory] = await db
          .insert(schema.categories)
          .values({
            groupId: newGroup.id,
            slug: cat.slug,
            image: cat.image,
            isFeatured: cat.isFeatured || false, // Capture the featured flag!
            badge: {
              es: cat.badge || "",
              ca: caCat?.badge || "",
              en: enCat?.badge || "",
            },
            title: {
              es: cat.title,
              ca: caCat?.title || cat.title,
              en: enCat?.title || cat.title,
            },
            description: {
              es: cat.shortDescription,
              ca: caCat?.shortDescription || cat.shortDescription,
              en: enCat?.shortDescription || cat.shortDescription,
            },
            heroImages: cat.heroImages || [],
            showCase: {
              title: {
                es: cat.showCase?.title || "",
                ca: caCat?.showCase?.title || cat.showCase?.title || "",
                en: enCat?.showCase?.title || cat.showCase?.title || "",
              },
              description: {
                es: cat.showCase?.description || "",
                ca:
                  caCat?.showCase?.description ||
                  cat.showCase?.description ||
                  "",
                en:
                  enCat?.showCase?.description ||
                  cat.showCase?.description ||
                  "",
              },
            },
          })
          .returning();

        // ITERATE TREATMENTS (e.g., Tailandes, Balines)
        for (const sub of cat.subcategories) {
          console.log(`    ✨ Processing Treatment: ${sub.title}`);

          const caSub = caCat.subcategories.find(
            (s: any) => s.slug === sub.slug,
          );
          const enSub = enCat.subcategories.find(
            (s: any) => s.slug === sub.slug,
          );

          // INSERT TREATMENT
          const [newTreatment] = await db
            .insert(schema.treatments)
            .values({
              categoryId: newCategory.id,
              slug: sub.slug,
              emoji: sub.emoji || "🌸",
              image: sub.image,
              backgroundImage:
                sub.backgroundImage || "/images/treatment-detail.jpg",
              title: {
                es: sub.title,
                ca: caSub?.title || sub.title,
                en: enSub?.title || sub.title,
              },
              tagline: {
                es: sub.tagline || "",
                ca: caSub?.tagline || sub.tagline || "",
                en: enSub?.tagline || sub.tagline || "",
              },
              shortDescription: {
                es: sub.shortDescription,
                ca: caSub?.shortDescription || sub.shortDescription,
                en: enSub?.shortDescription || sub.shortDescription,
              },
              longDescription: {
                es: sub.longDescription,
                ca: caSub?.longDescription || sub.longDescription,
                en: enSub?.longDescription || sub.longDescription,
              },
            })
            .returning();

          // ITERATE VARIANTS (Prices from prices.json + Labels from services.json)
          const treatmentPrices = pricesData[sub.slug];

          if (treatmentPrices && Array.isArray(treatmentPrices)) {
            for (let idx = 0; idx < treatmentPrices.length; idx++) {
              const priceOption = treatmentPrices[idx];

              // Get the specific labels for this variant (e.g. Traditional, Stretching)
              // from the options array of each language
              const esOpt = sub.options?.[idx] || {};
              const caOpt = caSub?.options?.[idx] || {};
              const enOpt = enSub?.options?.[idx] || {};

              console.log(
                `      💰 Adding Variant: ${priceOption.val}${priceOption.unit || "min"} - ${priceOption.price}€`,
              );

              await db.insert(schema.treatmentVariants).values({
                treatmentId: newTreatment.id,
                duration: priceOption.val,
                unit: priceOption.unit || "min",
                price: priceOption.price.toString(),
                // We map the prefix and suffix using the index
                prefix: {
                  es: esOpt.prefix || "",
                  ca: caOpt.prefix || esOpt.prefix || "", // Fallback to ES if CA is missing
                  en: enOpt.prefix || esOpt.prefix || "", // Fallback to ES if EN is missing
                },
                suffix: {
                  es: esOpt.suffix || "",
                  ca: caOpt.suffix || esOpt.suffix || "",
                  en: enOpt.suffix || esOpt.suffix || "",
                },
                orderIndex: idx, // Preserve the order from the JSON
              });
            }
          }
        }
      }
    }

    console.log("✅ Migration Finished Successfully!");
  } catch (error) {
    console.error("❌ Migration Failed:", error);
  } finally {
    process.exit();
  }
}

migrate();

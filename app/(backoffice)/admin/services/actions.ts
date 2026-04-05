"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function updateTreatmentAction(
  treatmentId: string,
  formData: any,
) {
  try {
    // 1. Update the Main Treatment Info
    await db
      .update(schema.treatments)
      .set({
        categoryId: formData.categoryId,
        emoji: formData.emoji,
        title: formData.title,
        tagline: formData.tagline,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        image: formData.image,
        backgroundImage: formData.backgroundImage,
      })
      .where(eq(schema.treatments.id, treatmentId));

    // 2. Update Prices (Variants)
    // First, delete the old ones for this treatment
    await db
      .delete(schema.treatmentVariants)
      .where(eq(schema.treatmentVariants.treatmentId, treatmentId));

    // Then, insert the new ones
    if (formData.variants && formData.variants.length > 0) {
      const variantsToInsert = formData.variants.map(
        (v: any, index: number) => ({
          treatmentId: treatmentId,
          duration: Number(v.duration),
          unit: v.unit,
          price: v.price.toString(),
          prefix: v.prefix,
          suffix: v.suffix,
          orderIndex: index, // Keeps them in the exact order she dragged/arranged them
        }),
      );

      await db.insert(schema.treatmentVariants).values(variantsToInsert);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update treatment:", error);
    return { success: false, error: "Database error" };
  }
}

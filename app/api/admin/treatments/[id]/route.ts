import { db } from "@/db";
import { treatments, treatmentVariants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const params = await props.params;

  try {
    const body = await req.json();

    // 1. Update Treatment
    await db
      .update(treatments)
      .set({
        categoryId: body.categoryId,
        slug: body.slug, // <--- ADDED HERE
        emoji: body.emoji,
        title: body.title,
        tagline: body.tagline,
        shortDescription: body.shortDescription,
        longDescription: body.longDescription,
        image: body.image,
        backgroundImage: body.backgroundImage,
      })
      .where(eq(treatments.id, params.id));

    // 2. Replace Variants (Delete all, then insert new)
    await db
      .delete(treatmentVariants)
      .where(eq(treatmentVariants.treatmentId, params.id));

    if (body.variants && body.variants.length > 0) {
      const variantsToInsert = body.variants.map((v: any, index: number) => ({
        treatmentId: params.id,
        duration: Number(v.duration),
        unit: v.unit,
        price: v.price.toString(),
        promotionalPrice: v.promotionalPrice
          ? v.promotionalPrice.toString()
          : null,
        promoEndsAt: v.promoEndsAt ? new Date(v.promoEndsAt) : null,
        prefix: v.prefix,
        orderIndex: index,
      }));
      await db.insert(treatmentVariants).values(variantsToInsert);
    }

    return new NextResponse("Updated", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  // ... (Your DELETE code is already perfect)
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const params = await props.params;

  try {
    // Delete variants first (foreign key), then the treatment
    await db
      .delete(treatmentVariants)
      .where(eq(treatmentVariants.treatmentId, params.id));
    await db.delete(treatments).where(eq(treatments.id, params.id));

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Delete Failed", { status: 500 });
  }
}

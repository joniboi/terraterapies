import { db } from "@/db";
import { treatments, treatmentVariants } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();

    // 1. Insert Treatment
    const newTreatment = await db
      .insert(treatments)
      .values({
        categoryId: body.categoryId,
        slug: body.slug,
        emoji: body.emoji,
        title: body.title,
        tagline: body.tagline,
        shortDescription: body.shortDescription,
        longDescription: body.longDescription,
        image: body.image,
        backgroundImage: body.backgroundImage,
      })
      .returning();

    const treatmentId = newTreatment[0].id;

    // 2. Insert Variants
    if (body.variants && body.variants.length > 0) {
      const variantsToInsert = body.variants.map((v: any, index: number) => ({
        treatmentId: treatmentId,
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

    return NextResponse.json(newTreatment[0]);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

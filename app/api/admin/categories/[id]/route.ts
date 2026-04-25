import { db } from "@/db";
import { categories, treatments } from "@/db/schema";
import { count, eq } from "drizzle-orm";
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
    const result = await db
      .update(categories)
      .set({
        groupId: body.groupId,
        slug: body.slug,
        title: body.title,
        description: body.description,
        image: body.image,
        isFeatured: body.isFeatured,
        badge: body.badge,
        heroImages: body.heroImages,
        showCase: body.showCase,
      })
      .where(eq(categories.id, params.id))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;

  try {
    // 1. Check if there are treatments in this category
    const [treatmentCount] = await db
      .select({ val: count() })
      .from(treatments)
      .where(eq(treatments.categoryId, params.id));

    if (treatmentCount.val > 0) {
      return new NextResponse(
        "This category cannot be deleted because it contains treatments. Move or delete the treatments first.",
        { status: 400 },
      );
    }

    // 2. If empty, delete it
    await db.delete(categories).where(eq(categories.id, params.id));
    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

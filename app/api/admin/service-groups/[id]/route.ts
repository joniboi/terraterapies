import { db } from "@/db";
import { serviceGroups, categories, treatments } from "@/db/schema";
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
      .update(serviceGroups)
      .set({
        slug: body.slug,
        label: body.label,
        layout: body.layout,
        highlight: body.highlight,
        emoji: body.emoji,
        orderIndex: body.orderIndex,
        description: body.description,
        image: body.image,
        heroImages: body.heroImages,
        showCase: body.showCase,
        badge: body.badge,
      })
      .where(eq(serviceGroups.id, params.id))
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
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const params = await props.params;

  try {
    // 1. Check for dependent Categories
    const [categoryCount] = await db
      .select({ val: count() })
      .from(categories)
      .where(eq(categories.groupId, params.id));

    // 2. Check for dependent Treatments (Direct)
    const [treatmentCount] = await db
      .select({ val: count() })
      .from(treatments)
      .where(eq(treatments.serviceGroupId, params.id));

    if (categoryCount.val > 0 || treatmentCount.val > 0) {
      return new NextResponse(
        `Cannot delete this Service Group. It still contains ${categoryCount.val} categories and ${treatmentCount.val} direct treatments. Move or delete them first.`,
        { status: 400 },
      );
    }

    // 3. Delete if completely empty
    await db.delete(serviceGroups).where(eq(serviceGroups.id, params.id));
    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

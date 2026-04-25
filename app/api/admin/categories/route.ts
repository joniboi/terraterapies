import { db } from "@/db";
import { categories } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const result = await db
      .insert(categories)
      .values({
        groupId: body.groupId,
        slug: body.slug,
        title: body.title,
        description: body.description,
        image: body.image,
        isFeatured: body.isFeatured,
        badge: body.badge,
        heroImages: body.heroImages,
        showCase: body.showCase,
        orderIndex: body.orderIndex || 0,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

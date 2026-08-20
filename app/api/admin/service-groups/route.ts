import { db } from "@/db";
import { serviceGroups } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const result = await db
      .insert(serviceGroups)
      .values({
        slug: body.slug,
        label: body.label,
        layout: body.layout || "mega-menu",
        highlight: body.highlight || false,
        emoji: body.emoji || "",
        orderIndex: body.orderIndex || 0,
        description: body.description,
        image: body.image,
        heroImages: body.heroImages,
        showCase: body.showCase,
        badge: body.badge,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

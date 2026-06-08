import { db } from "@/db";
import { reviews } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const result = await db
      .insert(reviews)
      .values({
        authorName: body.authorName,
        text: body.text,
        rating: body.rating,
        date: new Date(body.date),
        isActive: body.isActive,
        orderIndex: body.orderIndex || 0,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

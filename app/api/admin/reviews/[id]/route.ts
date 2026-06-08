import { db } from "@/db";
import { reviews } from "@/db/schema";
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
    const result = await db
      .update(reviews)
      .set({
        authorName: body.authorName,
        text: body.text,
        rating: body.rating,
        date: new Date(body.date),
        isActive: body.isActive,
        orderIndex: body.orderIndex,
      })
      .where(eq(reviews.id, parseInt(params.id)))
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
    await db.delete(reviews).where(eq(reviews.id, parseInt(params.id)));
    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

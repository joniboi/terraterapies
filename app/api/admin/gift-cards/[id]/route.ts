import { db } from "@/db";
import { giftCards } from "@/db/schema";
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
    await db
      .update(giftCards)
      .set({
        status: "redeemed",
        redeemedAt: new Date(),
      })
      .where(eq(giftCards.id, params.id));

    return new NextResponse("Redeemed", { status: 200 });
  } catch (error) {
    return new NextResponse("Update Failed", { status: 500 });
  }
}

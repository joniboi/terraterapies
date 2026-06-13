import { db } from "@/db";
import { giftCardRedemptions, giftCards } from "@/db/schema";
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
    // 1. Fetch the current state of the card
    const card = await db.query.giftCards.findFirst({
      where: eq(giftCards.id, params.id),
    });

    if (!card) return new NextResponse("Not Found", { status: 404 });
    if (card.status === "redeemed")
      return new NextResponse("Already used", { status: 400 });

    // 2. Calculate the new visit count
    const newUsedSessions = card.usedSessions + 1;
    const isFullyFinished = newUsedSessions >= card.totalSessions;

    // 3. Update the Card
    await db
      .update(giftCards)
      .set({
        usedSessions: newUsedSessions,
        status: isFullyFinished ? "redeemed" : "valid",
        redeemedAt: isFullyFinished ? new Date() : null, // Final date only on last session
      })
      .where(eq(giftCards.id, params.id));

    // 4. Log this specific visit in the new History table
    await db.insert(giftCardRedemptions).values({
      giftCardId: card.id,
      redeemedAt: new Date(),
    });

    return new NextResponse("Visit Registered", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Update Failed", { status: 500 });
  }
}

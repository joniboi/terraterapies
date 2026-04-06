"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth"; // <--- Import Auth

export async function redeemGiftCardAction(id: string) {
  // 🔒 THE DOUBLE LOCK: Check if the person calling this is actually logged in
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized: You must be logged in to redeem cards.");
  }

  try {
    await db
      .update(schema.giftCards)
      .set({
        status: "redeemed",
        redeemedAt: new Date(),
      })
      .where(eq(schema.giftCards.id, id));

    revalidatePath("/admin/gift-cards");
    revalidatePath("/verify"); // Also refresh the verify page!

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

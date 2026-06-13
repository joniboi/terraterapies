import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../db";
import * as schema from "../db/schema";
import { eq, like } from "drizzle-orm";

async function patchDatabase() {
  console.log("Starting DB Patch...");

  // 1. Fix all already REDEEMED normal cards.
  // Since they were redeemed in the past, their usedSessions should be 1.
  console.log("Patching redeemed cards...");
  await db
    .update(schema.giftCards)
    .set({ usedSessions: 1 })
    .where(eq(schema.giftCards.status, "redeemed"));

  // 2. Fix the already sold Bonos (like Yassine's Bono de 5)
  console.log("Patching Bono de 5...");
  await db
    .update(schema.giftCards)
    .set({ totalSessions: 5 })
    .where(like(schema.giftCards.treatmentNameSnapshot, "%Bono de 5%"));

  console.log("Patching Bono de 3...");
  await db
    .update(schema.giftCards)
    .set({ totalSessions: 3 })
    .where(like(schema.giftCards.treatmentNameSnapshot, "%Bono de 3%"));

  console.log("Patching Bono de 10...");
  await db
    .update(schema.giftCards)
    .set({ totalSessions: 10 })
    .where(like(schema.giftCards.treatmentNameSnapshot, "%Bono de 10%"));

  console.log("✅ Database successfully patched!");
  process.exit(0);
}

patchDatabase().catch(console.error);

import { db } from "@/db";
import { sql } from "drizzle-orm";
import * as schema from "@/db/schema";

export async function generateLocator(buyerName: string): Promise<string> {
  // 1. First two letters (Upper case)
  const letters = buyerName.substring(0, 2).toUpperCase().padEnd(2, "X");

  // 2. Date DDMMYY
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const dateString = `${day}${month}${year}`;

  // 3. PostgreSQL Atomic Increment (The replacement for Upstash!)
  // This logic:
  //   a. Tries to insert a new row for today with count 1
  //   b. If it already exists, it adds 1 to the current count
  //   c. It returns the NEW count number
  const [result] = await db
    .insert(schema.dailyCounters)
    .values({ dateKey: dateString, count: 1 })
    .onConflictDoUpdate({
      target: schema.dailyCounters.dateKey,
      set: { count: sql`${schema.dailyCounters.count} + 1` },
    })
    .returning({ count: schema.dailyCounters.count }); // Explicitly return the count

  if (!result) throw new Error("Failed to generate locator counter");

  const counter = result.count;

  // 4. Format the suffix (001, 002...)
  // Note: If you reach 1000 sales, it will naturally expand to 1001, 1002...
  const suffix = String(counter).padStart(3, "0");

  return `${letters}-${dateString}-${suffix}`;
}

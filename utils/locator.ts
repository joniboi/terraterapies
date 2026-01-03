// utils/locator.ts
import { kv } from "@vercel/kv"; // Example using Vercel KV

export async function generateLocator(buyerName: string): Promise<string> {
  // 1. First two letters (Upper case)
  const letters = buyerName.substring(0, 2).toUpperCase();

  // 2. Date DDMMYY
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const dateString = `${day}${month}${year}`;

  // 3. Incremental Digits
  // We use Redis to increment a counter for this specific date key
  const key = `locator_counter:${dateString}`;
  const counter = await kv.incr(key); // Atomically increments (1, 2, 3...)

  const suffix = String(counter).padStart(3, "0"); // 001, 002...

  return `${letters}-${dateString}-${suffix}`;
}

"use server";

import { db } from "@/db";
import { visits } from "@/db/schema";
import { headers } from "next/headers";
import crypto from "crypto";

export async function logVisit(path: string, queryParams: string = "") {
  const headersList = await headers();
  // In Coolify/Docker, x-forwarded-for is the real IP
  const ip = headersList.get("x-forwarded-for") || "unknown";
  const userAgent = headersList.get("user-agent") || "";
  const referer = headersList.get("referer") || "";

  // 1. THE TITANIUM BOT FILTER
  const isBot =
    /bot|crawler|spider|crawling|facebookexternalhit|whatsapp|telegram|slurp|preview|lighthouse/i.test(
      userAgent,
    );
  if (isBot) return; // Ignore completely

  // 2. Detect Device
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
  const device = isMobile ? "mobile" : "desktop";

  // 3. Detect Source (Checks URL params first, then checks Referer headers)
  let source = "direct";
  const refLower = referer.toLowerCase();
  const paramsLower = queryParams.toLowerCase();

  if (
    paramsLower.includes("utm_source=instagram") ||
    paramsLower.includes("igsh=")
  ) {
    source = "instagram";
  } else if (paramsLower.includes("utm_source=google")) {
    source = "google";
  } else if (
    refLower.includes("instagram.com") ||
    refLower.includes("l.instagram.com")
  ) {
    source = "instagram";
  } else if (refLower.includes("facebook.com") || refLower.includes("fb.com")) {
    source = "facebook";
  } else if (refLower.includes("google.")) {
    source = "google";
  } else if (refLower.includes("treatwell")) {
    source = "treatwell";
  } else if (referer) {
    source = "other_website";
  }

  // 4. Create a daily unique hash for this user
  const today = new Date().toISOString().split("T")[0];
  const visitorHash = crypto
    .createHash("sha256")
    .update(`${ip}-${userAgent}-${today}`)
    .digest("hex");

  try {
    await db.insert(visits).values({
      path,
      visitorHash,
      device,
      source,
    });
  } catch (error) {
    console.error("Failed to log visit", error);
  }
}

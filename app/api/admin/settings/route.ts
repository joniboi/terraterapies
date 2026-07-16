// app/api/admin/settings/route.ts
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

// GET: Fetch the current settings (useful for client-side fetches)
export async function GET() {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const settings = await db.query.siteSettings.findFirst();
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST: Create or Update the Global Settings
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();

    // UPSERT: Insert if missing, Update if it already exists
    const result = await db
      .insert(siteSettings)
      .values({
        id: "singleton",
        businessName: body.businessName,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2,
        mapsLink: body.mapsLink,
        facebookUrl: body.facebookUrl,
        instagramUrl: body.instagramUrl,
        freshaUrl: body.freshaUrl,
        partners: body.partners,
        schedules: body.schedules,
        heroTagline: body.heroTagline,
        aboutUsText: body.aboutUsText,
        aboutImage: body.aboutImage,
        logoUrl: body.logoUrl,
        pdfBackgroundUrl: body.pdfBackgroundUrl,
      })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: {
          businessName: body.businessName,
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          addressLine1: body.addressLine1,
          addressLine2: body.addressLine2,
          mapsLink: body.mapsLink,
          facebookUrl: body.facebookUrl,
          instagramUrl: body.instagramUrl,
          freshaUrl: body.freshaUrl,
          partners: body.partners,
          schedules: body.schedules,
          heroTagline: body.heroTagline,
          aboutUsText: body.aboutUsText,
          aboutImage: body.aboutImage,
          logoUrl: body.logoUrl,
          faviconUrl: body.faviconUrl,
          pdfBackgroundUrl: body.pdfBackgroundUrl,
        },
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Settings save error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();

    const result = await db
      .update(siteSettings)
      .set(body)
      .where(eq(siteSettings.id, "singleton"))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Settings patch error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

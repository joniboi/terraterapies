import { db } from "@/db";
import {
  campaigns,
  campaignServiceGroups,
  campaignCategories,
  campaignTreatments,
  campaignReservations,
} from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql, eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const allCampaigns = await db.query.campaigns.findMany({
      orderBy: (c, { desc }) => [desc(c.createdAt)],
      with: {
        serviceGroupTargets: { with: { serviceGroup: true } },
        categoryTargets: { with: { category: true } },
        treatmentTargets: { with: { treatment: true } },
      },
    });

    // Compute active usage (completed sales + active unexpired holds)
    const usageCounts = await db
      .select({
        campaignId: campaignReservations.campaignId,
        count: sql<number>`count(*)::int`,
      })
      .from(campaignReservations)
      .where(
        sql`${campaignReservations.status} = 'completed' OR (${campaignReservations.status} = 'reserved' AND ${campaignReservations.expiresAt} > now())`,
      )
      .groupBy(campaignReservations.campaignId);

    const countMap = new Map(usageCounts.map((u) => [u.campaignId, u.count]));

    const enriched = allCampaigns.map((c) => ({
      ...c,
      currentPurchases: countMap.get(c.id) || 0,
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();

    // 1. Validation
    const name = body.name?.trim();
    const slug = body.slug?.trim().toLowerCase();
    const discount = parseFloat(body.discountPercentage);
    const maxPurchases = body.maxPurchases
      ? parseInt(body.maxPurchases, 10)
      : null;
    const startDate = body.startDate ? new Date(body.startDate) : null;
    const endDate = body.endDate ? new Date(body.endDate) : null;

    if (!name)
      return NextResponse.json(
        { error: "Campaign name is required" },
        { status: 400 },
      );
    if (!slug)
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      return NextResponse.json(
        { error: "Discount must be between 0.01% and 100%" },
        { status: 400 },
      );
    }
    if (maxPurchases !== null && (isNaN(maxPurchases) || maxPurchases <= 0)) {
      return NextResponse.json(
        { error: "Max purchases must be a positive integer" },
        { status: 400 },
      );
    }
    if (startDate && endDate && startDate > endDate) {
      return NextResponse.json(
        { error: "Start date must precede end date" },
        { status: 400 },
      );
    }
    if (!body.headline?.es || !body.description?.es) {
      return NextResponse.json(
        { error: "Spanish headline and description are required" },
        { status: 400 },
      );
    }

    // Check slug uniqueness
    const existing = await db.query.campaigns.findFirst({
      where: eq(campaigns.slug, slug),
    });
    if (existing) {
      return NextResponse.json(
        { error: "A campaign with this slug already exists" },
        { status: 400 },
      );
    }

    // 2. Insert Campaign in Transaction
    const [newCampaign] = await db
      .insert(campaigns)
      .values({
        name,
        slug,
        isActive: body.isActive ?? true,
        startDate,
        endDate,
        discountPercentage: discount.toFixed(2),
        maxPurchases,
        headline: body.headline,
        description: body.description,
        badge: body.badge || null,
      })
      .returning();

    // 3. Insert Targets
    if (body.serviceGroupIds?.length) {
      await db.insert(campaignServiceGroups).values(
        body.serviceGroupIds.map((id: string) => ({
          campaignId: newCampaign.id,
          serviceGroupId: id,
        })),
      );
    }
    if (body.categoryIds?.length) {
      await db.insert(campaignCategories).values(
        body.categoryIds.map((id: string) => ({
          campaignId: newCampaign.id,
          categoryId: id,
        })),
      );
    }
    if (body.treatmentIds?.length) {
      await db.insert(campaignTreatments).values(
        body.treatmentIds.map((id: string) => ({
          campaignId: newCampaign.id,
          treatmentId: id,
        })),
      );
    }

    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error: any) {
    console.error("Campaign creation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

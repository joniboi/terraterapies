import { db } from "@/db";
import {
  campaigns,
  campaignServiceGroups,
  campaignCategories,
  campaignTreatments,
  campaignReservations,
  giftCards,
} from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { eq, sql } from "drizzle-orm";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await props.params;

  try {
    const campaign = await db.query.campaigns.findFirst({
      where: eq(campaigns.id, id),
      with: {
        serviceGroupTargets: true,
        categoryTargets: true,
        treatmentTargets: true,
      },
    });

    if (!campaign) return new NextResponse("Not Found", { status: 404 });

    const [usage] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(campaignReservations)
      .where(
        sql`${campaignReservations.campaignId} = ${id} AND (${campaignReservations.status} = 'completed' OR (${campaignReservations.status} = 'reserved' AND ${campaignReservations.expiresAt} > now()))`,
      );

    return NextResponse.json({
      ...campaign,
      currentPurchases: usage?.count || 0,
      serviceGroupIds: campaign.serviceGroupTargets.map(
        (t) => t.serviceGroupId,
      ),
      categoryIds: campaign.categoryTargets.map((t) => t.categoryId),
      treatmentIds: campaign.treatmentTargets.map((t) => t.treatmentId),
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await props.params;

  try {
    const body = await req.json();

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
        { error: "Max purchases must be positive" },
        { status: 400 },
      );
    }
    if (startDate && endDate && startDate > endDate) {
      return NextResponse.json(
        { error: "Start date must precede end date" },
        { status: 400 },
      );
    }

    // Update campaign record
    const [updated] = await db
      .update(campaigns)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(campaigns.id, id))
      .returning();

    // Re-sync targeting tables
    await db
      .delete(campaignServiceGroups)
      .where(eq(campaignServiceGroups.campaignId, id));
    await db
      .delete(campaignCategories)
      .where(eq(campaignCategories.campaignId, id));
    await db
      .delete(campaignTreatments)
      .where(eq(campaignTreatments.campaignId, id));

    if (body.serviceGroupIds?.length) {
      await db.insert(campaignServiceGroups).values(
        body.serviceGroupIds.map((sgId: string) => ({
          campaignId: id,
          serviceGroupId: sgId,
        })),
      );
    }
    if (body.categoryIds?.length) {
      await db.insert(campaignCategories).values(
        body.categoryIds.map((cId: string) => ({
          campaignId: id,
          categoryId: cId,
        })),
      );
    }
    if (body.treatmentIds?.length) {
      await db.insert(campaignTreatments).values(
        body.treatmentIds.map((tId: string) => ({
          campaignId: id,
          treatmentId: tId,
        })),
      );
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await props.params;

  try {
    // 1. Audit Check: Check if any sales or reservations exist
    const hasGiftCards = await db.query.giftCards.findFirst({
      where: eq(giftCards.campaignId, id),
    });
    const hasReservations = await db.query.campaignReservations.findFirst({
      where: eq(campaignReservations.campaignId, id),
    });

    if (hasGiftCards || hasReservations) {
      return NextResponse.json(
        {
          error:
            "This campaign cannot be deleted because it has recorded gift card purchases or checkout reservations. Disable it instead to keep historical sales records intact.",
        },
        { status: 400 },
      );
    }

    // 2. Cascade delete targeting join tables first, then campaign
    await db
      .delete(campaignServiceGroups)
      .where(eq(campaignServiceGroups.campaignId, id));
    await db
      .delete(campaignCategories)
      .where(eq(campaignCategories.campaignId, id));
    await db
      .delete(campaignTreatments)
      .where(eq(campaignTreatments.campaignId, id));
    await db.delete(campaigns).where(eq(campaigns.id, id));

    return new NextResponse("Deleted", { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Delete failed" },
      { status: 500 },
    );
  }
}

// app/api/checkout/route.tsx
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { treatments } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getActiveCampaignsWithTargets,
  resolveVariantPrice,
} from "@/app/lib/campaign-pricing";
import {
  reserveCampaignSlot,
  attachStripeSessionToReservation,
  releaseCampaignReservation,
} from "@/app/lib/campaign-reservation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

  let reservationId: string | undefined;

  try {
    const body = await req.json();
    const {
      categorySlug,
      subCategorySlug,
      optionIndex,
      from,
      to,
      message,
      lang = "es",
    } = body;

    // 1. Server-authoritative resolution from DB
    const treatment = await db.query.treatments.findFirst({
      where: eq(treatments.slug, subCategorySlug),
      with: {
        category: true,
        serviceGroup: true,
        variants: {
          orderBy: (v, { asc }) => [asc(v.orderIndex)],
        },
      },
    });

    if (!treatment || !treatment.isActive) {
      return NextResponse.json(
        {
          error: `Tratamiento no disponible: ${categorySlug}/${subCategorySlug}`,
        },
        { status: 404 },
      );
    }

    const selectedVariant = treatment.variants[optionIndex];
    if (!selectedVariant) {
      return NextResponse.json(
        { error: `Opción inválida: ${optionIndex}` },
        { status: 400 },
      );
    }

    // 2. Resolve authoritative pricing and campaign eligibility
    const activeCampaigns = await getActiveCampaignsWithTargets();
    const now = new Date();

    const priceResult = resolveVariantPrice(
      selectedVariant,
      {
        id: treatment.id,
        serviceGroupId: treatment.serviceGroupId,
        categoryId: treatment.categoryId,
      },
      activeCampaigns,
      now,
      lang,
    );

    // 3. Atomic reservation if price is backed by a campaign
    if (priceResult.source === "campaign" && priceResult.campaignId) {
      const reservation = await reserveCampaignSlot(priceResult.campaignId);

      if (!reservation.success) {
        return NextResponse.json(
          {
            error:
              reservation.message ||
              "Lo sentimos, las plazas para esta promoción especial se acaban de agotar.",
            code: reservation.error,
          },
          { status: 409 },
        );
      }

      reservationId = reservation.reservationId;
    }

    const sessionsCount = (selectedVariant.sessionsCount || 1).toString();
    const durationLabel = `${selectedVariant.duration} ${selectedVariant.unit}`;
    const treatmentTitle =
      (treatment.title as any)?.[lang] || (treatment.title as any)?.es;

    // 4. Align Stripe Session expiry with reservation (30 mins from now)
    const expiresAtEpoch = Math.floor(Date.now() / 1000) + 30 * 60;

    // 5. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Gift Card: ${treatmentTitle}`,
              description: durationLabel,
              images: [`${process.env.NEXT_PUBLIC_URL}${treatment.image}`],
            },
            unit_amount: priceResult.centsAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      expires_at: expiresAtEpoch,
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/${lang}/${categorySlug}/${subCategorySlug}`,
      metadata: {
        buyerName: from,
        receiverName: to,
        message: message || "",
        treatmentName: treatmentTitle,
        duration: durationLabel,
        categorySlug,
        subCategorySlug,
        lang,
        sessionsCount,
        // Attribution and quota tracking metadata
        campaignId: priceResult.campaignId || "",
        campaignDiscountPercentage: priceResult.discountPercentage.toString(),
        reservationId: reservationId || "",
      },
    });

    // 6. Link Stripe Session ID to reservation
    if (reservationId && session.id) {
      await attachStripeSessionToReservation(reservationId, session.id);
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);

    // Rollback reservation immediately if checkout failed
    if (reservationId) {
      await releaseCampaignReservation({ reservationId });
    }

    return NextResponse.json(
      { error: error.message || "Error al iniciar el pago" },
      { status: 400 },
    );
  }
}

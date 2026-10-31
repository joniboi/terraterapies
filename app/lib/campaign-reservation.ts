// app/lib/campaign-reservation.ts
import { db } from "@/db";
import { campaigns, campaignReservations } from "@/db/schema";
import { eq, sql, and, or, gt } from "drizzle-orm";

export const DEFAULT_RESERVATION_TTL_MINUTES = 30; // Aligns with Stripe's minimum checkout session expiry

export interface ReservationResult {
  success: boolean;
  reservationId?: string;
  expiresAt?: Date;
  error?: "sold_out" | "inactive" | "not_found" | "internal_error";
  message?: string;
}

/**
 * Calculates current active quota consumption for a campaign:
 * (completed purchases + active unexpired reservations)
 */
export async function getActiveCampaignConsumption(
  campaignId: string,
  tx: any = db,
): Promise<number> {
  const [result] = await tx
    .select({ count: sql<number>`count(*)::int` })
    .from(campaignReservations)
    .where(
      and(
        eq(campaignReservations.campaignId, campaignId),
        or(
          eq(campaignReservations.status, "completed"),
          and(
            eq(campaignReservations.status, "reserved"),
            gt(campaignReservations.expiresAt, sql`now()`),
          ),
        ),
      ),
    );

  return result?.count || 0;
}

/**
 * Concurrency-Safe Campaign Slot Reservation.
 * Uses PostgreSQL row-level locking (FOR UPDATE) on the campaign row inside a transaction.
 */
export async function reserveCampaignSlot(
  campaignId: string,
  ttlMinutes = DEFAULT_RESERVATION_TTL_MINUTES,
): Promise<ReservationResult> {
  try {
    return await db.transaction(async (tx) => {
      // 1. Lock the campaign row against concurrent checkout sessions
      const [campaign] = await tx
        .select()
        .from(campaigns)
        .where(eq(campaigns.id, campaignId))
        .for("update");

      if (!campaign) {
        return {
          success: false,
          error: "not_found",
          message: "Campaign not found",
        };
      }

      if (!campaign.isActive) {
        return {
          success: false,
          error: "inactive",
          message: "Campaign is currently disabled",
        };
      }

      const now = new Date();
      if (campaign.startDate && now < new Date(campaign.startDate)) {
        return {
          success: false,
          error: "inactive",
          message: "Campaign has not started yet",
        };
      }
      if (campaign.endDate && now > new Date(campaign.endDate)) {
        return {
          success: false,
          error: "inactive",
          message: "Campaign has expired",
        };
      }

      // 2. Check Quota Limit if configured
      if (
        campaign.maxPurchases !== null &&
        campaign.maxPurchases !== undefined
      ) {
        const currentConsumption = await getActiveCampaignConsumption(
          campaignId,
          tx,
        );

        if (currentConsumption >= campaign.maxPurchases) {
          return {
            success: false,
            error: "sold_out",
            message:
              "This special promotion has reached its maximum purchase limit",
          };
        }
      }

      // 3. Insert transient reservation
      const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

      const [newReservation] = await tx
        .insert(campaignReservations)
        .values({
          campaignId: campaign.id,
          status: "reserved",
          expiresAt,
        })
        .returning({ id: campaignReservations.id });

      return {
        success: true,
        reservationId: newReservation.id,
        expiresAt,
      };
    });
  } catch (error) {
    console.error("Failed to reserve campaign slot:", error);
    return {
      success: false,
      error: "internal_error",
      message: "Database error during reservation",
    };
  }
}

/**
 * Links a Stripe Checkout Session ID to an existing reservation.
 */
export async function attachStripeSessionToReservation(
  reservationId: string,
  stripeSessionId: string,
): Promise<boolean> {
  try {
    await db
      .update(campaignReservations)
      .set({ stripeSessionId })
      .where(eq(campaignReservations.id, reservationId));
    return true;
  } catch (error) {
    console.error("Failed to attach Stripe session to reservation:", error);
    return false;
  }
}

/**
 * Releases a reservation immediately (e.g. Checkout Session creation failed or Stripe session expired).
 */
export async function releaseCampaignReservation(
  identifier: { reservationId?: string; stripeSessionId?: string },
  newStatus: "released" | "expired" = "released",
): Promise<void> {
  try {
    if (identifier.reservationId) {
      await db
        .update(campaignReservations)
        .set({ status: newStatus })
        .where(
          and(
            eq(campaignReservations.id, identifier.reservationId),
            eq(campaignReservations.status, "reserved"),
          ),
        );
    } else if (identifier.stripeSessionId) {
      await db
        .update(campaignReservations)
        .set({ status: newStatus })
        .where(
          and(
            eq(
              campaignReservations.stripeSessionId,
              identifier.stripeSessionId,
            ),
            eq(campaignReservations.status, "reserved"),
          ),
        );
    }
  } catch (error) {
    console.error("Failed to release campaign reservation:", error);
  }
}

/**
 * Finalizes a campaign reservation upon confirmed Stripe payment.
 * Converts reservation status from 'reserved' to 'completed' and attaches the gift card ID.
 */
export async function finalizeCampaignReservation(
  identifier: { reservationId?: string; stripeSessionId?: string },
  giftCardId: string,
  tx: any = db,
): Promise<boolean> {
  const whereClause = identifier.reservationId
    ? eq(campaignReservations.id, identifier.reservationId)
    : eq(campaignReservations.stripeSessionId, identifier.stripeSessionId!);

  const [updated] = await tx
    .update(campaignReservations)
    .set({
      status: "completed",
      giftCardId,
      completedAt: new Date(),
    })
    .where(whereClause)
    .returning({ id: campaignReservations.id });

  return !!updated;
}

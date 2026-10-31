// app/api/webhooks/stripe/route.tsx
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { GiftCardPdf } from "@/components/pdf/giftcardpdf";
import { generateLocator } from "@/utils/locator";
import { getDictionary } from "@/app/lib/getDictionary";
import QRCode from "qrcode";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  finalizeCampaignReservation,
  releaseCampaignReservation,
} from "@/app/lib/campaign-reservation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_for_build");

  const SENDER_EMAIL =
    process.env.SENDER_EMAIL || "info@terraterapiesthaibali.com";
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "julieanncolorado31@gmail.com";

  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  const settings = await db.query.siteSettings.findFirst();
  if (!settings) throw new Error("Critical: Database settings not found");

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  // =========================================================================
  // EVENT 1: Checkout Session Expired (Customer abandoned checkout)
  // =========================================================================
  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const reservationId = session.metadata?.reservationId;

    await releaseCampaignReservation(
      {
        reservationId: reservationId || undefined,
        stripeSessionId: session.id,
      },
      "expired",
    );

    return NextResponse.json({
      received: true,
      event: "session_expired_released",
    });
  }

  // =========================================================================
  // EVENT 2: Payment Failed
  // =========================================================================
  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const reservationId = session.metadata?.reservationId;

    await releaseCampaignReservation(
      {
        reservationId: reservationId || undefined,
        stripeSessionId: session.id,
      },
      "released",
    );

    return NextResponse.json({
      received: true,
      event: "payment_failed_released",
    });
  }

  // =========================================================================
  // EVENT 3: Checkout Session Completed (Payment Successful)
  // =========================================================================
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // 1. IDEMPOTENCY GUARD: Check if already fulfilled
    const existingCard = await db.query.giftCards.findFirst({
      where: eq(schema.giftCards.stripeSessionId, session.id),
    });

    if (existingCard) {
      return NextResponse.json({
        received: true,
        message: "Webhook already processed",
      });
    }

    const {
      buyerName,
      receiverName,
      message,
      treatmentName,
      duration,
      lang,
      sessionsCount,
      campaignId,
      campaignDiscountPercentage,
      reservationId,
    } = session.metadata || {};

    const customerEmail = session.customer_details?.email;
    const totalSessions = parseInt(sessionsCount || "1", 10);
    const locator = await generateLocator(buyerName || "Cliente");

    // 2. ATOMIC TRANSACTION: Insert Gift Card and finalize Reservation
    const newCard = await db.transaction(async (tx) => {
      const [card] = await tx
        .insert(schema.giftCards)
        .values({
          locatorCode: locator,
          stripeSessionId: session.id,
          treatmentNameSnapshot: treatmentName || "Tratamiento",
          durationSnapshot: duration || "60 min",
          priceSnapshot: ((session.amount_total || 0) / 100).toFixed(2),
          buyerName: buyerName || "Cliente",
          buyerEmail: customerEmail ?? "sin-email@terraterapies.com",
          recipientName: receiverName || "Beneficiario",
          messageSnapshot: message || "",
          status: "valid",
          totalSessions,
          usedSessions: 0,
          campaignId: campaignId ? campaignId : null,
          campaignDiscountPercentage: campaignDiscountPercentage
            ? campaignDiscountPercentage
            : null,
        })
        .returning({ id: schema.giftCards.id });

      // Finalize reservation (converts status from 'reserved' to 'completed')
      if (reservationId || session.id) {
        await finalizeCampaignReservation(
          {
            reservationId: reservationId || undefined,
            stripeSessionId: session.id,
          },
          card.id,
          tx,
        );
      }

      return card;
    });

    // 3. Generate QR Code and PDF Buffer
    const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/verify?id=${newCard.id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: "M",
      margin: 1,
    });
    const dict = await getDictionary(lang || "es");

    const pdfBuffer = await renderToBuffer(
      (
        <GiftCardPdf
          data={{
            buyerName: buyerName || "",
            receiverName: receiverName || "",
            message: message || "",
            treatmentName: treatmentName || "",
            duration: duration || "",
          }}
          locator={locator}
          labels={dict.giftCard}
          lang={lang || "es"}
          qrCodeDataUrl={qrCodeDataUrl}
          settings={settings}
        />
      ) as any,
    );

    // 4. Send Confirmation Email to Buyer
    if (customerEmail) {
      await resend.emails.send({
        from: `${settings.businessName} <${SENDER_EMAIL}>`,
        to: [customerEmail],
        subject: `Tu Tarjeta Regalo: ${treatmentName}`,
        react: (
          <div>
            <h1 style={{ color: "#2d3748" }}>
              ¡Gracias por tu compra, {buyerName}!
            </h1>
            <p>
              Adjunto encontrarás la tarjeta regalo para{" "}
              <strong>{receiverName}</strong>.
            </p>
            <p>
              Localizador de seguridad:{" "}
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#3182ce",
                }}
              >
                {locator}
              </span>
            </p>
            <hr />
            <p>
              <strong>Cómo canjear la tarjeta:</strong>
            </p>
            <ul>
              <li>
                Reserva tu cita por WhatsApp:{" "}
                <strong>{settings.contactPhone}</strong>
              </li>
              <li>Indica el código localizador al realizar la reserva.</li>
              <li>Presenta el PDF (digital o impreso) el día de tu cita.</li>
            </ul>
            <p>
              <em>¡Te esperamos pronto en {settings.businessName}!</em>
            </p>
          </div>
        ),
        attachments: [
          {
            filename: `Regalo-${settings.businessName.replace(/\s+/g, "-")}-${locator}.pdf`,
            content: pdfBuffer,
          },
        ],
      });
    }

    // 5. Send Notification Email to Business Admin
    const formattedAmount = session.amount_total
      ? (session.amount_total / 100).toFixed(2)
      : "0.00";

    await resend.emails.send({
      from: `${settings.businessName} <${SENDER_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `🎉 NUEVA VENTA: ${totalSessions > 1 ? "BONO" : "Tarjeta Regalo"} (${locator})${campaignId ? " [CAMPAÑA]" : ""}`,
      html: `
        <h2>¡Nueva Tarjeta Regalo Vendida!</h2>
        <p>Se acaba de procesar un nuevo pago mediante Stripe.</p>
        <hr/>
        <ul>
          <li><strong>Código Localizador:</strong> ${locator}</li>
          <li><strong>Tratamiento:</strong> ${treatmentName}</li>
          <li><strong>Sesiones:</strong> ${totalSessions}</li>
          <li><strong>Duración/Opción:</strong> ${duration}</li>
          <li><strong>Comprador:</strong> ${buyerName} (${customerEmail})</li>
          <li><strong>Para:</strong> ${receiverName}</li>
          <li><strong>Importe Total:</strong> ${formattedAmount}€</li>
          ${campaignId ? `<li><strong>Campaña ID:</strong> ${campaignId} (-${campaignDiscountPercentage}%)</li>` : ""}
        </ul>
      `,
    });
  }

  return NextResponse.json({ received: true });
}

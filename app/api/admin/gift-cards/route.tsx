import { db } from "@/db";
import * as schema from "@/db/schema";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { generateLocator } from "@/utils/locator";
import { getDictionary } from "@/app/lib/getDictionary";
import { GiftCardPdf } from "@/components/pdf/giftcardpdf";
import { renderToBuffer } from "@react-pdf/renderer";
import { Resend } from "resend";
import QRCode from "qrcode";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "julieanncolorado31@gmail.com";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const {
      buyerName,
      buyerEmail,
      recipientName,
      message,
      treatmentName,
      duration,
      price,
      lang,
    } = body;

    const locator = await generateLocator(buyerName);

    const [newCard] = await db
      .insert(schema.giftCards)
      .values({
        locatorCode: locator,
        stripeSessionId: `MANUAL-${locator}-${Date.now()}`,
        treatmentNameSnapshot: treatmentName,
        durationSnapshot: duration,
        priceSnapshot: price.toString(),
        buyerName,
        buyerEmail,
        recipientName,
        messageSnapshot: message,
        status: "valid",
      })
      .returning({ id: schema.giftCards.id });

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
            buyerName,
            receiverName: recipientName,
            message,
            treatmentName,
            duration,
          }}
          locator={locator}
          labels={dict.giftCard}
          lang={lang || "es"}
          qrCodeDataUrl={qrCodeDataUrl}
        />
      ) as any, // Essential for build stability
    );

    // 1. SEND TO CUSTOMER (Branded Email)
    await resend.emails.send({
      from: "Terraterapies Thai & Bali <info@terraterapiesthaibali.com>",
      to: [buyerEmail],
      subject: `Tu Tarjeta Regalo: ${treatmentName}`,
      react: (
        <div style={{ fontFamily: "sans-serif", color: "#333" }}>
          <h1 style={{ color: "#2d3748" }}>¡Hola {buyerName}!</h1>
          <p>
            Adjunto encontrarás la tarjeta regalo para{" "}
            <strong>{recipientName}</strong> generada en nuestro centro.
          </p>
          <p>
            Localizador de seguridad:
            <span
              style={{
                marginLeft: "10px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#3182ce",
              }}
            >
              {locator}
            </span>
          </p>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #eee",
              margin: "20px 0",
            }}
          />
          <p>
            <strong>Cómo canjear la tarjeta:</strong>
          </p>
          <ul>
            <li>
              Reserva tu cita por WhatsApp: <strong>+34 603 17 70 49</strong>
            </li>
            <li>Presenta el PDF el día de tu cita.</li>
          </ul>
        </div>
      ),
      attachments: [
        { filename: `Regalo-Terraterapies-${locator}.pdf`, content: pdfBuffer },
      ],
    });

    // 2. SEND NOTIFICATION TO ADMIN
    await resend.emails.send({
      from: "Terraterapies Thai & Bali <info@terraterapiesthaibali.com>",
      to: [ADMIN_EMAIL],
      subject: `✅ Tarjeta Manual Generada: ${locator}`,
      html: `
        <h2>Nueva Tarjeta Manual</h2>
        <p>Se ha generado una tarjeta en el backoffice:</p>
        <ul>
          <li><strong>Localizador:</strong> ${locator}</li>
          <li><strong>Tratamiento:</strong> ${treatmentName}</li>
          <li><strong>Para:</strong> ${recipientName}</li>
          <li><strong>Precio:</strong> ${price}€</li>
        </ul>
      `,
    });

    return NextResponse.json(newCard);
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

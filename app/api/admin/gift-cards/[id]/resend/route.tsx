import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { renderToBuffer } from "@react-pdf/renderer";
import { GiftCardPdf } from "@/components/pdf/giftcardpdf";
import { getDictionary } from "@/app/lib/getDictionary";
import QRCode from "qrcode";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  // 1. AWAIT THE PARAMS (Next.js 16 requirement)
  const resolvedParams = await props.params;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const SENDER_EMAIL =
    process.env.SENDER_EMAIL || "info@terraterapiesthaibali.com";

  try {
    const { newEmail, lang = "es" } = await req.json();
    if (!newEmail) return new NextResponse("Email required", { status: 400 });

    // 2. USE resolvedParams.id
    const card = await db.query.giftCards.findFirst({
      where: eq(schema.giftCards.id, resolvedParams.id),
    });

    if (!card) return new NextResponse("Not found", { status: 404 });

    const settings = await db.query.siteSettings.findFirst();
    if (!settings) throw new Error("Settings not found");

    const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/verify?id=${card.id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: "M",
      margin: 1,
    });

    const dict = await getDictionary(lang as "es" | "en" | "ca");

    const pdfBuffer = await renderToBuffer(
      (
        <GiftCardPdf
          data={{
            buyerName: card.buyerName,
            receiverName: card.recipientName,
            message: card.messageSnapshot || "",
            treatmentName: card.treatmentNameSnapshot,
            duration: card.durationSnapshot,
          }}
          locator={card.locatorCode}
          labels={dict.giftCard}
          lang={lang}
          qrCodeDataUrl={qrCodeDataUrl}
          settings={settings}
        />
      ) as any,
    );

    const filename = `Regalo-${settings.businessName.replace(/\s+/g, "-")}-${card.locatorCode}.pdf`;

    await resend.emails.send({
      from: `${settings.businessName} <${SENDER_EMAIL}>`,
      to: [newEmail],
      subject: `Tu Tarjeta Regalo: ${card.treatmentNameSnapshot} (Reenviado)`,
      react: (
        <div style={{ fontFamily: "sans-serif", color: "#333" }}>
          <h1 style={{ color: "#2d3748" }}>¡Hola {card.buyerName}!</h1>
          <p>
            Te reenviamos adjunta la tarjeta regalo para{" "}
            <strong>{card.recipientName}</strong>.
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
              {card.locatorCode}
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
            Reserva tu cita por WhatsApp:{" "}
            <strong>{settings.contactPhone}</strong>
          </p>
        </div>
      ),
      attachments: [{ filename, content: pdfBuffer }],
    });

    // 3. Update using resolvedParams.id
    await db
      .update(schema.giftCards)
      .set({ buyerEmail: newEmail })
      .where(eq(schema.giftCards.id, resolvedParams.id));

    return NextResponse.json({ success: true, email: newEmail });
  } catch (error) {
    console.error("Resend Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { renderToBuffer } from "@react-pdf/renderer";
import { GiftCardPdf } from "@/components/pdf/giftcardpdf";
import { getDictionary } from "@/app/lib/getDictionary";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const params = await props.params;

  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "es";

    const card = await db.query.giftCards.findFirst({
      where: eq(schema.giftCards.id, params.id),
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

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("PDF Download Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

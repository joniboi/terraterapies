import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { GiftCardPdf } from "@/components/pdf/giftcardpdf";
import { generateLocator } from "@/utils/locator";
import { getDictionary } from "@/app/lib/getDictionary";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    // 1. Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // 2. Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve metadata we sent in Step 2
    const { buyerName, receiverName, message, treatmentName, duration, lang } =
      session.metadata!;
    const customerEmail = session.customer_details?.email;

    // 3. Generate Secure Locator
    const locator = await generateLocator(buyerName);

    const dict = await getDictionary(lang || "es");
    // 4. Generate PDF Buffer
    const pdfBuffer = await renderToBuffer(
      <GiftCardPdf
        data={{ buyerName, receiverName, message, treatmentName, duration }}
        locator={locator}
        labels={dict.giftCard} // <--- Pass the labels
        lang={lang || "es"} // <--- Pass the language for dates
      />
    );

    // 5. Send Email
    await resend.emails.send({
      from: "Tu Spa <onboarding@resend.dev>",
      to: [customerEmail!], // Send to buyer
      subject: `Tu Tarjeta Regalo: ${treatmentName}`,
      react: (
        <div>
          <h1>¡Gracias por tu compra, {buyerName}!</h1>
          <p>Aquí tienes tu tarjeta regalo para {receiverName}.</p>
          <p>
            Localizador: <strong>{locator}</strong>
          </p>
          <p>Para canjear, contacta por WhatsApp al XXX XXX XXX.</p>
        </div>
      ),
      attachments: [
        {
          filename: `Regalo-${locator}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  }

  return NextResponse.json({ received: true });
}

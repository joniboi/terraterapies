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
      process.env.STRIPE_WEBHOOK_SECRET!,
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
      />,
    );

    // 5. Send Email
    await resend.emails.send({
      // CHANGE THIS: Use your new verified domain
      from: "Terraterapies <info@terraterapiesthaibali.com>",
      to: [customerEmail!],
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
              Reserva tu cita por WhatsApp: <strong>+34 603 17 70 49</strong>
            </li>
            <li>Indica el código localizador al realizar la reserva.</li>
            <li>Presenta el PDF (digital o impreso) el día de tu cita.</li>
          </ul>
          <p>
            <em>¡Te esperamos pronto en Terraterapies!</em>
          </p>
        </div>
      ),
      attachments: [
        {
          filename: `Regalo-Terraterapies-${locator}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  }

  return NextResponse.json({ received: true });
}

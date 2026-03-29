import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { GiftCardPdf } from "@/components/pdf/giftcardpdf";
import { generateLocator } from "@/utils/locator";
import { getDictionary } from "@/app/lib/getDictionary";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "julieanncolorado31@gmail.com";

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
      from: "Terraterapies Thai & Bali <info@terraterapiesthaibali.com>",
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

    // Extract and format the amount safely
    const formattedAmount = session.amount_total
      ? (session.amount_total / 100).toFixed(2)
      : "0.00";
    // 6. Send the notification email to YOU (The Business)
    await resend.emails.send({
      from: "Terraterapies Thai & Bali <info@terraterapiesthaibali.com>",
      to: ADMIN_EMAIL,
      subject: `🎉 NUEVA VENTA: Tarjeta Regalo (${locator})`,
      html: `
          <h2>¡Nueva Tarjeta Regalo Vendida!</h2>
          <p>Se acaba de procesar un nuevo pago mediante Stripe.</p>
          <hr/>
          <ul>
            <li><strong>Código Localizador:</strong> ${locator}</li>
            <li><strong>Tratamiento:</strong> ${treatmentName}</li>
            <li><strong>Duración/Opción:</strong> ${duration}</li>
            <li><strong>Comprador:</strong> ${buyerName} (${customerEmail})</li>
            <li><strong>Para:</strong> ${receiverName}</li>
            <li><strong>Importe Total:</strong> ${formattedAmount}€</li>
          </ul>
          <p><em>El cliente ya ha recibido su tarjeta regalo en PDF. No es necesario realizar ninguna acción, solo anotar este código en vuestra agenda para cuando el cliente llame.</em></p>
        `,
    });
  }

  return NextResponse.json({ received: true });
}

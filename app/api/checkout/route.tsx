import { NextResponse } from "next/server";
import Stripe from "stripe";
import servicesData from "@/data/services.json"; // Import your JSON

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.json();
  const { treatmentSlug, subCategorySlug, optionIndex, from, to, message } =
    body;

  // 1. SECURITY: Find the price in your JSON. Do not trust the client.
  const category = servicesData.categories.find((c) =>
    c.subcategories.some((s) => s.slug === subCategorySlug)
  );
  const sub = category?.subcategories.find((s) => s.slug === subCategorySlug);
  const option = sub?.options[optionIndex];

  if (!option)
    return NextResponse.json({ error: "Invalid treatment" }, { status: 400 });

  // Clean the price string (e.g. "60€" -> 6000 cents)
  const priceAmount = parseInt(option.price.replace("€", "")) * 100;

  // 2. Create Stripe Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Tarjeta Regalo: ${sub.title}`,
            description: option.duration,
            images: [process.env.NEXT_PUBLIC_URL + sub.image], // Must be absolute URL
          },
          unit_amount: priceAmount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/services`,
    // 3. STORE DATA IN METADATA
    metadata: {
      buyerName: from,
      receiverName: to,
      message: message,
      treatmentName: sub.title,
      duration: option.duration,
      locatorDate: new Date().toISOString(), // To track purchase date
    },
  });

  return NextResponse.json({ url: session.url });
}

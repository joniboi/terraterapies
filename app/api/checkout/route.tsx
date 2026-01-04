import { NextResponse } from "next/server";
import Stripe from "stripe";
import servicesData from "@/data/services.json"; // Import your JSON

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { categorySlug, subCategorySlug, optionIndex, from, to, message } =
      body;

    // --- SECURITY CHECK START ---

    // 1. Find Category
    const category = servicesData.categories.find(
      (c) => c.slug === categorySlug
    );
    if (!category) throw new Error("Categoría no encontrada");

    // 2. Find Subcategory (Treatment)
    const treatment = category.subcategories.find(
      (s) => s.slug === subCategorySlug
    );
    if (!treatment) throw new Error("Tratamiento no encontrado");

    // 3. Find Option (Duration & Price)
    // We trust the index sent by frontend, but we verify it exists
    const selectedOption = treatment.options[optionIndex];
    if (!selectedOption) throw new Error("Opción inválida");

    // 4. Extract and Clean Price
    // Your JSON has prices like "60€". Stripe needs integer cents (6000).
    const priceString = selectedOption.price.replace("€", "").trim();
    const priceAmount = parseInt(priceString, 10) * 100; // 60 -> 6000

    // --- SECURITY CHECK END ---

    // 5. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Tarjeta Regalo: ${treatment.title}`,
              description: `Duración: ${selectedOption.duration}`,
              // Ensure this image URL is absolute (https://...) or Stripe will complain
              images: [`${process.env.NEXT_PUBLIC_URL}${treatment.image}`],
            },
            unit_amount: priceAmount, // WE USE THE SERVER-SIDE CALCULATED PRICE
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/services/${categorySlug}/${subCategorySlug}`,
      metadata: {
        buyerName: from,
        receiverName: to,
        message: message || "",
        treatmentName: treatment.title,
        duration: selectedOption.duration,
        categorySlug, // Store for reference
        subCategorySlug, // Store for reference
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

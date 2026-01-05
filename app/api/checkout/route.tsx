import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServicesData } from "@/app/lib/getService"; // ✅ Use the dynamic loader

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ✅ Define types to fix "implicitly has an any type" errors
interface ServiceOption {
  duration: string;
  price: string;
}

interface ServiceSubcategory {
  slug: string;
  title: string;
  image: string;
  options: ServiceOption[];
}

interface ServiceCategory {
  slug: string;
  subcategories: ServiceSubcategory[];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      categorySlug,
      subCategorySlug,
      optionIndex,
      from,
      to,
      message,
      lang = "es", // ✅ Default to Spanish if frontend forgets to send it
    } = body;

    // --- SECURITY CHECK START ---

    // 0. Load the correct data for the language
    const servicesData = await getServicesData(lang);

    // 1. Find Category
    const category = servicesData.categories.find(
      (c: ServiceCategory) => c.slug === categorySlug
    );
    if (!category) throw new Error("Categoría no encontrada");

    // 2. Find Subcategory (Treatment)
    const treatment = category.subcategories.find(
      (s: ServiceSubcategory) => s.slug === subCategorySlug
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
              name: `Gift Card: ${treatment.title}`, // Dynamic title based on language
              description: selectedOption.duration,
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
      // Fix: Ensure the cancel URL goes back to the correct language path
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/${lang}/${categorySlug}/${subCategorySlug}`,
      metadata: {
        buyerName: from,
        receiverName: to,
        message: message || "",
        treatmentName: treatment.title,
        duration: selectedOption.duration,
        categorySlug,
        subCategorySlug,
        lang, // Store language to generate the PDF in the correct language later
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

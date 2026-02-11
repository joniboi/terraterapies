import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServicesData } from "@/app/lib/getService";
import { Category, Subcategory } from "@/types/definitions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Destructure the variables.
    // These variables (categorySlug, subCategorySlug, etc.) now hold the values.
    const {
      categorySlug,
      subCategorySlug,
      optionIndex,
      from,
      to,
      message,
      lang = "es",
    } = body;

    // --- SECURITY CHECK START ---

    // 0. Load Data
    const servicesData = await getServicesData(lang);

    // 1. Find Category
    // FIX: Use 'categorySlug' directly. Do NOT use 'rest.categorySlug' (it doesn't exist)
    const category = servicesData.navItems
      .flatMap((i) => i.categories)
      .find((c: Category) => c.slug === categorySlug);

    if (!category) throw new Error(`Categoría no encontrada: ${categorySlug}`);

    // 2. Find Subcategory
    // FIX: Use 'subCategorySlug' directly
    const treatment = category.subcategories.find(
      (s: Subcategory) => s.slug === subCategorySlug,
    );

    if (!treatment)
      throw new Error(`Tratamiento no encontrado: ${subCategorySlug}`);

    // 3. Find Option
    // FIX: Use 'optionIndex' directly
    const selectedOption = treatment.options?.[optionIndex];

    if (!selectedOption) throw new Error(`Opción inválida: ${optionIndex}`);

    // 4. Clean Price
    const priceString = selectedOption.price.replace("€", "").trim();
    const priceAmount = parseInt(priceString, 10) * 100;

    // --- SECURITY CHECK END ---

    // 5. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Gift Card: ${treatment.title}`,
              description: selectedOption.duration,
              images: [`${process.env.NEXT_PUBLIC_URL}${treatment.image}`],
            },
            unit_amount: priceAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      // FIX: Use variables here too
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/${lang}/${categorySlug}/${subCategorySlug}`,
      metadata: {
        buyerName: from,
        receiverName: to,
        message: message || "",
        treatmentName: treatment.title,
        duration: selectedOption.duration,
        categorySlug,
        subCategorySlug,
        lang,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

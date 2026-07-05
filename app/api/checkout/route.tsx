import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServicesData } from "@/app/lib/getService";
import { Category, Subcategory } from "@/types/definitions";

// 1. FORCE DYNAMIC - Prevents Next.js from trying to pre-render this during build
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // 2. INITIALIZE STRIPE INSIDE THE FUNCTION
  // We provide a dummy 'sk_test' fallback so the Stripe constructor doesn't crash
  // if the variable is missing for a split-second during the build scan.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

  try {
    const body = await req.json();

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
    const servicesData = await getServicesData(lang);

    const category = servicesData.navItems
      .flatMap((i) => i.categories)
      .find((c: Category) => c.slug === categorySlug);

    if (!category) throw new Error(`Categoría no encontrada: ${categorySlug}`);

    const treatment = category.subcategories.find(
      (s: Subcategory) => s.slug === subCategorySlug,
    );

    if (!treatment)
      throw new Error(`Tratamiento no encontrado: ${subCategorySlug}`);

    const selectedOption = treatment.options?.[optionIndex];

    if (!selectedOption) throw new Error(`Opción inválida: ${optionIndex}`);

    const sessionsCount = selectedOption.sessionsCount?.toString() || "1";

    const priceString = selectedOption.price.replace("€", "").trim();
    const priceAmount = parseInt(priceString, 10) * 100;
    // --- SECURITY CHECK END ---

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
        sessionsCount: sessionsCount,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

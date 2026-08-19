import Stripe from "stripe";
import Link from "next/link";
import { getDictionary } from "@/app/lib/getDictionary";
import { routes, getLocalizedRoute } from "@/app/lib/routes";
import { Button } from "@/components/ui/button";
import Script from "next/script";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  // Next.js 15 requires awaiting params and searchParams
  const { lang } = await params;
  const { session_id } = await searchParams;

  const dict = await getDictionary(lang);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const googleConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL;

  let buyerName = "";
  let purchaseValue = 0;

  // Verify the session to personalize the confirmation
  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      buyerName =
        session.metadata?.buyerName || session.customer_details?.name || "";
      purchaseValue = (session.amount_total || 0) / 100;
    } catch (error) {
      console.error("Error retrieving Stripe session:", error);
    }
  }

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      {/* INJECT THE DYNAMIC REVENUE CONVERSION TRACKER FOR GOOGLE ADS */}
      {gaId && session_id && googleConversionLabel && (
        <Script id="google-purchase-conversion" strategy="afterInteractive">
          {`
            console.log("🚀 Attempting to fire Google Ads conversion...");
            console.log("gaId:", "${gaId}");
            console.log("googleConversionLabel:", "${googleConversionLabel}");
            console.log("session_id:", "${session_id}");

            if (typeof gtag === 'function') {
              gtag('event', 'conversion', {
                'send_to': '${googleConversionLabel}',
                'value': ${purchaseValue},
                'currency': 'EUR',
                'transaction_id': '${session_id}'
              });
              console.log("✅ gtag function executed successfully!");
            } else {
              console.error("❌ gtag function is NOT defined in this scope!");
            }
          `}
        </Script>
      )}
      <div className="max-w-2xl w-full space-y-8">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl">
            ✓
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {dict.success?.title || "Payment Successful!"}
          </h1>

          <div className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {buyerName && (
              <p className="font-medium text-foreground mb-2">
                {dict.success?.thankYou || "Thank you"}, {buyerName}.
              </p>
            )}
            <p>
              {dict.success?.message ||
                "We have successfully processed your payment. You will receive an email with your gift card shortly."}
            </p>
          </div>
        </div>

        <div className="pt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href={getLocalizedRoute(routes.home, lang)}>
              {dict.success?.backHome || "Return Home"}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

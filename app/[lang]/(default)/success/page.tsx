import Stripe from "stripe";
import Link from "next/link";
import { getDictionary } from "@/app/lib/getDictionary";
import { routes, getLocalizedRoute } from "@/app/lib/routes";
import { Button } from "@/components/ui/button";

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

  let buyerName = "";

  // Verify the session to personalize the confirmation
  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      buyerName =
        session.metadata?.buyerName || session.customer_details?.name || "";
    } catch (error) {
      console.error("Error retrieving Stripe session:", error);
    }
  }

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-2xl w-full space-y-8">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl">
            ✓
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            {dict.success?.title || "Payment Successful!"}
          </h1>

          <div className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto">
            {buyerName && (
              <p className="font-medium text-gray-900 mb-2">
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

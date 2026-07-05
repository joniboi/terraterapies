import { auth } from "@/auth";
import { db } from "@/db";
import Link from "next/link";

export async function generateMetadata() {
  const settings = await db.query.siteSettings.findFirst();
  return {
    title: `Dashboard | ${settings?.businessName || "Admin"}`,
  };
}

export default async function AdminDashboard() {
  const session = await auth();
  const settings = await db.query.siteSettings.findFirst();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Welcome back, {session?.user?.name || "Admin"}!
      </h1>
      {!settings?.businessName && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
          ⚠️ You haven't set your Business Name yet. Go to{" "}
          <strong>Global Settings</strong> to set it up.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats Card 1: Treatments */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Treatments Database
          </h3>
          <p className="text-sm text-gray-500 mb-6 flex-grow">
            Manage prices, descriptions, and images for all your massages and
            rituals.
          </p>
          <Link
            href="/admin/treatments"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium inline-flex items-center"
          >
            Go to Treatments &rarr;
          </Link>
        </div>

        {/* Quick Stats Card 2: Categories (NEW) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Categories
          </h3>
          <p className="text-sm text-gray-500 mb-6 flex-grow">
            Manage families of treatments, assign parent groups, and control
            what is featured on the homepage.
          </p>
          <Link
            href="/admin/categories"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium inline-flex items-center"
          >
            Manage Categories &rarr;
          </Link>
        </div>

        {/* Quick Stats Card 3: Gift Cards */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Gift Cards
          </h3>
          <p className="text-sm text-gray-500 mb-6 flex-grow">
            Check validity and redeem gift cards purchased by customers.
          </p>
          <Link
            href="/admin/gift-cards"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium inline-flex items-center"
          >
            Manage Gift Cards &rarr;
          </Link>
        </div>

        {/* Quick Stats Card 4: Reviews */}
        <div className="bg-background p-6 rounded-2xl shadow-sm border border-border flex flex-col h-full">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Customer Reviews
          </h3>
          <p className="text-sm text-muted-foreground mb-6 flex-grow">
            Manage curated testimonials. Anonymize names and translate feedback
            for the homepage slider.
          </p>
          <Link
            href="/admin/reviews"
            className="text-primary hover:text-primary/80 hover:underline font-medium inline-flex items-center"
          >
            Manage Reviews &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

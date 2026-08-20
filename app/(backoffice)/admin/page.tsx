import { auth } from "@/auth";
import { db } from "@/db";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrafficWidget } from "@/components/admin/traffic-widget";

export async function generateMetadata() {
  const settings = await db.query.siteSettings.findFirst();
  return {
    title: `Dashboard | ${settings?.businessName || "Admin"}`,
  };
}

// Define the cards once to eliminate HTML repetition
const QUICK_LINKS = [
  {
    title: "Treatments Database",
    description:
      "Manage prices, descriptions, and images for all your massages and rituals.",
    href: "/admin/treatments",
    linkText: "Go to Treatments",
  },
  {
    title: "Service Groups",
    description:
      "Manage the main service families displayed throughout the website.",
    href: "/admin/service-groups",
    linkText: "Manage Service Groups",
  },
  {
    title: "Categories",
    description:
      "Manage families of treatments, assign parent groups, and control what is featured.",
    href: "/admin/categories",
    linkText: "Manage Categories",
  },
  {
    title: "Gift Cards",
    description: "Check validity and redeem gift cards purchased by customers.",
    href: "/admin/gift-cards",
    linkText: "Manage Gift Cards",
  },
  {
    title: "Customer Reviews",
    description:
      "Manage curated testimonials. Anonymize names and translate feedback for the slider.",
    href: "/admin/reviews",
    linkText: "Manage Reviews",
  },
  {
    title: "FAQs",
    description:
      "Manage the Frequently Asked Questions and contact texts. Supports wildcards.",
    href: "/admin/faqs",
    linkText: "Manage FAQs",
  },
];

export default async function AdminDashboard() {
  const session = await auth();
  const settings = await db.query.siteSettings.findFirst();

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8 text-foreground">
        Welcome back, {session?.user?.name || "Admin"}!
      </h1>

      {!settings?.businessName && (
        <div className="mb-8 p-4 bg-warning/10 border border-warning text-warning rounded-lg">
          ⚠️ You haven't set your Business Name yet. Go to{" "}
          <strong>Global Settings</strong> to set it up.
        </div>
      )}

      {/* NEW: Traffic Widget Component */}
      <TrafficWidget />

      {/* REFACTORED: Quick Links Grid using the custom Card component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUICK_LINKS.map((link) => (
          <Card key={link.href} className="flex flex-col h-full">
            {/* Using border-b-0 and pb-2 so it looks exactly like your old hardcoded cards */}
            <CardHeader className="border-b-0 pb-2">
              <CardTitle>{link.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow pt-0">
              <p className="text-sm text-muted-foreground mb-6 flex-grow">
                {link.description}
              </p>
              <Link
                href={link.href}
                className="text-primary hover:text-primary/80 hover:underline font-medium inline-flex items-center"
              >
                {link.linkText} &rarr;
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

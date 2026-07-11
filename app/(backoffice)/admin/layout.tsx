import Link from "next/link";
import { auth, signOut } from "@/auth";
import { db } from "@/db";

export default async function AdminSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const settings = await db.query.siteSettings.findFirst();
  const businessName = settings?.businessName || "Admin Panel";
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Strictly using semantic inverse colors */}
      <aside className="w-64 bg-foreground text-background p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8">{businessName}</h2>
        <nav className="space-y-4">
          <Link
            href="/admin"
            className="block hover:text-highlight transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/settings"
            className="block hover:text-highlight transition-colors"
          >
            Global Settings
          </Link>
          <Link
            href="/admin/treatments"
            className="block hover:text-highlight transition-colors"
          >
            Treatments
          </Link>
          <Link
            href="/admin/categories"
            className="block hover:text-highlight transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/admin/reviews"
            className="block hover:text-highlight transition-colors"
          >
            Reviews
          </Link>
          <Link
            href="/admin/gift-cards"
            className="block hover:text-highlight transition-colors"
          >
            Gift Cards
          </Link>
          <Link
            href="/admin/faqs"
            className="block hover:text-highlight transition-colors"
          >
            FAQs
          </Link>
          <div className="pt-8">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="text-destructive hover:opacity-80 text-sm font-bold transition-opacity">
                Logout
              </button>
            </form>
          </div>
        </nav>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

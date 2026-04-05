// app/(backoffice)/admin/layout.tsx
import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function AdminSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth(); // Security check

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8">Terraterapies Thai & Bali</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block hover:text-amber-400">
            Dashboard
          </Link>
          <Link href="/admin/services" className="block hover:text-amber-400">
            Treatments
          </Link>
          <Link href="/admin/gift-cards" className="block hover:text-amber-400">
            Gift Cards
          </Link>
          <div className="pt-8">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="text-red-400 hover:text-red-300 text-sm font-bold">
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

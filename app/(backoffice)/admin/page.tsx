import { auth } from "@/auth";

export const metadata = {
  title: "Dashboard | Terraterapies Thai & Bali",
};

export default async function AdminDashboard() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, {session?.user?.name || "Admin"}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Stats Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Treatments Database
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Manage prices, descriptions, and images for all your massages and
            rituals.
          </p>
          <a
            href="/admin/services"
            className="text-blue-600 hover:underline font-medium"
          >
            Go to Treatments &rarr;
          </a>
        </div>

        {/* Quick Stats Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Gift Cards
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Check validity and redeem gift cards purchased by customers.
          </p>
          <a
            href="/admin/gift-cards"
            className="text-blue-600 hover:underline font-medium"
          >
            Manage Gift Cards &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

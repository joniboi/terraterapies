import { db } from "@/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CategoriesListPage() {
  // Fetch categories with their parent group
  const allCategories = await db.query.categories.findMany({
    with: {
      group: true,
    },
    orderBy: (categories, { asc }) => [asc(categories.orderIndex)],
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500">
            Manage families of treatments (e.g., Facials, Oriental)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">+ Add Category</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
              <th className="p-4 font-semibold">Image</th>
              <th className="p-4 font-semibold">Category (ES)</th>
              <th className="p-4 font-semibold">Parent Group</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allCategories.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-blue-50/50 transition-colors"
              >
                <td className="p-4">
                  <img
                    src={cat.image}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                  />
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-800">
                    {cat.title?.es || "Unnamed Category"}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {cat.slug}
                  </div>
                </td>
                <td className="p-4 text-gray-500 text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium uppercase">
                    {cat.group?.label?.es}
                  </span>
                </td>
                <td className="p-4">
                  {cat.isFeatured ? (
                    <span className="text-amber-500 text-sm flex items-center gap-1">
                      ⭐ Featured
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Standard</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/categories/${cat.id}`}>Edit</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

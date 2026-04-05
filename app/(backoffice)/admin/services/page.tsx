import { db } from "@/db";
import Link from "next/link";

export const metadata = {
  title: "Treatments | Admin",
};

export default async function AdminServicesList() {
  // 1. Fetch all data
  const rawTreatments = await db.query.treatments.findMany({
    with: {
      category: {
        with: {
          group: true,
        },
      },
    },
  });

  const treatmentsList = rawTreatments.sort((a, b) => {
    const groupA = a.category.group;
    const groupB = b.category.group;
    const catA = a.category;
    const catB = b.category;

    // RULE 1: Group Priority (Treatments vs Rituals)
    // Keeps Highlighted groups (usually Rituals) at the top
    if (groupA.highlight !== groupB.highlight) {
      return groupB.highlight ? 1 : -1;
    }
    if ((groupA.orderIndex || 0) !== (groupB.orderIndex || 0)) {
      return (groupA.orderIndex || 0) - (groupB.orderIndex || 0);
    }

    // RULE 2: Category Cluster (The grouping you asked for)
    // First by Featured flag, then by OrderIndex, then Alphabetically
    if (catA.isFeatured !== catB.isFeatured) {
      return catB.isFeatured ? 1 : -1;
    }
    if ((catA.orderIndex || 0) !== (catB.orderIndex || 0)) {
      return (catA.orderIndex || 0) - (catB.orderIndex || 0);
    }

    // Alphabetical Category Sort (e.g., 'Orientales' before 'Relajantes')
    const catTitleA = catA.title?.es || "";
    const catTitleB = catB.title?.es || "";
    const catCompare = catTitleA.localeCompare(catTitleB);
    if (catCompare !== 0) return catCompare;

    // RULE 3: Treatment Alphabetical Sort (Inside the Category)
    const titleA = a.title?.es || "";
    const titleB = b.title?.es || "";
    return titleA.localeCompare(titleB);
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Treatments Database
        </h1>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed">
          + Add New Treatment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
              <th className="p-4 font-semibold">Treatment (Spanish)</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Group</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {treatmentsList.map((t) => (
              <tr key={t.id} className="hover:bg-blue-50/50 transition-colors">
                {/* TREATMENT */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{t.emoji}</span>
                    <span className="font-semibold text-gray-800">
                      {t.title?.es || "Unnamed"}
                    </span>
                  </div>
                </td>

                {/* CATEGORY */}
                <td className="p-4 text-gray-600 text-sm">
                  {t.category?.title?.es}
                  {t.category?.isFeatured && (
                    <span
                      className="ml-2 text-amber-500"
                      title="Featured Category"
                    >
                      ⭐
                    </span>
                  )}
                </td>

                {/* GROUP */}
                <td className="p-4 text-gray-500 text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium uppercase">
                    {t.category?.group?.label?.es || "Unknown"}
                  </span>
                  {t.category?.group?.highlight && (
                    <span
                      className="ml-2 text-amber-500"
                      title="Highlighted Group"
                    >
                      ⭐
                    </span>
                  )}
                </td>

                {/* ACTION */}
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/services/${t.id}`}
                    className="inline-block bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Edit &rarr;
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

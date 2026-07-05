import { db } from "@/db";
import SettingsForm from "./_components/settings-form";

export default async function SettingsPage() {
  // Try to fetch the single row
  let settings = await db.query.siteSettings.findFirst();

  // If it doesn't exist yet (first time running), we provide empty defaults
  if (!settings) {
    settings = {
      id: "singleton",
      businessName: "",
      heroTagline: { es: "", ca: "", en: "" },
      aboutUsText: { es: "", ca: "", en: "" },
      contactEmail: "",
      contactPhone: "",
      addressLine1: "",
      addressLine2: "",
      mapsLink: "",
      facebookUrl: "",
      instagramUrl: "",
      freshaUrl: "",
      partners: [],
      aboutImage: null,
      logoUrl: null,
      faviconUrl: null,
      pdfBackgroundUrl: null,
    };
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Global Site Settings</h1>
      <p className="text-gray-500 mb-8">
        Manage the core text, taglines, and contact info for this center.
      </p>

      <SettingsForm initialData={settings} />
    </div>
  );
}

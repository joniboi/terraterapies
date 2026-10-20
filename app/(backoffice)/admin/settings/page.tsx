// app/(backoffice)/admin/settings/page.tsx
import { db } from "@/db";
import SettingsForm from "./_components/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [dbSettings, treatments, campaignsList] = await Promise.all([
    db.query.siteSettings.findFirst(),
    db.query.treatments.findMany({
      orderBy: (t, { asc }) => [asc(t.slug)],
    }),
    db.query.campaigns.findMany({
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    }),
  ]);

  let settings = dbSettings;

  if (!settings) {
    settings = {
      id: "singleton",
      headingFont: "Inter",
      bodyFont: "Inter",
      uiFont: "Inter",
      businessName: "",
      heroTagline: { es: "", ca: "", en: "" },
      aboutUsText: { es: "", ca: "", en: "" },
      contactEmail: "",
      contactPhone: "",
      streetAddress: "",
      addressLocality: "",
      addressRegion: "",
      postalCode: "",
      addressCountry: "ES",
      mapsLink: "",
      facebookUrl: "",
      instagramUrl: "",
      freshaUrl: "",
      partners: [],
      schedules: [],
      aboutImage: null,
      logoUrl: null,
      faviconUrl: null,
      pdfBackgroundUrl: null,
      faqHero: {
        title: { es: "", ca: "", en: "" },
        subtitle: { es: "", ca: "", en: "" },
      },
      faqCta: {
        title: { es: "", ca: "", en: "" },
        subtitle: { es: "", ca: "", en: "" },
        button: { es: "", ca: "", en: "" },
        whatsappMsg: { es: "", ca: "", en: "" },
      },
      faqSections: [],
      heroGallery: [],
    };
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Global Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage identity, contact info, brand typography, and dynamic homepage
          gallery.
        </p>
      </div>

      <SettingsForm
        initialData={settings}
        availableTreatments={treatments}
        availableCampaigns={campaignsList}
      />
    </div>
  );
}

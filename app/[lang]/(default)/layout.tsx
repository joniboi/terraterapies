import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AOSInit from "@/components/aos-init";
import { getDictionary } from "@/app/lib/getDictionary";
import { getServicesData } from "@/app/lib/getService";
import { db } from "@/db";

export default async function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const [dict, servicesData, settings] = await Promise.all([
    getDictionary(lang),
    getServicesData(lang),
    db.query.siteSettings.findFirst(),
  ]);

  // 🚀 NEW: Check if the gallery has any active slides linked to a treatment
  const hasGallery =
    settings?.heroGallery?.some((s: any) => s.isActive && s.treatmentId) ||
    false;

  return (
    <>
      <AOSInit />

      <Header
        lang={lang}
        navItems={servicesData}
        logoUrl={settings?.logoUrl}
        businessName={settings?.businessName}
        hasGallery={hasGallery} // 🚀 NEW: Pass the boolean to the Header
      />

      <main className="grow">{children}</main>

      <Footer
        border={true}
        dict={dict.footer}
        lang={lang}
        settings={settings}
      />
    </>
  );
}

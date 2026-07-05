import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AOSInit from "@/components/aos-init";
import { getDictionary } from "@/app/lib/getDictionary";
import { getServicesData } from "@/app/lib/getService"; // Import the data fetcher
import { db } from "@/db";

export default async function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // 1. Await params (Best practice for Next.js 15+)
  const { lang } = await params;

  const [dict, servicesData, settings] = await Promise.all([
    getDictionary(lang),
    getServicesData(lang),
    db.query.siteSettings.findFirst(), // <--- 3. Fetch from DB
  ]);

  return (
    <>
      {/* Client-side animations */}
      <AOSInit />

      {/* Header receives Language, Dictionary, and Categories */}
      <Header
        lang={lang}
        dict={dict.header}
        navItems={servicesData.navItems}
        logoUrl={settings?.logoUrl}
        businessName={settings?.businessName}
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

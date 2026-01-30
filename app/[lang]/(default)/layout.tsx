import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AOSInit from "@/components/aos-init";
import { getDictionary } from "@/app/lib/getDictionary";
import { getServicesData } from "@/app/lib/getService"; // Import the data fetcher

export default async function DefaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // 1. Await params (Best practice for Next.js 15+)
  const { lang } = await params;

  // 2. Fetch Dictionary (for labels like "Contact", "Book Now")
  const dict = await getDictionary(lang);

  // 3. Fetch Service Data (to populate the Header Menu dynamically)
  const servicesData = await getServicesData(lang);

  return (
    <>
      {/* Client-side animations */}
      <AOSInit />

      {/* Header receives Language, Dictionary, and Categories */}
      <Header lang={lang} dict={dict.header} navItems={servicesData.navItems} />

      <main className="grow">{children}</main>

      <Footer border={true} dict={dict.footer} />
    </>
  );
}

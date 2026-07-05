import "../css/style.css";
import { Inter } from "next/font/google";
import { config, BRAND } from "@/app/lib/config";
import { db } from "@/db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata() {
  const settings = await db.query.siteSettings.findFirst();

  return {
    title: settings?.businessName || "Spa Management",
    icons: {
      // 1. Point to the database URL if it exists
      // 2. Add a version (?v=...) to force the browser to ignore its cache
      icon: settings?.faviconUrl
        ? `${settings.faviconUrl}?v=${Date.now()}`
        : "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} className={`scroll-smooth theme-${BRAND}`}>
      <body
        /* 4. Use bg-background and text-foreground to activate the Theme Engine */
        className={`${inter.variable} bg-background font-inter tracking-tight text-foreground antialiased`}
      >
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          {children}
        </div>
      </body>
    </html>
  );
}

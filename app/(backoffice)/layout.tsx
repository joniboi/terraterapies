// app/(backoffice)/layout.tsx
import "@/app/css/style.css";
import { Inter } from "next/font/google";
import { BRAND } from "@/app/lib/config";
import { db } from "@/db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata() {
  const settings = await db.query.siteSettings.findFirst();
  return {
    title: `Admin | ${settings?.businessName || "Panel"}`,
    icons: {
      icon: settings?.faviconUrl || "/favicon.ico",
    },
  };
}

export default function BackofficeRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`theme-${BRAND}`}>
      <body
        className={`${inter.variable} font-inter bg-gray-100 text-gray-900 tracking-tight antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

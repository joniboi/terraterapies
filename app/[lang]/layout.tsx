// app/[lang]/layout.tsx
import "../css/style.css";
import { config, BRAND } from "@/app/lib/config";
import { db } from "@/db";
import { Suspense } from "react";
import { VisitTracker } from "@/components/visit-tracker";
import LocalBusinessSchema from "@/components/seo/local-business-schema";
import Script from "next/script";
import { resolveFont } from "@/app/lib/font-library"; // <-- NEW IMPORT

export async function generateMetadata() {
  const settings = await db.query.siteSettings.findFirst();
  return {
    title: settings?.businessName || "Spa Management",
    icons: {
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // 1. Fetch settings
  const settings = await db.query.siteSettings.findFirst();

  // 2. Resolve typography (defaults safely to Inter)
  const headingF = resolveFont(settings?.headingFont);
  const bodyF = resolveFont(settings?.bodyFont);
  const uiF = resolveFont(settings?.uiFont);

  // 3. Extract the unique Google Next.js CSS variable classes (deduplicated)
  const fontVariableClasses = Array.from(
    new Set([headingF.font.variable, bodyF.font.variable, uiF.font.variable]),
  ).join(" ");

  // 4. Map them directly to your existing application architecture
  const dynamicFontStyles = {
    "--app-font-heading": `var(${headingF.cssVar}), ${headingF.fallback}`,
    "--app-font-body": `var(${bodyF.cssVar}), ${bodyF.fallback}`,
    "--app-font-ui": `var(${uiF.cssVar}), ${uiF.fallback}`,
  } as React.CSSProperties;

  return (
    <html lang={lang} className={`scroll-smooth theme-${BRAND}`}>
      <body
        className={`${fontVariableClasses} font-body bg-background text-foreground tracking-tight antialiased`}
        style={dynamicFontStyles}
      >
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <LocalBusinessSchema />

        <Suspense fallback={null}>
          <VisitTracker />
        </Suspense>
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          {children}
        </div>
      </body>
    </html>
  );
}

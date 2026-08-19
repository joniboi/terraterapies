// app/(backoffice)/layout.tsx
import "@/app/css/style.css";
import { BRAND } from "@/app/lib/config";
import { db } from "@/db";
import { resolveFont } from "@/app/lib/font-library";

export async function generateMetadata() {
  const settings = await db.query.siteSettings.findFirst();
  return {
    title: `Admin | ${settings?.businessName || "Panel"}`,
    icons: {
      icon: settings?.faviconUrl || "/favicon.ico",
    },
  };
}

export default async function BackofficeRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await db.query.siteSettings.findFirst();

  const headingF = resolveFont(settings?.headingFont);
  const bodyF = resolveFont(settings?.bodyFont);
  const uiF = resolveFont(settings?.uiFont);

  const fontVariableClasses = Array.from(
    new Set([headingF.font.variable, bodyF.font.variable, uiF.font.variable]),
  ).join(" ");

  const dynamicFontStyles = {
    "--app-font-heading": `var(${headingF.cssVar}), ${headingF.fallback}`,
    "--app-font-body": `var(${bodyF.cssVar}), ${bodyF.fallback}`,
    "--app-font-ui": `var(${uiF.cssVar}), ${uiF.fallback}`,
  } as React.CSSProperties;
  return (
    <html lang="en" className={`theme-${BRAND}`}>
      <body
        className={`${fontVariableClasses} font-body bg-background text-foreground tracking-tight antialiased`}
        style={dynamicFontStyles}
      >
        {children}
      </body>
    </html>
  );
}

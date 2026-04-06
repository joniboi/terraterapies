// app/(utility)/layout.tsx
import "@/app/css/style.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function UtilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} font-inter bg-gray-50 text-gray-900 antialiased`}
      >
        {/* A very simple, clean wrapper for mobile users */}
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}

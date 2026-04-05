// app/(backoffice)/layout.tsx
import "@/app/css/style.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Terraterapies Admin",
};

export default function BackofficeRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-inter bg-gray-100 text-gray-900 tracking-tight antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

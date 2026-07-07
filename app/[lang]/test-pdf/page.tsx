"use client";

import dynamic from "next/dynamic";
import { GiftCardPdf } from "@/components/pdf/giftcardpdf"; // Check your casing
import QRCode from "qrcode";
import dictionaryEs from "@/dictionaries/es.json"; // Import the Spanish labels
import { useEffect, useState } from "react";

// PDFViewer must be imported dynamically to avoid server-side errors
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false },
);

export default function TestPdfPage() {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  useEffect(() => {
    // Generate QR in the browser for testing
    QRCode.toDataURL(`${process.env.NEXT_PUBLIC_URL}/verify?loc=JP-040126-001`)
      .then(setQrDataUrl)
      .catch(console.error);
  }, []);
  const dummyData = {
    buyerName: "Juan Pérez",
    receiverName: "Maria García",
    treatmentName: "Masaje Tailandés Tradicional",
    duration: "60 minutos",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  };

  const dummySettings = {
    id: "singleton",
    businessName: "Terraterapies Thai & Bali",
    contactEmail: "info@terraterapies.com",
    contactPhone: "+34 600 000 000",
    addressLine1: "Calle Ejemplo 123, Sant Cugat",
    aboutImage: null,
    logoUrl: null, // You can put a real URL here to test the logo in the PDF
    faviconUrl: null,
    pdfBackgroundUrl: "/uploads/056a2964-7d44-40f5-8c11-13960861e2ec.webp",
    heroTagline: { es: "", ca: "", en: "" },
    aboutUsText: { es: "", ca: "", en: "" },
    partners: [],
  };
  if (!qrDataUrl) return <div>Cargando...</div>;
  return (
    <div className="h-screen w-screen">
      <PDFViewer className="w-full h-full">
        <GiftCardPdf
          data={dummyData}
          locator="JP-040126-001"
          labels={dictionaryEs.giftCard} // <--- Pass the labels from JSON
          lang="es" // <--- Pass the language code
          qrCodeDataUrl={qrDataUrl}
          settings={dummySettings as any}
        />
      </PDFViewer>
    </div>
  );
}

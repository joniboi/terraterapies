"use client";

import dynamic from "next/dynamic";
import { GiftCardPdf } from "@/components/pdf/giftcardpdf"; // Check your casing
import dictionaryEs from "@/dictionaries/es.json"; // Import the Spanish labels

// PDFViewer must be imported dynamically to avoid server-side errors
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

export default function TestPdfPage() {
  const dummyData = {
    buyerName: "Juan Pérez",
    receiverName: "Maria García",
    treatmentName: "Masaje Tailandés Tradicional",
    duration: "60 minutos",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  };

  return (
    <div className="h-screen w-screen">
      <PDFViewer className="w-full h-full">
        <GiftCardPdf
          data={dummyData}
          locator="JP-040126-001"
          labels={dictionaryEs.giftCard} // <--- Pass the labels from JSON
          lang="es" // <--- Pass the language code
        />
      </PDFViewer>
    </div>
  );
}

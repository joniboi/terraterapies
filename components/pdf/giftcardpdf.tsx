// components/pdf/GiftCardPdf.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// 1. Define the structure of the data object
interface GiftCardData {
  buyerName: string;
  receiverName: string;
  treatmentName: string;
  duration: string;
  message: string;
}

// 2. Define the props the component expects
interface GiftCardPdfProps {
  data: GiftCardData;
  locator: string;
}

const styles = StyleSheet.create({
  page: { flexDirection: "column", backgroundColor: "#fff", padding: 30 },
  header: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  locator: { fontSize: 12, color: "gray", marginTop: 10, textAlign: "right" },
  // ... add your branding styles
});

// 3. Apply the interface to the component arguments
export const GiftCardPdf = ({ data, locator }: GiftCardPdfProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Tarjeta Regalo</Text>
      <View>
        <Text>De: {data.buyerName}</Text>
        <Text>Para: {data.receiverName}</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text>Tratamiento: {data.treatmentName}</Text>
        <Text>Duración: {data.duration}</Text>
      </View>
      <View style={{ marginTop: 20, fontStyle: "italic" }}>
        <Text>"{data.message}"</Text>
      </View>
      <Text style={styles.locator}>Locator: {locator}</Text>
      <Text style={styles.locator}>
        Válido hasta:{" "}
        {/* Added 'es-ES' so the date appears as DD/MM/YYYY even on the server */}
        {new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toLocaleDateString("es-ES")}
      </Text>
    </Page>
  </Document>
);

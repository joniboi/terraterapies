// components/pdf/GiftCardPdf.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
  Image,
} from "@react-pdf/renderer";

// 1. REGISTER CUSTOM FONTS
// Make sure these files are in public/fonts/
const fontUrl = (name: string) =>
  `${process.env.NEXT_PUBLIC_URL}/fonts/${name}`;

// 1. Intro Rust (OTF)
Font.register({
  family: "Intro Rust",
  src: fontUrl("IntroRust.otf"),
});

// 2. Brittany (TTF) - UPDATED
Font.register({
  family: "Brittany",
  src: fontUrl("BrittanySignature.ttf"), // <--- Pointing to the .ttf file
});

// 3. Proxima Nova (OTF)
Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: fontUrl("Montserrat-Regular.ttf"), // Renamed from the DEMO file
      fontWeight: "normal",
    },
    {
      src: fontUrl("Montserrat-Bold.ttf"), // Renamed from the DEMO file
      fontWeight: "bold",
    },
  ],
});

// 2. DEFINE STYLES WITH EXACT COORDINATES
const styles = StyleSheet.create({
  // ... Keep your existing styles ...
  // Make sure you keep the styles exactly as you tuned them
  page: { flexDirection: "column", backgroundColor: "#ffffff", padding: 0 },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  labelsContainer: {
    position: "absolute",
    top: 70,
    left: 100,
    display: "flex",
    flexDirection: "column",
    gap: 30,
  },
  labelText: {
    fontFamily: "Intro Rust",
    lineHeight: 1.4,
    fontSize: 24,
    color: "#000",
  },
  valuesContainer: {
    position: "absolute",
    top: 70,
    left: 350,
    display: "flex",
    flexDirection: "column",
    gap: 30,
    width: 800,
  },
  valueText: {
    fontFamily: "Intro Rust",
    textAlign: "justify",
    lineHeight: 1.4,
    fontSize: 24,
    color: "#000",
  },
  titleText: {
    position: "absolute",
    top: 70,
    right: 70,
    fontFamily: "Brittany",
    fontSize: 84,
  },
  bottomCenterContainer: {
    position: "absolute",
    top: 850,
    left: 0,
    right: 0,
    textAlign: "center",
  },
  locatorText: { fontFamily: "Montserrat", fontSize: 20, marginBottom: 5 },
  validityText: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
  },
  addressContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    textAlign: "right",
    width: 400,
  },
  addressLink: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "bold",
    color: "#CCC",
    textDecoration: "underline",
  },
});

// 1. DEFINE THE LABELS INTERFACE
interface GiftCardLabels {
  title: string;
  labelFrom: string;
  labelTo: string;
  labelDate: string;
  labelTreatment: string;
  labelNote: string;
  labelCode: string;
  validity: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
}

interface GiftCardData {
  buyerName: string;
  receiverName: string;
  treatmentName: string;
  duration: string;
  message: string;
}

interface GiftCardPdfProps {
  data: GiftCardData;
  locator: string;
  labels: GiftCardLabels; // <--- NEW
  lang: string; // <--- NEW (for date formatting)
}

export const GiftCardPdf = ({
  data,
  locator,
  labels,
  lang,
}: GiftCardPdfProps) => {
  const backgroundUrl = `${process.env.NEXT_PUBLIC_URL}/images/gift-template.jpg`;

  // Dynamic Date Formatting based on Language
  const purchaseDate = new Date().toLocaleDateString(
    lang === "en" ? "en-GB" : "es-ES" // en-GB gives DD/MM/YYYY, usually preferred over US MM/DD/YYYY in Europe
  );

  return (
    <Document>
      <Page size={[1724, 947]} style={styles.page}>
        <Image src={backgroundUrl} style={styles.backgroundImage} />

        {/* 1. Labels */}
        <View style={styles.labelsContainer}>
          <Text style={styles.labelText}>{labels.labelFrom}</Text>
          <Text style={styles.labelText}>{labels.labelTo}</Text>
          <Text style={styles.labelText}>{labels.labelDate}</Text>
          <Text style={styles.labelText}>{labels.labelTreatment}</Text>
          <Text style={{ ...styles.labelText, marginTop: 20 }}>
            {labels.labelNote}
          </Text>
        </View>

        {/* 2. Values */}
        <View style={styles.valuesContainer}>
          <Text style={styles.valueText}>{data.buyerName}</Text>
          <Text style={styles.valueText}>{data.receiverName}</Text>
          <Text style={styles.valueText}>{purchaseDate}</Text>
          <Text style={styles.valueText}>
            {data.treatmentName} ({data.duration})
          </Text>
          <Text
            style={{ ...styles.valueText, marginTop: 20 }}
            hyphenationCallback={(word) => [word]}
          >
            {data.message || "-"}
          </Text>
        </View>

        {/* 3. Title */}
        <Text style={styles.titleText}>{labels.title}</Text>

        {/* 4. Locator & Validity */}
        <View style={styles.bottomCenterContainer}>
          <Text style={styles.locatorText}>
            {labels.labelCode}{" "}
            <Text style={{ fontWeight: "bold" }}>{locator}</Text>
          </Text>
          <Text style={styles.validityText}>{labels.validity}</Text>
        </View>

        {/* 5. Address Link */}
        <View style={styles.addressContainer}>
          <Link
            src="https://maps.app.goo.gl/iKQzo2bKECesL75r8"
            style={styles.addressLink}
          >
            {labels.addressLine1}
            {"\n"}
            {labels.addressLine2}
            {"\n"}
            {labels.phone}
          </Link>
        </View>
      </Page>
    </Document>
  );
};

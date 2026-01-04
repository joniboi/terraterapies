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
    {
      src: fontUrl("Montserrat-Italic.ttf"),
      fontStyle: "italic",
    },
  ],
});

// 2. DEFINE STYLES WITH EXACT COORDINATES
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 0,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  // --- TOP LEFT: LABELS ---
  // "margin of 100 pixels from left and 70 pixels from top"
  labelsContainer: {
    position: "absolute",
    top: 70,
    left: 100,
    display: "flex",
    flexDirection: "column",
    gap: 30, // Adjusted gap for the larger canvas
  },
  labelText: {
    fontFamily: "Intro Rust",
    lineHeight: 1.4,
    fontSize: 24,
    color: "#000",
  },

  // --- VALUES (Offset) ---
  // "500 pixels from the left"
  valuesContainer: {
    position: "absolute",
    top: 70,
    left: 350, // EXACTLY as you requested
    display: "flex",
    flexDirection: "column",
    gap: 30, // Must match labelsContainer gap
    width: 800, // Plenty of space now
  },
  valueText: {
    fontFamily: "Intro Rust",
    textAlign: "justify",
    lineHeight: 1.4,
    fontSize: 24, // Slightly larger to match the scale of the image
    color: "#000",
  },

  // --- TOP RIGHT: TITLE ---
  // "Brittany font 27"
  titleText: {
    position: "absolute",
    top: 70,
    right: 70,
    fontFamily: "Brittany",
    fontSize: 84,
  },

  // --- BOTTOM CENTER: LOCATOR ---
  // "850 px from the top"
  bottomCenterContainer: {
    position: "absolute",
    top: 850, // EXACTLY as you requested
    left: 0,
    right: 0, // spanning left to right allows textAlign: center to work
    textAlign: "center",
  },
  locatorText: {
    fontFamily: "Montserrat",
    fontSize: 20,
    marginBottom: 5,
  },
  validityText: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
  },

  // --- BOTTOM RIGHT: ADDRESS & LINK ---
  // "Montserrat"
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

export const GiftCardPdf = ({ data, locator }: GiftCardPdfProps) => {
  const backgroundUrl = `${process.env.NEXT_PUBLIC_URL}/images/gift-template.png`;

  const purchaseDate = new Date().toLocaleDateString("es-ES");

  return (
    <Document>
      {/* 
         SETTING CUSTOM SIZE HERE: [WIDTH, HEIGHT] 
         Now 1 PDF unit = 1 pixel of your image
      */}
      <Page size={[1724, 947]} style={styles.page}>
        {/* Background Image */}
        <Image src={backgroundUrl} style={styles.backgroundImage} />

        {/* 1. Labels */}
        <View style={styles.labelsContainer}>
          <Text style={styles.labelText}>DE:</Text>
          <Text style={styles.labelText}>PARA:</Text>
          <Text style={styles.labelText}>FECHA:</Text>
          <Text style={styles.labelText}>TRATAMIENTO:</Text>
          {/* Add extra margin for the "Special Note" label if needed */}
          <Text style={{ ...styles.labelText, marginTop: 20 }}>
            NOTA ESPECIAL:
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
          {/* Extra margin to match the label's marginTop */}
          <Text
            style={{ ...styles.valueText, marginTop: 20 }}
            hyphenationCallback={(word) => [word]}
          >
            {data.message || "-"}
          </Text>
        </View>

        {/* 3. Title */}
        <Text style={styles.titleText}>Tarjeta de regalo</Text>

        {/* 4. Locator & Validity (At 850px top) */}
        <View style={styles.bottomCenterContainer}>
          <Text style={styles.locatorText}>
            Código: <Text style={{ fontWeight: "bold" }}>{locator}</Text>
          </Text>
          <Text style={styles.validityText}>
            Válido durante un año desde la fecha de compra.
          </Text>
        </View>

        {/* 5. Address Link */}
        <View style={styles.addressContainer}>
          <Link
            src="https://maps.app.goo.gl/iKQzo2bKECesL75r8"
            style={styles.addressLink}
          >
            Carrer de Josep Puig i Cadafalch, 42-44,{"\n"}
            08172 Sant Cugat del Vallès, Barcelona{"\n"}
            Telefono: +34603177049
          </Link>
        </View>
      </Page>
    </Document>
  );
};

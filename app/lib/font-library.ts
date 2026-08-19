// app/lib/font-library.ts
import {
  Inter,
  Cormorant_Garamond,
  Playfair_Display,
  Lora,
  Montserrat,
  DM_Sans,
  Manrope,
} from "next/font/google";

// 1. Statically define the fonts (preload: false is critical for performance here
// so Next.js doesn't try to preload the entire catalog for every page load).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});
const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  preload: false,
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  preload: false,
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: false,
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  preload: false,
});

export type FontId =
  | "inter"
  | "cormorant"
  | "playfair"
  | "lora"
  | "montserrat"
  | "dm-sans"
  | "manrope";

// 2. Define the Catalog with Fallbacks
export const FONT_CATALOG = {
  inter: {
    id: "inter",
    label: "Inter",
    font: inter,
    cssVar: "--font-inter",
    fallback: "sans-serif",
  },
  cormorant: {
    id: "cormorant",
    label: "Cormorant Garamond",
    font: cormorant,
    cssVar: "--font-cormorant",
    fallback: "serif",
  },
  playfair: {
    id: "playfair",
    label: "Playfair Display",
    font: playfair,
    cssVar: "--font-playfair",
    fallback: "serif",
  },
  lora: {
    id: "lora",
    label: "Lora",
    font: lora,
    cssVar: "--font-lora",
    fallback: "serif",
  },
  montserrat: {
    id: "montserrat",
    label: "Montserrat",
    font: montserrat,
    cssVar: "--font-montserrat",
    fallback: "sans-serif",
  },
  "dm-sans": {
    id: "dm-sans",
    label: "DM Sans",
    font: dmSans,
    cssVar: "--font-dm-sans",
    fallback: "sans-serif",
  },
  manrope: {
    id: "manrope",
    label: "Manrope",
    font: manrope,
    cssVar: "--font-manrope",
    fallback: "sans-serif",
  },
} as const;

// 3. Helper for Admin Dropdowns
export const FONT_OPTIONS = Object.values(FONT_CATALOG).map((f) => ({
  value: f.id,
  label: f.label,
}));

// 4. Safe Resolver (defaults to Inter if DB contains an invalid/empty ID)
export function resolveFont(id?: string | null) {
  if (!id || !(id in FONT_CATALOG)) {
    return FONT_CATALOG["inter"];
  }
  return FONT_CATALOG[id as FontId];
}

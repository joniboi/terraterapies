// app/lib/config.ts

export const BRAND = process.env.NEXT_PUBLIC_BRAND || "terraterapies";

// 1. Define strict types so TypeScript provides autocomplete across your app
export interface PartnerConfig {
  name: string;
  baseUrl: string;
  getUrl: (lang: string) => string;
}

export interface AppConfig {
  theme: {
    shortName: string; // Used for that giant background text "Thai&Bali" vs "Lotus"
  };
  pdf: {
    textColor: string;
    secondaryColor: string;
  };
  system: {
    giftCardPrefix: string;
  };
}

// 2. The original Terraterapies Configuration
const terraterapiesConfig: AppConfig = {
  theme: { shortName: "Thai&Bali" },
  pdf: {
    textColor: "#000000",
    secondaryColor: "#444444",
  },
  system: { giftCardPrefix: "TT" },
};

// 3. The New Lotus Configuration
const lotusConfig: AppConfig = {
  theme: { shortName: "Lotus" },
  pdf: {
    textColor: "#101010",
    secondaryColor: "#666666",
  },
  system: { giftCardPrefix: "LB" },
};

// 4. Export the correct config based on the environment!
export const config = BRAND === "lotus" ? lotusConfig : terraterapiesConfig;

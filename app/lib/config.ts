// app/lib/config.ts

/**
 * Application configuration
 * External URLs, contact info, business data
 */
export const config = {
  business: {
    name: "Terraterapies Thai & Bali",
    phone: "+34603177049",
    email: "info@terraterapies.com", // Add if you have one
    address: {
      line1: "Carrer de Josep Puig i Cadafalch, 42-44",
      line2: "08172 Sant Cugat del Vallès, Barcelona (Spain)",
    },
  },

  social: {
    facebook:
      "https://www.facebook.com/people/Terraterapies-Thai-Y-Bali/61580296106688",
    instagram: "https://www.instagram.com/terrapiesthaiybali",
    whatsapp: {
      number: "+34603177049",
      // Helper to generate WhatsApp URL
      getUrl: (message: string) =>
        `https://wa.me/34603177049?text=${encodeURIComponent(message)}`,
    },
  },

  partners: {
    mezzanote: {
      name: "Pizzería Mezzanotte",
      baseUrl: "https://www.pizzeriamezzanotte.com",
      // Function to generate URL with language parameter
      getUrl: (lang: string) => {
        // Map your language codes to their language codes if different
        const langMap: Record<string, string> = {
          es: "es",
          ca: "es", // They might not have Catalan, fallback to Spanish
          en: "en",
        };
        const targetLang = langMap[lang] || "en";
        return `https://www.pizzeriamezzanotte.com/?lang=${targetLang}`;
      },
      // Optional: Check if they support the language
      supportsLanguage: (lang: string) => ["es", "en"].includes(lang),
    },

    // Template for future partners
    // anotherPartner: {
    //   name: "Partner Name",
    //   baseUrl: "https://example.com",
    //   getUrl: (lang: string) => `https://example.com/${lang}`,
    // }
  },

  // External integrations
  integrations: {
    treatwell: {
      enabled: false, // Toggle features
      widgetUrl: "", // When ready
    },
  },
} as const;

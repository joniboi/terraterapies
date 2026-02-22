import "server-only";

// 1. Define the structure of your JSON here
export interface Dictionary {
  header: {
    seeAll: string;
    languages: {
      es: string;
      ca: string;
      en: string;
    };
  };

  pages: {
    category: {
      notFound: string;
    };
  };
  home: {
    hero: {
      title: string;
      tagline: string;
      cta: string;
    };
    categories: {
      title: string;
      subtitle: string;
    };
  };
  booking: {
    bookBtn: string;
    giftTitle: string;
    selectDuration: string;
    fromPlaceholder: string;
    toPlaceholder: string;
    msgPlaceholder: string;
    payBtn: string;
    processing: string;
    alerts: {
      fillAll: string;
      error: string;
    };
  };
  giftCard: {
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
  };
  common: {
    seeMore: string;
  };
  footer: {
    copyright: string;
    experiences: {
      title: string;
      thai: { label: string; categorySlug: string; subcategorySlug: string }; // ✅ Updated
      bali: { label: string; categorySlug: string; subcategorySlug: string }; // ✅ Updated
      combos: { label: string; categorySlug: string }; // ✅ Updated
    };
    collabs: {
      title: string;
      mezzanote: string;
    };
    info: {
      title: string;
      contact: string;
      about: string;
      faq: string;
    };
    social: {
      title: string;
      whatsappMsg: string;
    };
    bigText: string;
  };

  faqs: {
    hero: {
      title: string;
      subtitle: string;
    };
    sections: Array<{
      id: string;
      title: string;
      questions: Array<{
        question: string;
        answer: string;
      }>;
    }>;
    cta: {
      title: string;
      subtitle: string;
      button: string;
      whatsappMsg: string;
    };
  };
  success: {
    title: string;
    message: string;
    backHome: string;
    thankYou: string;
  };
}

// 2. Cast the imported JSON to this Interface
const dictionaries = {
  es: () =>
    import("@/dictionaries/es.json").then(
      (module) => module.default as Dictionary,
    ),
  en: () =>
    import("@/dictionaries/en.json").then(
      (module) => module.default as Dictionary,
    ),
  ca: () =>
    import("@/dictionaries/ca.json").then(
      (module) => module.default as Dictionary,
    ),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  // Helper logic to find the key safely
  const lang =
    locale in dictionaries ? (locale as keyof typeof dictionaries) : "es";
  return dictionaries[lang]();
};

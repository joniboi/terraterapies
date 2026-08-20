// types/definitions.ts

import { siteSettings, treatments, treatmentVariants } from "@/db/schema";

// --- 1. CORE DATA TYPES (From your JSON) ---

export interface Option {
  duration: string;
  price: string; // Keep as string "60€" or number, depending on JSON. Usually string in your case.
  originalPrice?: string;
  tag?: string; // "Best Seller"
  isPromo?: boolean;
  promoEnds?: string;
  discountPercent?: number;
  sessionsCount?: number;
}

export interface HeroImage {
  src: string;
  alt: string;
}

export interface ShowcaseData {
  title: string;
  description: string;
}

export interface Treatment {
  slug: string;
  title: string;
  emoji: string;
  image: string;
  backgroundImage: string;
  tagline?: string;
  shortDescription: string;
  longDescription: string;
  options: Option[];
  hasPromo: boolean;
  promoBadgeText?: string;
  isActive: boolean;
}

export interface Category {
  slug: string;
  title: string;
  description: string;
  image: string;
  isFeatured: boolean;
  orderIndex: number;
  badge?: string;
  heroImages?: { src: string; alt: string }[];
  showCase?: { title: string; description: string };
  treatments: Treatment[];
}

export interface NavItem {
  id: string;
  label: string;
  layout: "mega-menu" | "rich-dropdown";
  highlight?: boolean;
  emoji?: string;
  categories: Category[];
}

export interface ServiceGroup {
  id: string; // The slug is used as the ID in the frontend
  slug: string;
  title: string;
  description?: string;
  image?: string;
  layout: "mega-menu" | "rich-dropdown";
  highlight: boolean;
  emoji?: string;
  badge?: string;
  heroImages?: { src: string; alt: string }[];
  showCase?: { title: string; description: string };
  // The crucial structural split
  categories: Category[];
  treatments: Treatment[]; // Direct treatments
}

export type SiteSettings = typeof siteSettings.$inferSelect;
export type DBTreatment = typeof treatments.$inferSelect;
export type DBVariant = typeof treatmentVariants.$inferSelect;
export type DBTreatmentWithVariants = DBTreatment & {
  variants: DBVariant[];
};
// --- 2. DICTIONARY TYPES (For Multi-language text) ---

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
      cta: string;
      ctaGift?: string;
      carouselContext: string;
      discountSuffix: string;
    };
    categories: {
      title: string;
      subtitle: string;
    };
    // 2. Add reviews section
    reviews: {
      title: string;
      subtitle: string;
    };
  };
  giftStore: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allTreatments: string;
    noResults: string;
    bookDirect: string;
    giftButton: string;
    viewDetails: string;
    fromPrice: string;
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
    disclaimer: string;
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
  // Inside your Dictionary interface
  about: {
    title: string;
    imageAlt: string;
  };
  contact: {
    title: string;
    subtitle: string;
    schedule: {
      title: string; // Keep the card title
    };
    info: {
      title: string;
      addressTitle: string;
      phoneTitle: string;
    };
  };
  success: {
    title: string;
    message: string;
    backHome: string;
    thankYou: string;
  };
}

// --- 3. GIFT CARD SPECIFIC TYPES ---

export interface GiftCardData {
  buyerName: string;
  receiverName: string;
  treatmentName: string;
  duration: string;
  message: string;
}

// Re-using the dictionary part for labels to ensure consistency
export type GiftCardLabels = Dictionary["giftCard"];

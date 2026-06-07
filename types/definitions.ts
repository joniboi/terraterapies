// types/definitions.ts

import { config } from "next/dist/build/templates/pages";

// --- 1. CORE DATA TYPES (From your JSON) ---

export interface Option {
  duration: string;
  price: string; // Keep as string "60€" or number, depending on JSON. Usually string in your case.
  originalPrice?: string;
  tag?: string; // "Best Seller"
  isPromo?: boolean;
  promoEnds?: string;
  discountPercent?: number;
}

export interface HeroImage {
  src: string;
  alt: string;
}

export interface ShowcaseData {
  title: string;
  description: string;
}

export interface Subcategory {
  slug: string;
  title: string;
  emoji?: string;
  tagline?: string;
  image: string; // Made optional just in case, but usually present
  backgroundImage?: string;
  shortDescription?: string;
  longDescription?: string;
  options?: Option[]; // Typed strictly now, not "any[]"
  // 'link' is often calculated in components (/${lang}/${cat}/${sub}),
  // but if it comes from JSON, add it here.
  hasPromo?: boolean;
  promoBadgeText?: string;
}

export interface Category {
  slug: string;
  title: string;
  image: string; // Required for BusinessCategories
  shortDescription?: string;
  heroImages?: HeroImage[];
  showCase?: ShowcaseData;
  subcategories: Subcategory[];
  isFeatured?: boolean; // true for Rituals
  badge?: string; // "✨ Exclusive Experience"
  orderIndex?: number; // For manual sorting
}

export interface NavItem {
  id: string;
  label: string;
  layout: "mega-menu" | "rich-dropdown";
  highlight?: boolean;
  emoji?: string;
  categories: Category[];
}

export interface ServicesData {
  defaultBackground: string;
  navItems: NavItem[];
}

// --- 2. DICTIONARY TYPES (For Multi-language text) ---
type PartnerKey = keyof typeof config.partners;
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
    // 2. Add reviews section
    reviews: {
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
      partners: Record<PartnerKey, string>;
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
  // Inside your Dictionary interface
  about: {
    title: string;
    description: string;
    imageAlt: string;
  };
  contact: {
    title: string;
    subtitle: string;
    schedule: {
      title: string;
      weekdays: string;
      weekends: string;
      holidays: string;
    };
    info: {
      title: string;
      addressTitle: string;
      address: string;
      phoneTitle: string;
      phone: string;
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

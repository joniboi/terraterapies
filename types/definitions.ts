// types/definitions.ts

// --- 1. CORE DATA TYPES (From your JSON) ---

export interface Option {
  duration: string;
  price: string; // Keep as string "60€" or number, depending on JSON. Usually string in your case.
  originalPrice?: string;
  tag?: string; // "Best Seller"
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
  image?: string; // Made optional just in case, but usually present
  backgroundImage?: string;
  shortDescription?: string;
  longDescription?: string;
  options?: Option[]; // Typed strictly now, not "any[]"
  // 'link' is often calculated in components (/${lang}/${cat}/${sub}),
  // but if it comes from JSON, add it here.
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
      thai: string;
      bali: string;
      combos: string;
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

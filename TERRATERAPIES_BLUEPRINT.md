# Terraterapies Thai & Bali - Project Blueprint

> **Last Updated**: February 15, 2026  
> **Framework**: Next.js 15+ (App Router)  
> **Language**: TypeScript  
> **Styling**: Tailwind CSS  
> **UI Components**: Radix UI + Custom Components

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Philosophy](#architecture-philosophy)
3. [Project Structure](#project-structure)
4. [Data Layer](#data-layer)
5. [Routing System](#routing-system)
6. [Component Architecture](#component-architecture)
7. [Internationalization (i18n)](#internationalization-i18n)
8. [Payment Integration](#payment-integration)
9. [External Integrations](#external-integrations)
10. [Type System](#type-system)
11. [Utility Functions](#utility-functions)
12. [Environment Variables](#environment-variables)
13. [Development Guidelines](#development-guidelines)

---

## 1. Project Overview

**Terraterapies Thai & Bali** is a multilingual spa/massage booking website that offers:
- Multiple massage treatment categories (Oriental, Relaxing, Therapeutic, Firming)
- Ritual packages (combined treatments)
- Gift card purchasing system with Stripe
- Integration with Treatwell for booking
- Three-language support (Spanish, Catalan, English)

### Core Business Model
- **Categories**: Treatments grouped by type (e.g., Oriental, Relaxing)
- **Subcategories**: Individual treatments (e.g., Thai Massage, Balinese)
- **Options**: Duration/price variants for each treatment
- **Gift Cards**: Digital purchase via Stripe with PDF generation

---

## 2. Architecture Philosophy

### Separation of Concerns
The project follows a **content-first, presentation-second** approach:

1. **Content Layer**: JSON files store all business data and translations
2. **Presentation Layer**: React components render the data
3. **Logic Layer**: Server-side utilities handle data fetching and processing

### Key Principles

#### ✅ Type Safety First
- All data structures have TypeScript interfaces
- Server-only functions are marked with `"server-only"` directive
- Props are strongly typed

#### ✅ Static Generation (SSG)
- All pages are pre-rendered at build time using `generateStaticParams()`
- No client-side data fetching for core content
- Optimal performance and SEO

#### ✅ Performance Optimization
- **Efficient searching**: Uses labeled loops to break early
- **Parallel fetching**: `Promise.all()` for concurrent data loading
- **No unnecessary flatMaps**: Data is searched with minimal overhead

#### ✅ Internationalization (i18n)
- URL-based language routing: `/es/`, `/ca/`, `/en/`
- Separate JSON files for UI strings and service data per language
- Language switcher preserves current page context

---

## 3. Project Structure

\`\`\`
terraterapies/
├── app/
│   ├── [lang]/                      # Dynamic language segment
│   │   ├── layout.tsx               # Root layout with Header/Footer
│   │   ├── page.tsx                 # Home page
│   │   ├── [category]/
│   │   │   ├── page.tsx             # Category page (e.g., /es/orientales)
│   │   │   └── [subcategory]/
│   │   │       └── page.tsx         # Treatment detail page
│   │   ├── contact/
│   │   │   └── page.tsx             # Contact page
│   │   ├── about/
│   │   │   └── page.tsx             # About page
│   │   └── faq/
│   │       └── page.tsx             # FAQ page
│   ├── api/
│   │   ├── stripe-checkout/
│   │   │   └── route.ts             # Create Stripe checkout session
│   │   └── stripe-webhook/
│   │       └── route.ts             # Handle payment success & send gift card
│   ├── lib/
│   │   ├── getDictionary.ts         # Load UI translations
│   │   ├── getService.ts            # Load service data & static params
│   │   ├── routes.ts                # Centralized route definitions
│   │   └── utils.ts                 # Utility functions (cn, etc.)
│   └── css/
│       └── style.css                # Global styles
├── components/
│   ├── ui/
│   │   ├── header.tsx               # Navigation with mega-menu
│   │   ├── footer.tsx               # Footer with links
│   │   ├── logo.tsx                 # Logo component
│   │   ├── button.tsx               # Button variants
│   │   ├── input.tsx                # Input with color variants
│   │   ├── textarea.tsx             # Textarea with color variants
│   │   ├── label.tsx                # Form labels
│   │   ├── navigation-menu.tsx     # Radix navigation menu
│   │   ├── dropdown-menu.tsx       # Radix dropdown with colors
│   │   └── popover.tsx              # Radix popover
│   ├── categories/
│   │   ├── categoryHero.tsx         # Hero section for category pages
│   │   └── subcategory-grid.tsx    # Grid of subcategories
│   ├── hero-home.tsx                # Homepage hero
│   ├── business-categories.tsx      # Homepage categories grid
│   ├── treatment-detail.tsx         # Treatment booking page
│   ├── treatwell-widget.tsx         # Treatwell integration (placeholder)
│   ├── aos-init.tsx                 # AOS animation initializer
│   └── pdf/
│       └── giftcardpdf.tsx          # PDF template for gift cards
├── data/
│   ├── es/
│   │   └── services.json            # Spanish service data
│   ├── en/
│   │   └── services.json            # English service data
│   └── ca/
│       └── services.json            # Catalan service data
├── dictionaries/
│   ├── es.json                      # Spanish UI translations
│   ├── en.json                      # English UI translations
│   └── ca.json                      # Catalan UI translations
├── types/
│   └── definitions.ts               # Global TypeScript types
├── public/
│   └── images/
│       ├── logos/
│       ├── categories/
│       ├── subcategories/
│       ├── hero/
│       └── treatment-detail.jpg
└── utils/
    └── locator.ts                   # Generate unique gift card codes
\`\`\`

---

## 4. Data Layer

### 4.1 Services Data (`data/{lang}/services.json`)

Defines the **business structure**: categories, treatments, and pricing.

**Structure**:
\`\`\`typescript
{
  "defaultBackground": "/images/treatment-detail.jpg",
  "navItems": [
    {
      "id": "treatments",
      "label": "Treatments",
      "layout": "mega-menu",  // or "rich-dropdown"
      "highlight": false,
      "emoji": "🌸",
      "categories": [
        {
          "slug": "orientales",
          "title": "Oriental",
          "image": "/images/categories/orientales.jpg",
          "shortDescription": "...",
          "heroImages": [...],
          "showCase": { "title": "...", "description": "..." },
          "subcategories": [
            {
              "slug": "tailandes",
              "title": "Thai Massage",
              "emoji": "🪷",
              "tagline": "...",
              "image": "...",
              "backgroundImage": "...",
              "shortDescription": "...",
              "longDescription": "...",
              "options": [
                { "duration": "60 minutes", "price": "65€" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
\`\`\`

**Key Concepts**:
- **navItems**: Top-level navigation groups (Treatments, Rituals)
- **layout**: Determines header dropdown style
  - `"mega-menu"`: Multi-column grid (for Treatments)
  - `"rich-dropdown"`: Single column with emojis (for Rituals)
- **categories**: Main service types (Oriental, Relaxing, etc.)
- **subcategories**: Individual treatments
- **options**: Pricing tiers with duration

### 4.2 Dictionary Data (`dictionaries/{lang}.json`)

Defines **UI strings** (labels, buttons, messages).

**Structure**:
\`\`\`json
{
  "header": {
    "seeAll": "See all →",
    "languages": { "es": "Spanish", "ca": "Catalan", "en": "English" }
  },
  "home": {
    "hero": { "title": "...", "tagline": "...", "cta": "Book now" }
  },
  "booking": {
    "bookBtn": "Book Now",
    "giftTitle": "Gift this treatment",
    ...
  },
  "footer": {
    "experiences": {
      "title": "Experiences",
      "thai": { "label": "Thai", "categorySlug": "orientales", "subcategorySlug": "tailandes" }
    },
    "info": {
      "contact": { "label": "Contact" },
      "about": { "label": "About us" }
    }
  }
}
\`\`\`

### 4.3 Data Loading Functions

**Location**: `app/lib/getService.ts`, `app/lib/getDictionary.ts`

**Key Functions**:
\`\`\`typescript
// Load service data for a language
getServicesData(lang: string): Promise<ServicesData>

// Generate static params for [category]
getCategoryStaticParams(): Promise<{ lang: string; category: string }[]>

// Generate static params for [category]/[subcategory]
getSubcategoryStaticParams(): Promise<{ lang: string; category: string; subcategory: string }[]>

// Find specific category
getCategory(lang: string, categorySlug: string): Promise<Category | null>

// Find specific treatment
getService(lang: string, categorySlug: string, subcategorySlug: string): Promise<{ category, subcategory } | null>

// Load UI dictionary
getDictionary(locale: string): Promise<Dictionary>
\`\`\`

---

## 5. Routing System

### 5.1 Route Structure

All routes are prefixed with language:

| Route | File | Purpose |
|-------|------|---------|
| `/es` | `[lang]/page.tsx` | Home page (Spanish) |
| `/es/orientales` | `[lang]/[category]/page.tsx` | Category page |
| `/es/orientales/tailandes` | `[lang]/[category]/[subcategory]/page.tsx` | Treatment detail |
| `/es/contact` | `[lang]/contact/page.tsx` | Static page |

### 5.2 Centralized Routes (`app/lib/routes.ts`)

**Purpose**: Single source of truth for all navigation URLs

**Implementation**:
\`\`\`typescript
export const routes = {
  // Static pages
  home: "/",
  contact: "/contact",
  about: "/about",
  faq: "/faq",

  // Dynamic pages
  category: (categorySlug: string) => \`/\${categorySlug}\`,
  subcategory: (categorySlug: string, subcategorySlug: string) => 
    \`/\${categorySlug}/\${subcategorySlug}\`,

  // External links
  external: {
    mezzanote: "https://mezzanote.com",
    whatsapp: (message: string) => 
      \`https://wa.me/34603177049?text=\${encodeURIComponent(message)}\`,
    facebook: "https://www.facebook.com/people/Terraterapies-Thai-Y-Bali/61580296106688",
    instagram: "https://www.instagram.com/terrapiesthaiybali",
  }
} as const;

// Helper to add language prefix
export function getLocalizedRoute(path: string, lang: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return \`/\${lang}\${path}\`;
}
\`\`\`

**Usage**:
\`\`\`typescript
// In Footer component
<Link href={getLocalizedRoute(routes.contact, lang)}>
  Contact
</Link>

<Link href={getLocalizedRoute(
  routes.subcategory("orientales", "tailandes"), 
  lang
)}>
  Thai Massage
</Link>
\`\`\`

---

## 6. Component Architecture

### 6.1 Layout Components

#### Header (`components/ui/header.tsx`)
- **Type**: Client component (`"use client"`)
- **Features**:
  - Desktop mega-menu with NavigationMenu (Radix)
  - Mobile full-screen drawer with accordions
  - Language switcher with flag icons
  - Dynamically populated from `servicesData.navItems`

**Props**:
\`\`\`typescript
{
  lang: string;
  dict: Dictionary["header"];
  navItems: NavItem[];
}
\`\`\`

#### Footer (`components/ui/footer.tsx`)
- **Type**: Client component
- **Features**:
  - Responsive sections (accordions on mobile, static on desktop)
  - Links to categories, static pages, social media
  - Large decorative background text

**Props**:
\`\`\`typescript
{
  border?: boolean;
  dict: FooterDict;
  lang: string;
}
\`\`\`

### 6.2 Page Components

#### Home Page
- **Hero**: Large CTA with background image
- **Categories Grid**: Cards linking to category pages
- **Data Source**: \`servicesData.navItems.flatMap(item => item.categories)\`

#### Category Page
- **Hero Carousel**: Multiple images from \`category.heroImages\`
- **Description**: \`category.shortDescription\`
- **Subcategory Grid**: Cards linking to treatment pages

#### Treatment Detail Page
- **Background Image**: Full-screen hero
- **Description**: Long-form content
- **Booking Options**: List of durations/prices
- **Gift Card Form**: Input fields + Stripe integration

### 6.3 UI Components (Radix-based)

All components in `components/ui/` use Radix primitives:

- **Button**: Variants (default, outline, ghost, destructive), sizes (sm, default, lg, icon), colors (light, dark, default)
- **Input/Textarea**: Color variants (light, dark, muted) for different backgrounds
- **Dropdown/Popover/NavigationMenu**: Fully accessible with keyboard navigation
- **Custom color system**: Context-based colors for dropdowns

---

## 7. Internationalization (i18n)

### 7.1 Strategy
- **URL-based**: Language in path segment (\`/es/\`, \`/ca/\`, \`/en/\`)
- **Static generation**: All language variants pre-rendered
- **No middleware**: Language detected from URL only

### 7.2 Language Switcher Logic

**Desktop** (in Header):
\`\`\`typescript
const switchLang = (newLang: string) => {
  const segments = pathname.split("/");
  segments[1] = newLang;
  router.push(segments.join("/"));
};
\`\`\`

**Mobile**: Same logic, closes menu after switch

### 7.3 Dictionary Updates

When adding new UI strings:

1. Add to TypeScript interface in `app/lib/getDictionary.ts`
2. Add to all JSON files: `dictionaries/es.json`, `dictionaries/ca.json`, `dictionaries/en.json`
3. Type safety ensures no missing translations

---

## 8. Payment Integration

### 8.1 Stripe Checkout Flow

**Endpoint**: `app/api/stripe-checkout/route.ts`

**Flow**:
1. **Client**: User fills gift card form → POST to `/api/stripe-checkout`
2. **Server**: 
   - Validates treatment exists in services data
   - Creates Stripe checkout session with metadata
   - Returns session URL
3. **Client**: Redirects to Stripe hosted checkout
4. **Stripe**: After payment → redirects to success page + triggers webhook

**Security**: Server validates all slugs/options against actual data before creating charge

### 8.2 Webhook Processing

**Endpoint**: `app/api/stripe-webhook/route.ts`

**Flow**:
1. Stripe sends `checkout.session.completed` event
2. Server verifies signature
3. Extracts metadata (buyer, receiver, treatment details)
4. Generates unique locator code
5. Creates PDF gift card using `@react-pdf/renderer`
6. Sends email via Resend with PDF attachment

**Environment Variables**:
- \`STRIPE_SECRET_KEY\`
- \`STRIPE_WEBHOOK_SECRET\`
- \`RESEND_API_KEY\`

---

## 9. External Integrations

### 9.1 Treatwell Widget

**Component**: `components/treatwell-widget.tsx`

**Status**: Placeholder for future Treatwell booking integration

**Purpose**: Embedded booking calendar (alternative to gift cards)

### 9.2 Email Provider (Resend)

**Usage**: Send gift card PDFs after purchase

**Template**: React component converted to HTML

### 9.3 Social Media Links

- **WhatsApp**: Direct message with pre-filled text
- **Facebook**: Business page
- **Instagram**: Business profile

---

## 10. Type System

### 10.1 Core Types (`types/definitions.ts`)

\`\`\`typescript
// Service Data
export interface ServicesData {
  defaultBackground: string;
  navItems: NavItem[];
}

export interface NavItem {
  id: string;
  label: string;
  layout: "mega-menu" | "rich-dropdown";
  highlight: boolean;
  emoji?: string;
  categories: Category[];
}

export interface Category {
  slug: string;
  title: string;
  image: string;
  shortDescription: string;
  heroImages?: { src: string; alt: string }[];
  showCase?: { title: string; description: string };
  subcategories: Subcategory[];
}

export interface Subcategory {
  slug: string;
  title: string;
  emoji?: string;
  tagline?: string;
  image: string;
  backgroundImage?: string;
  shortDescription: string;
  longDescription: string;
  options: Option[];
}

export interface Option {
  duration: string;
  price: string;
  originalPrice?: string;
  tag?: string;
}

// Dictionary
export interface Dictionary {
  header: { ... };
  pages: { ... };
  home: { ... };
  booking: { ... };
  footer: { ... };
}
\`\`\`

---

## 11. Utility Functions

### 11.1 Class Name Helper (`app/lib/utils.ts`)

\`\`\`typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
\`\`\`

**Usage**: Merge Tailwind classes safely
\`\`\`typescript
<div className={cn("base-class", condition && "conditional-class", className)} />
\`\`\`

### 11.2 Locator Generator (`utils/locator.ts`)

Generates unique gift card codes (e.g., `TT-2024-JOHN-A3F9`)

---

## 12. Environment Variables

### Required Variables

\`\`\`env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email
RESEND_API_KEY=re_...

# Base URL
NEXT_PUBLIC_URL=https://terraterapies.com
\`\`\`

---

## 13. Development Guidelines

### 13.1 Adding New Treatments

1. **Update services.json** (for each language):
   \`\`\`json
   {
     "slug": "new-treatment",
     "title": "New Treatment",
     "emoji": "✨",
     "options": [{ "duration": "60 min", "price": "70€" }]
   }
   \`\`\`

2. **Add images**:
   - \`public/images/subcategories/new-treatment.jpg\`
   - Optional: Custom background image

3. **Build**: Pages auto-generate via \`generateStaticParams()\`

### 13.2 Adding New Pages

1. **Create folder**: \`app/[lang]/new-page/page.tsx\`
2. **Update routes.ts**: Add route definition
3. **Update dictionary**: Add labels/content
4. **Update Footer/Header**: Add navigation links

### 13.3 Coding Standards

- **Server components by default**: Only add \`"use client"\` when necessary
- **Type everything**: No implicit \`any\`
- **Use \`cn()\`**: For conditional class names
- **Await params**: Next.js 15+ requires \`await params\`
- **Error boundaries**: Handle missing data gracefully

### 13.4 Where to Use getRoutes

**Primary Locations**:

1. **Header** (\`components/ui/header.tsx\`):
   \`\`\`typescript
   import { routes, getLocalizedRoute } from "@/app/lib/routes";

   <Link href={getLocalizedRoute(
     routes.category(cat.slug), 
     lang
   )}>
   \`\`\`

2. **Footer** (\`components/ui/footer.tsx\`):
   \`\`\`typescript
   <Link href={getLocalizedRoute(routes.contact, lang)}>
     {dict.info.contact.label}
   </Link>
   \`\`\`

3. **Category Grid Components**:
   \`\`\`typescript
   <Link href={getLocalizedRoute(
     routes.subcategory(categorySlug, subcategorySlug),
     lang
   )}>
   \`\`\`

4. **Stripe Cancel URL** (\`app/api/stripe-checkout/route.ts\`):
   \`\`\`typescript
   import { routes, getLocalizedRoute } from "@/app/lib/routes";

   cancel_url: \`\${process.env.NEXT_PUBLIC_URL}\${getLocalizedRoute(
     routes.subcategory(categorySlug, subCategorySlug),
     lang
   )}\`
   \`\`\`

5. **Logo Component** (\`components/ui/logo.tsx\`):
   \`\`\`typescript
   import { routes, getLocalizedRoute } from "@/app/lib/routes";

   const href = lang ? getLocalizedRoute(routes.home, lang) : "/";
   \`\`\`

**Benefits**:
- ✅ Type-safe routes
- ✅ Single source of truth
- ✅ Easy refactoring
- ✅ No hardcoded URLs

---

## Quick Reference

### File Path Patterns
- Pages: \`app/[lang]/.../page.tsx\`
- API: \`app/api/.../route.ts\`
- Components: \`components/.../component-name.tsx\`
- Data: \`data/{lang}/services.json\`
- Dictionary: \`dictionaries/{lang}.json\`

### Common Imports
\`\`\`typescript
// Data
import { getServicesData, getDictionary } from "@/app/lib/...";

// Routes
import { routes, getLocalizedRoute } from "@/app/lib/routes";

// UI
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Types
import { Category, Subcategory } from "@/types/definitions";
\`\`\`

### Debug Checklist
- [ ] Is language in URL correct?
- [ ] Does slug exist in services.json?
- [ ] Are all dictionary keys present in all languages?
- [ ] Is route using \`getLocalizedRoute()\`?
- [ ] Are server components marked \`"server-only"\`?
- [ ] Are client components marked \`"use client"\`?

---

**End of Blueprint** 🎯

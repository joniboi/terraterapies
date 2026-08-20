# Terraterapies Thai & Bali - Architectural Blueprint 2.0

> **Last Updated**: October 2024 (Database Era)  
> **Framework**: Next.js 15+ (App Router)  
> **Language**: TypeScript  
> **Database**: PostgreSQL (via Drizzle ORM)  
> **Infrastructure**: Hetzner VPS + Coolify (Self-hosted)  
> **Styling**: Tailwind CSS v4 + Radix UI / Base UI

---

## Table of Contents

1. [System Architecture & Infrastructure](#1-system-architecture--infrastructure)
2. [Project Structure (Route Groups)](#2-project-structure-route-groups)
3. [Database Schema (The Source of Truth)](#3-database-schema-the-source-of-truth)
4. [Internationalization (i18n)](#4-internationalization-i18n)
5. [The Backoffice (CMS & Security)](#5-the-backoffice-cms--security)
6. [Promotions & Discount Engine](#6-promotions--discount-engine)
7. [Gift Cards & QR Verification](#7-gift-cards--qr-verification)
8. [Image Processing Pipeline](#8-image-processing-pipeline)
9. [Environment Variables](#9-environment-variables)
10. [Future Roadmap & Development Guidelines](#10-future-roadmap--development-guidelines)

---

## 1. System Architecture & Infrastructure

Terraterapies is a monolithic Next.js application self-hosted on a Hetzner VPS using Coolify as the orchestration layer.

- **Server**: Next.js Node server handling both UI rendering and API endpoints.
- **Database**: PostgreSQL 16 running as a container in Coolify.
- **File Storage**: Local persistent volume (`/data/terraterapies/uploads` mounted to `/app/public/uploads`) to ensure user-uploaded images survive container deployments.
- **Caching Strategy**: `force-dynamic` and `noStore()` are heavily utilized on public data pages to ensure the client always sees real-time database updates (crucial for promotions and price changes).

---

## 2. Project Structure (Route Groups)

The application uses **Next.js Route Groups** to separate concerns, layouts, and security rules cleanly:

\`\`\`text
app/
├── (backoffice)/ # ADMIN & SECURITY ZONE (English, Secure)
│ ├── layout.tsx # Heavy admin layout (Sidebar, Admin CSS)
│ ├── signin/ # Cruip Login Template
│ └── admin/ # Protected CMS Dashboard
│ ├── services/ # Treatment Editor (Markdown, Prices, Promos)
│ └── gift-cards/ # Gift Card Ledger & Redemption
├── (utility)/ # STANDALONE PUBLIC TOOLS
│ ├── layout.tsx # Clean, mobile-first layout
│ └── verify/ # QR Code Verification Page (Public/Admin hybrid)
├── [lang]/ # PUBLIC E-COMMERCE SITE (es, ca, en)
│ ├── layout.tsx # Public Header/Footer
│ ├── page.tsx # Home
│ └── [category]/ # Dynamic Category & Treatment pages
├── api/
│ ├── stripe-webhook/ # Payment processing & DB insertion
│ └── upload/ # Sharp Image Processing API
├── lib/ # Utilities (getService, routes, dictionaries)
└── db/ # Drizzle ORM Schema & Connection
\`\`\`

---

## 3. Database Schema (The Source of Truth)

We utilize a **Hybrid Relational-Document Model**. Structural data uses strict columns, while translatable content utilizes PostgreSQL `JSONB` columns type-casted to an `I18nString` interface.

### Core Tables:

1.  **`serviceGroups`**: Top-level navigation (e.g., Treatments, Rituals).
2.  **`categories`**: Service families (e.g., Oriental, Relaxing) with `heroImages` and `showCase` JSONB arrays.
3.  **`treatments`**: The specific massages. Contains `longDescription` (stored as raw Markdown).
4.  **`treatmentVariants`**: Pricing and durations. Includes `promotionalPrice` and `promoEndsAt` for the Discount Engine.
5.  **`giftCards`**: The ledger. Stores exact snapshots of the treatment, price, and recipient at the moment of purchase.
6.  **`dailyCounters`**: Replaces external Redis (Upstash). Generates atomic, sequential numbers for locator codes (e.g., `001`, `002`).

---

## 4. Internationalization (i18n)

- **UI Strings**: Stored in `dictionaries/{lang}.json`. Handled by `getDictionary.ts`. Used for hardcoded buttons, headers, and footers.
- **Business Data**: Stored in the DB `JSONB` columns.
- **Type Safety**: The `I18nString` type ensures `es`, `en`, and `ca` are strictly typed during database inserts.
- **URL Routing**: Controlled by `proxy.ts` (Next.js middleware). Automatically detects the user's language and prepends the URL, while ignoring `/admin`, `/verify`, and API routes.

---

## 5. The Backoffice (CMS & Security)

### Security (The "Vault")

- Powered by **Auth.js (NextAuth)**.
- `proxy.ts` acts as the Bouncer: Any request to `/admin/*` without a valid session is aggressively redirected to `/signin`.
- Credentials rely on strictly guarded Environment Variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

### The Editor Engine

- **WYSIWYG Markdown**: Uses `@uiw/react-md-editor` so the admin can write rich text. The public site uses `react-markdown` to render it via Tailwind Typography (`prose prose-invert`).
- **Render Props**: Uses a highly reusable `<LanguageTabs>` component to inject language contexts into form fields cleanly.

---

## 6. Promotions & Discount Engine

The platform includes an automated "Tease and Reveal" discount system that requires zero midnight maintenance.

1.  **Admin Input**: Admin sets `promotionalPrice` (e.g., 45€) and `promoEndsAt` (Date).
2.  **Calculation**: `getService.ts` checks if `Date.now() < promoEndsAt`. If true, it overrides the price and calculates the `% OFF`.
3.  **The Tease (Grid)**: Public category cards dynamically render a pulsing `🎁 -25% OFF` badge if any variant has an active promo.
4.  **The Reveal (Checkout)**: The treatment detail page renders the original price crossed out (`~60€~ 45€`) and displays the expiry date to induce FOMO.
5.  **Expiration**: Once the date passes, the site automatically reverts to standard pricing.

---

## 7. Gift Cards & QR Verification

### The Purchase Flow

1.  Stripe processes payment -> Webhook fires.
2.  **Atomic Counter**: DB `dailyCounters` generates a locator (e.g., `JU-140424-001`).
3.  **Data Snapshot**: The sale (names, exact price paid, treatment name) is saved to the `giftCards` table.
4.  **Secret QR**: The PDF is generated. The QR code embeds the secret Database UUID, _not_ the human locator code.

### The Verification Flow (`/verify?id=UUID`)

- **IDOR Protection**: The UUID makes guessing URLs impossible, protecting customer data.
- **Public View**: Customers scanning the code see a beautiful Green/Red "VALID" or "REDEEMED" screen.
- **Admin View**: If the Admin scans the code while logged into their phone, a **"Mark as Used"** Base UI Alert Dialog appears, allowing instant 1-tap redemption.

---

## 8. Image Processing Pipeline

Images uploaded in the Backoffice are heavily guarded and optimized before touching the Hetzner disk:

- **Endpoint**: `/api/upload`
- **Security Guardrails**: Magic byte verification (ensures it is an image), 4MB hard limit, and automatic renaming to a UUID (prevents directory traversal attacks).
- **Optimization (Sharp)**: Automatically resizes to max 1200px width and converts to high-quality `.webp` format for maximum SEO and performance.
- **Storage**: Saved to the Coolify Persistent Volume `/app/public/uploads`.

---

## 9. Environment Variables

\`\`\`env

# Next.js / Core

NEXT_PUBLIC_URL=https://terraterapiesthaibali.com

# Database (Production format)

DATABASE_URL=postgresql://postgres:password@postgresql-container-name:5432/postgres

# Security (Auth.js)

AUTH_SECRET=base64_encoded_random_32_bytes
AUTH_URL=https://terraterapiesthaibali.com
AUTH_TRUST_HOST=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strong_password

# External APIs

NEXT*PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live*...
STRIPE*SECRET_KEY=sk_live*...
STRIPE*WEBHOOK_SECRET=whsec*...
RESEND*API_KEY=re*...
\`\`\`

---

## 10. Future Roadmap & Development Guidelines

### Current State

- Treatments can be edited completely (prices, promos, markdown, images).
- Gift Cards can be tracked, filtered, and redeemed.

### Upcoming Features (How to implement them):

#### 1. Managing Categories (e.g., Adding "Facials")

- Create `/admin/categories` page.
- Build a CRUD form targeting the `schema.categories` table.
- Ensure the form supports uploading multiple `heroImages`.

#### 2. Adding / Removing Treatments

- Update `/admin/services/page.tsx` to activate the "+ Add New Treatment" button.
- _Soft Delete Pattern_: Instead of deleting rows, add an `isActive` boolean to the `treatments` table so old Stripe receipts don't break if a treatment is removed. Filter out `isActive: false` in `getService.ts`.

#### 3. Homepage Global Promotions

- Query `treatmentVariants` for active promos globally.
- Pass the top 3 discounted treatments to a new `PromotionsSlider` component on the `app/[lang]/page.tsx`.

### Architectural Rules

1.  **Never trust the browser**: Validations (Prices, Statuses) must be enforced via Server Actions or Webhooks.
2.  **Drizzle `push`**: Always run `npx drizzle-kit push` locally and test migrations before touching Hetzner.
3.  **UI Components**: Use Cruip/Radix/BaseUI components from `components/ui`. Avoid raw HTML elements for inputs/buttons to maintain global styling consistency.

---

**End of Blueprint 2.0** 🎯

# 🛒 E-Commerce & Core Logic

## 1. The Gift Card & QR System

We handle digital gift card sales natively, bypassing external SaaS fees.

- **Payment:** Handled via Stripe Checkout.
- **Atomic Counters (`dailyCounters`):** Replaces external Redis. Generates human-readable, sequential locator codes (e.g., `JU-140424-001`) safely.
- **The Ledger (`giftCards`):** When Stripe's webhook fires, a snapshot of the sale (price, treatment name, buyer/receiver, sessions) is locked into the DB.
- **PDF Generation:** `@react-pdf/renderer` generates the gift card. The embedded QR code points to the secret DB UUID (preventing URL guessing).
- **Verification (`/verify`):**
  - _Public View:_ Customer scans QR and sees "VALID" or "REDEEMED".
  - _Admin View:_ If logged into the Backoffice, scanning the QR reveals a 1-tap "Mark as Used" redemption button.

## 2. Promotions & Discount Engine ("Tease & Reveal")

- **Admin Input:** Admin sets `promotionalPrice` and `promoEndsAt` on a `treatmentVariant`.
- **Logic:** The system dynamically checks if `Date.now() < promoEndsAt`.
- **The Tease:** Public category cards calculate the `% OFF` and show a pulsing badge.
- **The Reveal:** The treatment page shows the crossed-out original price (`~60€~ 45€`).
- **Expiration:** Zero maintenance. Once the date passes, standard pricing resumes automatically.

## 3. Image Processing Pipeline

To protect the Hetzner server and guarantee SEO performance, all admin uploads pass through `/api/upload/route.ts`:

- **Guardrails:** 4MB hard limit and magic byte verification.
- **Security:** Files are renamed to a `UUID` to prevent directory traversal attacks.
- **Optimization:** `sharp` resizes images (max 1200px wide) and converts them to high-quality `.webp` format.
- **Storage:** Saved directly to the Coolify Persistent Volume `/app/public/uploads`.

## 4. Custom Traffic Analytics

We track visits internally via `app/actions/track.ts` and the `visits` table:

- **Bot Filter:** Ignores crawlers (Google, Facebook, Lighthouse).
- **Source Detection:** Reads `referer` and URL params to categorize traffic (Instagram, Google, Treatwell, Direct).
- **Privacy:** Uses a daily hashed footprint (`IP + UserAgent + Date`) instead of cookies.

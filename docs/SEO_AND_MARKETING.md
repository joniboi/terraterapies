# 📈 SEO & Marketing Engineering

Because we use a White-Label Database architecture, SEO tags cannot be hardcoded. They must be dynamically generated to serve the specific brand (Terraterapies vs. Lotus).

## 1. Technical SEO Implementations

- **Dynamic Metadata:** Handled inside every `page.tsx` via `generateMetadata()`. It combines `treatment.title` with `siteSettings.businessName` dynamically. (e.g., "Masaje Tailandés | Lotus de Bali").
- **Structured Data (JSON-LD):** The `<LocalBusinessSchema />` component injects the exact coordinates and phone number from the DB into the HTML `<head>`. This bridges the website directly to the **Google Business Profile (Maps)**, solving local ranking issues.
- **Sitemap & Robots:**
  - `app/sitemap.ts` programmatically loops through all ES/CA/EN categories and treatments to hand Googlebot a perfect URL list.
  - `robots.ts` explicitly hides `/admin` and `/api` from search engines.
- **Semantic HTML:** Strict adherence to using one `<h1>` per page, and providing dynamic `alt=""` attributes for all images based on treatment names.
- **Google Ads Tracking:** Revenue-based conversion tracking is injected into `app/[lang]/success/page.tsx`, securely reading the `session_id` and purchase value for accurate Ad ROI calculation.

## 2. Marketing Engineering (Actionable Features)

- **Review Engine (Social Proof):**
  - _The Feature:_ `ReviewsSlider` component dynamically pulls the best 5-star reviews from the `reviews` database table.
  - _The Strategy:_ Automate a WhatsApp message to happy clients 1 hour after their massage requesting a Google Review. Backoffice admin copies the best ones to the website to drive conversions.
- **Thin Content Prevention:**
  - _The Feature:_ `@uiw/react-md-editor` in the Backoffice allows long-form Markdown writing for treatment descriptions.
  - _The Strategy:_ Google ignores pages with thin text. The admin must write rich paragraphs describing the oils, benefits, and neighborhood for top treatments to rank organically.
- **Flash Sales (FOMO):**
  - _The Feature:_ Utilizing the "Tease & Reveal" discount engine (setting `promotionalPrice` and `promoEndsAt`).
  - _The Strategy:_ When running Google Ads, activate a temporary promotion. The pulsing `-15% OFF` badge creates FOMO, turning expensive ad clicks into immediate Fresha bookings.

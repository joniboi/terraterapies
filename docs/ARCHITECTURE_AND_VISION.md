# 🏛️ Architecture & UI/UX Vision

This document outlines the current data structure and the active design philosophy for Terraterapies Thai & Bali.

## 1. The Data Hierarchy (Implemented)

We use a **Hybrid Relational-Document Model** in PostgreSQL (via Drizzle ORM). Structural data uses strict columns, while translatable content utilizes `JSONB` columns type-casted to an `I18nString` interface (`es`, `ca`, `en`).

The core hierarchy has been flattened to match how humans actually think about the business:
**Service Group ➔ [Optional Category] ➔ Treatment ➔ Variant**

- **Service Groups (The Pillars):** Masajes, Rituales, Faciales, Parejas, Bonos.
- **Categories (Optional Sub-grouping):** e.g., "Orientales", "Relajantes" inside the "Masajes" group.
- **Treatments:** The specific service (e.g., "Balinés"). Direct association to a Service Group is supported (Category is nullable).
- **Variants:** The sellable options (e.g., 60 min - 65€).

## 2. The UI/UX Upgrade (Current Focus)

The current objective is to elevate the website from looking like a "clean template" to a **premium, atmospheric luxury experience** that matches the physical centre.

### A. Spatial Design & Scale

- **Wider Content:** The current 600-700px constrained column feels like a mobile site on a desktop. We are expanding max-widths to `1100px - 1250px` (`max-w-6xl`/`7xl`) so cards can breathe and typography can be more confident.
- **Visual Hierarchy:** The homepage must tell a story: _Seduce ➔ Explain ➔ Establish Trust ➔ Make Booking Easy_.

### B. The New Homepage Flow (Pending)

1.  **Immersive Hero:** Logo, navigation, and a large atmospheric photo. Clear CTAs: "Reserva ahora" & "Regala un tratamiento".
2.  **The Pillars ("Descubre nuestros tratamientos"):** 5 main visual cards (Masajes, Rituales, Faciales, Parejas, Bonos).
3.  **Masajes Breakdown:** "Masajes para cada momento" (Orientales, Relajantes, Terapéuticos, Reafirmantes).
4.  **Atmosphere / "Conócenos":** Selling the location, not just the service.
5.  **Social Proof:** ⭐⭐⭐⭐⭐ Reviews prominently displayed.
6.  **Location:** Address, map, and final booking CTA.

### C. Photography Art Direction

The website relies on distinct photographic compositions:

- **Desktop (Landscape 16:9):** Wide atmospheric shots with **heavy negative space** on one side to overlay text cleanly.
- **Mobile (Portrait 4:5):** Specifically shot vertical images so we don't rely on awkward crops of desktop photos.
- **Style:** Warm lighting, dark wood, gold accents, candles. Avoid generic stock "spa" styles; highlight the actual Sarrià location.

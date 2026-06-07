This is exactly how real software products evolve. You get the core working, and then the stakeholders (your wife! 😄) start asking for new features because they see the potential.

Let's address your questions first, and then I will give you the updated, formalized **Roadmap 2.0**.

### Answers to your questions:

**1. Did we remove Upstash? How can I check it?**

- **Status**: We built the _Database Table_ for it (`giftCards` is in your `schema.ts`!), but **we have not removed Upstash yet**.
- **Why**: Your `app/api/stripe-webhook/route.ts` file still has the code connecting to Upstash. We need to rewrite that webhook to use `db.insert(giftCards)` instead. (This will be in our new roadmap).

**2. The Markdown `**` is showing on the public website!\*\*

- **Status**: Expected behavior. The database is saving raw Markdown, but your public `components/treatment-detail.tsx` is rendering it as plain HTML.
- **Fix**: Since you already installed `react-markdown`, we just need to wrap the description in the component. We will do this right away.

**3. Temporary Promotions & Discounts**

- **Architecture choice**: We don't need a whole new table. The smartest way is to add two columns to your `treatmentVariants` table: `promotionalPrice` (decimal) and `promoEndsAt` (timestamp).
- **How it works**: In the backoffice, she types "50€" and selects a date "Oct 31". The public website will automatically check: _Is today before Oct 31? If yes, show 50€ and cross out the old price. If today is Nov 1, automatically hide the promotion and show the normal price._ (Zero midnight maintenance for her!).

**4. The Gift Card / QR Code System**

- **Architecture**: You already have the `giftCards` table perfectly designed for this! It has `locatorCode`, `status` (valid, used), and `redeemedAt`.
- **Security for `/verify`**: The QR code will point to `https://terraterapies.com/verify?code=XYZ`.
  - If a _Customer_ scans it, they see: "Gift Card Valid for Thai Massage".
  - If _Your Wife_ scans it (because her phone is logged into `/admin`), the Bouncer recognizes her and shows a **"MARK AS USED"** button. This prevents random people from invalidating gift cards.

---

### 🗺️ EVOLUTION ROADMAP 2.0 (The Final Stretch)

Here is our updated plan. I recommend copying this into your `EVOLUTION_ROADMAP.md` file.

#### 🟢 Phase 1: Core CMS (COMPLETED)

- [x] Database Schema & Local Environment
- [x] JSON to PostgreSQL Migration
- [x] Image Uploading & Persistent Storage
- [x] Admin Login & Security Bouncer
- [x] Edit Treatments (Markdown, Tabs, Prices)

#### 🟡 Phase 2: Public Site Sync & Promotions (WE ARE HERE)

- [ ] **2.1. Render Markdown**: Update `TreatmentDetail` component to parse `react-markdown`.
- [ ] **2.2. Promotions Schema**: Add `promotionalPrice` and `promoEndsAt` to the DB.
- [ ] **2.3. Promotions UI**: Add the discount fields to the Price Editor in the Backoffice.
- [ ] **2.4. Public Promotions**: Update the public website to show crossed-out prices and "Offer ends on X" badges.

#### 🟠 Phase 3: Expanding the Catalog (The "Facial" Requirement)

- [ ] **3.1. Create Categories**: Build an Admin page to add a new Category (e.g., "Facials").
- [ ] **3.2. Create Treatments**: Build the "Add New Treatment" flow (reusing the massive form we just built).
- [ ] **3.3. Delete/Hide**: Add functionality to hide treatments that are out of season.

#### 🔴 Phase 4: The Gift Card & QR Code Ecosystem

- [ ] **4.1. Replace Upstash**: Rewrite `stripe-webhook/route.ts` to generate the locator and save it to PostgreSQL.
- [ ] **4.2. Verify Page (Public)**: Build `/verify` to read the DB and show Gift Card status.
- [ ] **4.3. Redemption System**: Add the "Mark as Used" button (only visible to logged-in Admin).
- [ ] **4.4. Admin Log**: Build the `/admin/gift-cards` page so she can see a history of all sold and redeemed cards.

#### 🔵 Phase 5: Social Proof (The Reviews Engine)

- [ ] **5.1. Database Schema**: Add `reviews` table to Drizzle (`I18nString` for translations).
- [ ] **5.2. The Marquee Component**: Build the CSS-only infinite scrolling slider for the public Homepage.
- [ ] **5.3. Public Data Fetching**: Query active reviews from the DB and pass them to the component.
- [ ] **5.4. Backoffice Editor**: Create `/admin/reviews` so she can paste and translate the best Google reviews.

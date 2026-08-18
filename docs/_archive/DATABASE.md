This is the master roadmap for the **Terraterapies Evolution**. It is designed to be safe, professional, and cost-free.

Save this content into a new file in your project called `EVOLUTION_ROADMAP.md`. This will be our "Checklist" for every future conversation.

---

# 🗺️ Terraterapies: Database & Backoffice Roadmap

**Objective**: Transition from static JSON/Upstash to a self-hosted PostgreSQL + Persistent Volume architecture on Hetzner, providing a secure multilingual Backoffice.

---

## 🟢 Milestone 1: The Foundation (Local & Server)

_Goal: Get the "Plumbing" ready without touching the live website._

- [ ] **1.1. Local Environment**:
  - [x] Create branch `feat/database-migration`.
  - [x] Set up `docker-compose.yml` with PostgreSQL 16.
  - [x] Install Drizzle ORM & Kit.
  - [x] Create `db/schema.ts` (JSONB for i18n + Gift Card tracking).
  - [x] Run `npx drizzle-kit push` to initialize local DB.
- [ ] **1.2. Production Database**:
  - [ ] Create PostgreSQL resource in Coolify (Hetzner).
  - [ ] Add `DATABASE_URL` to Coolify environment variables.
- [ ] **1.3. Drizzle Studio**:
  - [ ] Run `npx drizzle-studio` to verify you can see the tables visually.

---

## 🟡 Milestone 2: The Data Migration (JSON -> DB)

_Goal: Move existing services and prices into the database._

- [ ] **2.1. Migration Script**:
  - [ ] Create a `scripts/migrate.ts` file.
  - [ ] Write logic to read `services.json` and `prices.json`.
  - [ ] Map the data into the new `categories`, `treatments`, and `options` tables.
- [ ] **2.2. Validation**:
  - [ ] Run the script locally and check if the database perfectly matches the JSON content.

---

## 🟠 Milestone 3: The Persistent Storage & Uploads

_Goal: Configure the Hetzner hard drive to store images safely._

- [ ] **3.1. Coolify Configuration**:
  - [ ] Create a "Persistent Volume" in Coolify: `/data/terraterapies/uploads` -> `/app/public/uploads`.
- [ ] **3.2. Image Processing Logic (The "Guardrails")**:
  - [ ] Install `sharp` for image manipulation.
  - [ ] Create `app/api/upload/route.ts` with:
    - [ ] Size limits (4MB).
    - [ ] Magic byte verification (Is it really an image?).
    - [ ] Auto-rename to unique UUIDs.
    - [ ] Auto-convert to WebP.

---

## 🔴 Milestone 4: The Backoffice (The "Wife" Interface)

_Goal: Create the UI for your wife to edit content without code._

- [ ] **4.1. Authentication**:
  - [ ] Create a simple `/admin` login (NextAuth or Middleware protection).
- [ ] **4.2. Dashboard CRUD**:
  - [ ] **Categories Page**: Edit titles/descriptions/images for Oriental, Relaxing, etc.
  - [ ] **Treatments Page**: Edit Thai, Balinese, etc.
  - [ ] **Price Editor**: A quick table to change durations and prices.
- [ ] **4.3. I18n Editor**:
  - [ ] Implementation of a "Tabbed" form (ES | CA | EN) so she can edit all translations at once.

---

## 🟣 Milestone 5: Replacing Upstash (Gift Card Logic)

_Goal: Move locator codes from Redis to PostgreSQL._

- [ ] **5.1. Stripe Webhook Update**:
  - [ ] Modify `app/api/stripe-webhook/route.ts`.
  - [ ] Replace Upstash logic with `db.insert(giftCards)`.
  - [ ] Generate the locator code directly in the DB.
- [ ] **5.2. Redemption Logic**:
  - [ ] Create a basic `/admin/verify` page to check if a locator code is valid/used.

---

## ⚪ Milestone 6: The "Great Switch" (Going Live)

_Goal: Stop reading JSON and start reading the Database._

- [ ] **6.1. Library Refactor**:
  - [ ] Update `app/lib/getService.ts` to use Drizzle queries instead of `fs.readFile`.
- [ ] **6.2. ISR / Revalidation**:
  - [ ] Add `revalidatePath("/")` to the Backoffice "Save" buttons so changes appear instantly on the live site.
- [ ] **6.3. Merge & Deploy**:
  - [ ] Merge `feat/database-migration` into `main`.
  - [ ] Push to GitHub -> Coolify deploys.
- [ ] **6.4. Final Cleanup**:
  - [ ] Delete old JSON files and remove the Upstash account.

---

### ⚠️ Current Blockers / Decisions

1. **Next.js Config**: We need to ensure `next.config.js` allows serving images from the `/public/uploads` folder accurately when using persistent volumes.
2. **Backups**: Ensure Hetzner "Snapshots" are active before she starts uploading real photos.

---

### Next Action for You:

**Confirm that Milestone 1.1 is fully complete.**
To do this:

1. Run `npx drizzle-kit push`.
2. Run `npx drizzle-kit studio`.
3. Open the browser at the link it gives you (usually `localhost:4983`).
4. **Do you see your tables (categories, treatments, gift_cards, etc.) listed on the left sidebar?**

If yes, we are ready to write the **Migration Script (Milestone 2.1)** to move your JSON data into those tables!

Here is the exact priority list, ordered from **"Most Urgent/High Impact"** to **"Nice to Have / Cleanup."**

---

### 🔥 Priority 1: Dynamic Metadata (The First Impression)

- **Why it's #1:** Without this, every single page on your website has the exact same generic title or no title at all. Google has no idea what each page is about.
- **Impact:** High. This is what changes your search results from looking like a broken link to looking like a professional, keyword-rich result.

### 🚀 Priority 2: Structured Data / JSON-LD (The Google Maps Bridge)

- **Why it's #2:** Remember your Google Maps problem where you were ranking #11 despite being 10 seconds away? This script is the direct bridge between your website and your Google Business Profile. It tells Google: _"These two things are the exact same business in this exact coordinate."_
- **Impact:** High (specifically for Local SEO and Google Maps ranking).

### 🗺️ Priority 3: The `sitemap.ts` (The Highway for Google)

- **Why it's #3:** Without a sitemap, Googlebot has to wander through your website blindly, clicking links to find your pages. A sitemap gives it a neat list of every single treatment URL in Spanish, Catalan, and English.
- **Impact:** Medium-High. Ensures deep pages (like individual treatments) get indexed much faster.

### 🛠️ Priority 4: Semantic HTML & Image Alt Tags (The Under-the-Hood Cleanup)

- **Why it's #4:** Ensuring your titles are wrapped in `<h1>` tags and your images have `alt` text.
- **Impact:** Medium. Helps Google understand the context of your text and images, and helps you rank in Google Image Search.

### 🚪 Priority 5: `robots.ts` (The Bouncer)

- **Why it's #5:** It’s a very simple text file telling crawlers what they can and cannot see.
- **Impact:** Low-Medium. It’s a mandatory best practice, but Google is smart enough to crawl a Next.js site even without a custom `robots.ts`. Still, it takes 2 minutes to make, so you should do it.

---

### About Google Search Console vs. Google Business Profile

**No, she does NOT automatically have Google Search Console just because she has a Google Business Profile.** They are two entirely different products:

1.  **Google Business Profile** (`business.google.com`): This is her **map listing** (where customers leave reviews, see your address, hours, and photos). She probably uses this all the time.
2.  **Google Search Console** (`search.google.com/search-console`): This is the **developer dashboard** for the website. This is where you, as the webmaster, talk directly to Google's engineering department.

#### What you need to do:

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Log in with the same Google account she uses for the business.
3. Click **Add Property** and type your domain (`https://lotusdebaliythai.com`).
4. Google will ask you to verify you own it (usually by giving you a short piece of code to paste into your Next.js `layout.tsx` file, or via a DNS TXT record in your domain registrar).
5. Once verified, you will have a dashboard where you can upload your sitemap (`https://lotusdebaliythai.com/sitemap.xml`) and watch Google start indexing your pages over the next few days.

Once you set up Search Console, you can literally check back in a week to see how many of your database-driven treatment pages Google has read and indexed!ROADMAP_GOOGLE_POSITIONING.md

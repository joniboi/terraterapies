# 🛡️ Secure Database Migration Guide

> **Objective**: Update the database schema (e.g., adding a new table) locally and in production _without_ exposing the server to hackers or triggering Hetzner abuse warnings.

## Phase 1: Local Environment

When you are developing on your local computer, it is perfectly safe to push changes directly to your local Docker database.

### 1. Update your Schema

Add your new table or column in `db/schema.ts`.
_(e.g., Adding the `reviews` table)._

### 2. Push to Local Database

Run the Drizzle push command. This reads your `.env.local` file and updates your local PostgreSQL container.

```bash
npx drizzle-kit push
```

### 3. Verify Locally

Open Drizzle Studio to confirm the table was created.

```bash
npx drizzle-kit studio
```

Check `localhost:4983` to see your new `reviews` table.

---

## Phase 2: Close the Hetzner Vulnerability

Before we update production, we must ensure your database is completely hidden from the internet.

1. Log into your **Coolify Dashboard**.
2. Go to your **PostgreSQL Service**.
3. Look for the setting called **"Make it publicly available"** (or Port Mappings).
4. **Disable it / Uncheck it**.
   _(Your Next.js app can still talk to the database perfectly fine because they are in the same internal Docker network in Coolify. It just prevents the outside world from seeing it)._
5. Click **Save / Restart** if prompted.

---

## Phase 3: Production Environment (The Secure Way)

Now that port `5432` is closed, you cannot run `npx drizzle-kit push` from your local laptop pointing to the live server. It will fail (which is good!).

Instead, we will tell the Next.js container _inside_ the Hetzner server to do the update for us.

### 1. Add a Script to `package.json`

To make it easy, add a command to your `package.json` locally:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "db:push": "drizzle-kit push" // <-- ADD THIS LINE
}
```

### 2. Push Your Code to GitHub

Commit your `schema.ts` and `package.json` changes and push them to your `main` branch.

```bash
git add .
git commit -m "feat: add reviews table"
git push
```

_(Coolify will detect the push and automatically deploy the new version of your Next.js app)._

### 3. Run the Update Inside Coolify

Once Coolify finishes building and deploying your app:

1. Open the **Coolify Dashboard**.
2. Click on your **Next.js Application** (Terraterapies).
3. On the left menu for the app, click **Terminal** (or Console).
4. You are now securely inside your live server. Type the following command and hit Enter:
   ```bash
   npm run db:push
   ```
5. Drizzle will connect to the internal database using the production `DATABASE_URL` and safely apply the schema update.

### 🎉 Success!

You have successfully updated your production database!

- **Zero open ports.**
- **Zero Hetzner warnings.**
- **100% Secure.**

---

### 💡 Pro-Tip: How to view Production Data (Drizzle Studio) securely?

If you ever need to look at the live production data using Drizzle Studio, you still don't need to open the port. You can use an **SSH Tunnel**.

Run this command in your local terminal (replace `YOUR_SERVER_IP` with your Hetzner IP):

```bash
ssh -L 5432:localhost:5432 root@YOUR_SERVER_IP
```

Leave that terminal window open. Now, on your local laptop, your `localhost:5432` is securely connected to your Hetzner database through an encrypted tunnel! You can temporarily change your `.env.local` to point to it and run `npx drizzle-kit studio`. When you close the terminal, the connection disappears.

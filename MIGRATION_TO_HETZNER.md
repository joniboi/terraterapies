To run the migration from your local computer, you need to construct the **Public URL** yourself using your Hetzner Server's IP address and the credentials shown in that screen.

### 1. Identify your Credentials

From your screenshot, we have:

- **Username**: `postgres`
- **Password**: (Click the eye icon to copy it)
- **Database**: `postgres`
- **Hetzner IP**: `178.104.66.21` (from your earlier SSH command)
- **Public Port**: `5432`

### 2. Construct the Public URL

The URL for your local terminal to talk to Hetzner is:
`postgresql://postgres:Qyor0Tm5ZwUyjefgWl7iQgdidicyqAf91ZokkPbKo11JQWCYhevQhlXV703fI6J4@178.104.66.21:5432/postgres`

### 3. Open the "Gate" (Proxy)

In your Coolify screenshot, there is a setting:
**"Make it publicly available"**

1.  **Check that box** and click **Save**.
2.  Coolify will now allow traffic from the outside world into the database.

---

### ⚠️ IMPORTANT: Port Conflict Warning

In your screenshot, I see: `Ports Mappings: 3000:5432`.
**This is dangerous.** Port `3000` is usually what your **Next.js website** uses. If you map the database to port 3000, your website might not be able to start!

**Change "Ports Mappings" to `5432:5432`** (or leave it empty if you use the Proxy feature).

---

### 🚀 The "Data Pumping" Procedure

Follow these steps exactly to move your data to the live server:

1.  **Update Local `.env.local`**:
    Temporarily comment out your local URL and paste the Hetzner Public URL:

    ```env
    # DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/terraterapies_local"
    DATABASE_URL="postgresql://postgres:PASSWORD_FROM_COOLIFY@178.104.66.21:5432/postgres"
    ```

2.  **Push the Schema**:
    Run this to create the tables on the Hetzner server:

    ```bash
    npx drizzle-kit push
    ```

3.  **Run the Migration**:
    Run this to upload all your massages and prices to the Hetzner server:

    ```bash
    npx tsx scripts/migrate.ts
    ```

4.  **Verify**:
    If the script says "✅ Migration Finished", your data is now safe on the Hetzner hard drive!

5.  **CLEAN UP (Security)**:
    - **In Coolify**: Uncheck "Make it publicly available" and click Save. (This closes the door to hackers).
    - **In your code**: Change `.env.local` back to `localhost` so you don't accidentally delete production data while developing.

---

### Next Step: Next.js Configuration

Once the data is inside the database, we need to tell your Next.js app how to find it.

1.  Go to your **Terraterapies Application** in Coolify.
2.  Go to **Variables**.
3.  Add `DATABASE_URL`.
4.  **Value**: Use the **Internal Postgres URL** provided by Coolify (the one that uses the container name, not your IP).
    - _Example: `postgresql://postgres:pass@postgresql-database-lka...:5432/postgres`_

**Let me know when you have successfully run the migration script against the Hetzner IP!** If it times out, it means the Hetzner firewall or the Coolify Proxy is blocking the connection.

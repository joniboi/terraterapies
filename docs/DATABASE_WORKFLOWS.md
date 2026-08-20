# 🗄️ Database Workflows & Procedures

## 1. Local Development Setup

We use Docker Desktop to run a local PostgreSQL instance.

1. Create `.env.local` with: `DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/terraterapies_local"`
2. Start container: `docker compose up -d`
3. Push schema: `npx drizzle-kit push`
4. View data: `npx drizzle-kit studio`

## 2. Secure Production Migrations (No Open Ports!)

To prevent hackers and Hetzner abuse warnings, **Port 5432 is closed to the public internet in Coolify.** Do not run `drizzle-kit push` from your laptop pointing to the live server.

**The Secure Way to update Production Schema:**

1. Update `db/schema.ts` locally and push to GitHub.
2. Wait for Coolify to deploy the new build.
3. Open the **Coolify Dashboard** ➔ Terraterapies App ➔ **Terminal**.
4. Run: `npm run db:push` (This connects securely inside the internal Docker network).

## 3. Syncing Production Data to Local (For Testing)

If you need to copy the live database to your Windows machine to test UI changes with real data.

**Step A: Export from Hetzner**

```bash
# SSH into Hetzner, find the Postgres container ID (e.g., 584fa0fff28c)
docker exec -t <CONTAINER_ID> pg_dump "postgresql://postgres:postgres@localhost:5432/postgres" --clean --if-exists -O -x > /root/prod_dump.sql
```

**Step B: Download to Windows**

```bash
scp -i .\hetzner_key root@<HETZNER_IP>:/root/prod_dump.sql .\prod_dump.sql
```

**Step C: Import to Local Docker**

```bash
docker cp .\prod_dump.sql terraterapies_db_local:/prod_dump.sql
docker exec -it terraterapies_db_local psql -U dev_user -d terraterapies_local -f /prod_dump.sql
```

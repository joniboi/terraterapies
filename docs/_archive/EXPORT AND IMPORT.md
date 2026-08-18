Here is a comprehensive, step-by-step guide formatted as a Markdown file. You can save this directly into your project as **`DATABASE_SYNC.md`** so you always have it handy in the future.

---

### `DATABASE_SYNC.md`

````markdown
# 🔄 Production to Local Environment Sync Guide

This guide outlines the step-by-step procedure to sync production data (both PostgreSQL databases and uploaded media assets) from the Hetzner VPS into your local Windows 11 Docker development environment.

---

## 📋 Prerequisites & Configuration

Ensure your local `docker-compose.yml` is configured to run both containers on separate ports to avoid host conflicts:

```yaml
services:
  # Container 1: Terraterapies DB (Port 5432)
  terraterapies_db:
    image: postgres:16-alpine
    container_name: terraterapies_db_local
    restart: always
    environment:
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: terraterapies_local
    ports:
      - "5432:5432"
    volumes:
      - terraterapies_data:/var/lib/postgresql/data

  # Container 2: Lotus DB (Port 5433)
  lotus_db:
    image: postgres:16-alpine
    container_name: lotus_db_local
    restart: always
    environment:
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: lotus_local
    ports:
      - "5433:5432"
    volumes:
      - lotus_data:/var/lib/postgresql/data

volumes:
  terraterapies_data:
  lotus_data:
```
````

### Local Environment Variables

- **Terraterapies (`.env.local`)**: `DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/terraterapies_local"`
- **Lotus (`.env.lotus`)**: `DATABASE_URL="postgresql://dev_user:dev_password@localhost:5433/lotus_local"`

---

## 🗄️ Phase 1: Database Sync

### 🏎️ Option A: Sync Terraterapies

#### 1. Export from Production (On Hetzner SSH)

Create a secure database dump inside the Terraterapies database container:

```bash
# Verify container ID or name (current: 584fa0fff28c)
docker exec -t 584fa0fff28c pg_dump "postgresql://postgres:postgres@localhost:5432/postgres" --clean --if-exists -O -x > /root/terraterapies_prod.sql
```

#### 2. Download Dump to Windows (On Local Windows PowerShell)

Navigate to your project directory containing your SSH key and download the file:

```powershell
cd C:\Users\drizz\Documents\terraterapies-thai-bali
scp -i .\hetzner_terraterapies root@178.104.66.21:/root/terraterapies_prod.sql .\terraterapies_prod.sql
```

#### 3. Import into Local Docker (On Local Windows PowerShell)

Copy the file into the local container and execute the Postgres import:

```powershell
# Copy to container
docker cp .\terraterapies_prod.sql terraterapies_db_local:/terraterapies_prod.sql

# Execute SQL script
docker exec -it terraterapies_db_local psql -U dev_user -d terraterapies_local -f /terraterapies_prod.sql
```

---

### 🪷 Option B: Sync Lotus de Bali

#### 1. Export from Production (On Hetzner SSH)

Create a secure database dump inside the Lotus database container:

```bash
# Verify container ID or name (current: e3cdcdab2163)
docker exec -t e3cdcdab2163 pg_dump "postgresql://postgres:postgres@localhost:5432/postgres" --clean --if-exists -O -x > /root/lotus_prod.sql
```

#### 2. Download Dump to Windows (On Local Windows PowerShell)

Navigate to your project directory containing your SSH key and download the file:

```powershell
cd C:\Users\drizz\Documents\terraterapies-thai-bali
scp -i .\hetzner_terraterapies root@178.104.66.21:/root/lotus_prod.sql .\lotus_prod.sql
```

#### 3. Import into Local Docker (On Local Windows PowerShell)

Copy the file into the local container and execute the Postgres import:

```powershell
# Copy to container
docker cp .\lotus_prod.sql lotus_db_local:/lotus_prod.sql

# Execute SQL script
docker exec -it lotus_db_local psql -U dev_user -d lotus_local -f /lotus_prod.sql
```

---

## 🖼️ Phase 2: Media Uploads Sync

To prevent broken image links on your local development server, sync the media uploads directory from the Hetzner file system into your Next.js local static assets folder.

### 1. Ensure Local Folder Exists

Verify that you have created the directory on Windows:
`C:\Users\drizz\Documents\terraterapies-thai-bali\public\uploads`

### 2. Download Assets via SCP (On Local Windows PowerShell)

Ensure you are in your project folder containing your SSH key:

- **Download Terraterapies Uploads:**

  ```powershell
  scp -r -i .\hetzner_terraterapies root@178.104.66.21:/data/terraterapies/uploads/* .\public\uploads\
  ```

- **Download Lotus Uploads (If applicable):**
  ```powershell
  scp -r -i .\hetzner_terraterapies root@178.104.66.21:/data/lotus/uploads/* .\public\uploads\
  ```

---

## 🧹 Phase 3: Post-Sync Cleanup (Optional)

Once imports are verified, safely delete the temporary SQL dump files from both environments.

- **On Hetzner SSH:**
  ```bash
  rm /root/terraterapies_prod.sql /root/lotus_prod.sql 2>/dev/null
  ```
- **On Local Windows PowerShell:**
  ```powershell
  Remove-Item .\terraterapies_prod.sql, .\lotus_prod.sql -ErrorAction SilentlyContinue
  ```

---

## ⚠️ Troubleshooting

### Windows Path / Backslash Parsing Issue with `scp`

If you provide absolute Windows paths with backslashes (e.g. `C:\Users\...`), OpenSSH may strip the backslashes.

- **Fix:** `cd` directly into the target folder first, or use double quotes and forward slashes (e.g. `"C:/Users/..."`).

### Container Name Conflicts

If you rename or rebuild services and get a container name conflict error when running `docker compose up -d`:

- **Fix:** Manually force-remove the conflicting container from Docker memory:
  ```powershell
  docker rm -f <conflicting_container_name>
  ```

```

```

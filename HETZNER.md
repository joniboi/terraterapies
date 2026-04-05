This is a brilliant idea. Keeping a "Cheat Sheet" for your server is what separates a hobbyist from a professional.

Here is a structured **`MAINTENANCE.md`** file tailored exactly to your new Hetzner + Coolify + Terraterapies empire. You can save this in your GitHub repository so it’s always one click away.

---

# 🏰 Terraterapies Server Maintenance Guide

**Server IP:** `178.104.66.21`  
**OS:** Ubuntu 24.04 (ARM64)  
**Provider:** Hetzner Cloud (CAX11)

---

## 🔑 1. Accessing the Empire

### SSH Login (From your Windows PC)

Always use your specific private key to log in:

```powershell
ssh -i .\hetzner_terraterapies root@178.104.66.21
```

### Coolify Dashboard

Accessible via any browser:

- **URL:** `http://178.104.66.21:8000`
- **Backup Magic Domain:** `http://178.104.66.21.sslip.io:8000`

---

## 🛠️ 2. Coolify Engine Commands

### Repair / Reinstall Coolify

If the dashboard is down or throwing 500 errors, run this "Magic Reset" script. It repairs the `.env` and restarts all core containers:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

### Check Coolify Health

See if the core "brains" are running:

```bash
docker ps --filter "name=coolify"
```

---

## 🐳 3. Docker Essentials

### List Running Applications

See your Next.js app, Redis, and the Proxy:

```bash
docker ps
```

### View Live Application Logs

Replace `<container_id>` with the ID from `docker ps`:

```bash
docker logs -f <container_id>
```

### Emergency: Stop EVERYTHING

If the server is lagging or you need a clean slate:

```bash
docker stop $(docker ps -aq)
```

---

## 🚦 4. The "IPv6 Fix" (The Sunday Hero Patch)

If the **coolify-proxy** (Traefik) fails with a `ParseAddr` error, it means the network is broken. Use these commands to rebuild the "Front Door":

```bash
# 1. Stop all containers
docker stop $(docker ps -aq)

# 2. Delete the broken network
docker network rm coolify

# 3. Create a clean, IPv4-only bridge
docker network create coolify --driver bridge --subnet 172.18.0.0/16

# 4. Repair Coolify to wake it up
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

---

## 🚀 5. Next.js Production Commands

### The "Master" Start Command

This is the command used in the Coolify Configuration to make the app visible to the internet:

```bash
npx next start -H 0.0.0.0 -p 3000
```

### Local Standalone Test

To verify the build works on your computer exactly as it will on Hetzner:

```bash
npm run build
node .next/standalone/server.js
```

---

## 🛡️ 6. Security & Firewall (UFW)

Check if the Ubuntu firewall is active:

```bash
ufw status
```

Ensure the "Web Doors" are open:

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8000/tcp
ufw reload
```

---

## 💸 7. Housekeeping

### Check Disk Usage

Ensure the 40GB SSD isn't full of old Docker images:

```bash
df -h
```

### Clean up unused Docker junk

Run this once a month to free up space:

```bash
docker system prune -af
```

---

### **Final Pro-Tip for your Sunday:**

Now that the `install.sh` script is running to repair the dashboard, wait 2 minutes, then log back into `http://178.104.66.21:8000`.

1. Go to **Servers** -> **Localhost** -> **Proxy**.
2. Click **Start Proxy**.
3. Because you already fixed the network manually (`172.18.0.0/16`), **it will finally work.**

**I am standing by for the "It's working!" message.** You are minutes away from seeing that logo! 🏰✨🚀💰

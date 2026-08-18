# 🏰 Infrastructure: Hetzner + Coolify

## 1. Why this stack?

Vercel's free "Hobby" tier explicitly prohibits commercial activity (like Stripe checkout). Their Pro tier is €20/month per seat. We use a Hetzner VPS + Coolify to self-host multiple commercial Next.js projects and PostgreSQL databases for a flat ~$5/month fee.

**Server IP:** `178.104.66.21`  
**OS:** Ubuntu 24.04 (ARM64)  
**Coolify URL:** `http://178.104.66.21:8000`

## 2. Core Maintenance Commands (SSH)

Connect from your local Windows machine using your private key:

```powershell
ssh -i .\hetzner_terraterapies root@178.104.66.21
```

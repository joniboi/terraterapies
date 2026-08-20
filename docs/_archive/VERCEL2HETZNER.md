Using vercel for a local business website I've been told that they will make me change to a payment plan if they find out I'm using that website to make online payment with stripe. Is that true? Is the payment plan 20€ per month?

Short answer: yes, Vercel’s free “Hobby” plan does not allow commercial use (including taking payments with Stripe), and the paid “Pro” plan is around 20 €/month per developer, depending on FX. [costbench](https://costbench.com/software/developer-tools/vercel/)

## Can you use Stripe on the free plan?

Vercel’s fair‑use policy for the Hobby plan explicitly restricts it to **non‑commercial** personal projects. [vercel](https://vercel.com/docs/plans/hobby)
They define commercial use broadly as any deployment used for financial gain, which includes ecommerce, SaaS, or client work where you charge money. [reddit](https://www.reddit.com/r/nextjs/comments/12kbj4o/can_i_use_vercel_free_plan_for_my_startup_website/)
So a local business site that accepts online payments via Stripe is considered commercial, and Vercel expects you to be on Pro or Enterprise for that. [checkthat](https://checkthat.ai/brands/vercel/pricing)

## Will they “force” you to upgrade?

If they detect commercial use or you exceed free limits, Hobby projects can be paused and you’ll be prompted to upgrade to a paid plan. [vercel](https://vercel.com/docs/plans)
You won’t be silently billed on Hobby (there is no billing cycle), but you can lose availability until you upgrade or wait for limits to reset. [stackoverflow](https://stackoverflow.com/questions/78257939/vercel-usage-limits-when-does-it-reset-or-will-it-reset)

## What does the paid plan cost?

Vercel lists the Pro plan at 20 USD per user per month, which current pricing trackers also report as the standard commercial tier. [vercel](https://vercel.com/docs/plans/pro-plan)
In euros that typically lands close to 20 €/month per developer seat, depending on the exchange rate and whether you pay monthly or annually. [costbench](https://costbench.com/software/developer-tools/vercel/)
Pro includes 1 TB bandwidth, higher limits, and a 20 USD platform credit toward usage overages. [vercel](https://vercel.com/docs/plans/pro-plan)

## Practical takeaway

For a local business site that takes bookings or sells services with Stripe, Vercel’s own terms say you should be on at least Pro, not Hobby. [vercel](https://vercel.com/docs/plans/hobby)
If you want to stay 100 % within their policies and avoid surprise pauses, budget roughly 20 €/month or look at alternative hosts that permit small commercial projects on cheaper shared plans. [flexprice](https://flexprice.io/blog/vercel-pricing-breakdown)

Do you already have a specific traffic/usage expectation for this business site (rough monthly visitors), or is it still mostly unknown?

The guy who told me this recommended me to switch from vercel to Hetzner and install coolify. Do you know what is he talking about?

He’s suggesting you move from a managed platform (Vercel) to your own cheap VPS on Hetzner, and then use Coolify as a self‑hosted “mini‑Vercel/Heroku” to deploy your sites there. [coolify](https://coolify.io)

## What Coolify is

Coolify is an open‑source, self‑hosted PaaS that aims to be an alternative to Vercel, Netlify, Heroku, Railway, etc. [github](https://github.com/coollabsio/coolify)
You install it on a server (for example a Hetzner VPS), connect your GitHub/GitLab repo, and it gives you push‑to‑deploy, SSL, environment variables, databases, and one‑click apps in a web UI. [blog.logrocket](https://blog.logrocket.com/implement-coolify-self-hosted-alternative-heroku/)

## Why Hetzner is mentioned

Hetzner is a low‑cost cloud/VPS provider with very cheap servers in Europe and generous included traffic (often 20 TB/month on cloud instances). [fahimai](https://www.fahimai.com/hetzner)
A small Hetzner cloud server is typically around 4–6 €/month and is enough to run Coolify plus a few small apps for a local business. [reddit](https://www.reddit.com/r/n8n/comments/1jzpd5m/here_is_how_you_host_n8n_with_coolify_on_hetzner/)

## Why someone would recommend this combo

By self‑hosting on Hetzner with Coolify, you avoid Vercel’s “no commercial use on free tier” restriction and per‑seat Pro pricing. [vercel](https://vercel.com/docs/plans/hobby)
Instead, you pay a flat VPS cost and can host as many commercial sites as the server can handle, at the cost of taking responsibility for server updates, backups, and security. [coolify](https://coolify.io/docs/get-started/introduction)

## Trade‑offs vs staying on Vercel

Vercel: very simple DX, no server management, but commercial projects need a paid plan and you have usage‑based limits. [checkthat](https://checkthat.ai/brands/vercel/pricing)
Hetzner + Coolify: more control and often cheaper for multiple projects, but you (or someone on your team) must manage the VPS (SSH access, upgrades, firewall, monitoring). [reddit](https://www.reddit.com/r/selfhosted/comments/1razwiq/i_set_up_the_hetznercoolify_combo_but_i_started/)

Given your experience as a full‑stack dev, would you be comfortable handling basic VPS admin (updates, backups, firewall), or would you rather keep a fully managed platform even if it costs a bit more?

Is it hard to do this?manage the VPS (SSH access, upgrades, firewall, monitoring).

It’s not inherently hard, but it is “one more job” you have to own; with your background it’s very doable if you follow a checklist and accept some ongoing maintenance. [virtarix](https://virtarix.com/blog/how-hard-is-it-to-manage-a-vps/)

## What “managing a VPS” actually means

For a simple web app stack the core tasks are:

- SSH access: connect with an SSH key, avoid password logins, disable root login. [dchost](https://www.dchost.com/blog/en/first-24-hours-on-a-new-vps-updates-firewall-and-users-step-by-step/)
- Security baseline: keep the OS updated, enable automatic security updates, and use tools like Fail2ban to block brute‑force attempts. [youstable](https://www.youstable.com/blog/how-to-monitor-secure-vps-hosting-on-linux)
- Firewall: allow ports 22 (or a custom SSH port), 80, 443, deny everything else with UFW or similar. [dchost](https://www.dchost.com/blog/en/first-24-hours-on-a-new-vps-updates-firewall-and-users-step-by-step/)
- Monitoring: at least set up uptime checks and keep an eye on CPU, RAM, disk, and backups. [youstable](https://www.youstable.com/blog/how-to-monitor-secure-vps-hosting-on-linux)

## How hard is it in practice?

Guides aimed at non‑sysadmins describe VPS management as manageable if you’re comfortable with a terminal and can follow step‑by‑step instructions. [creativeon](https://creativeon.com/blog/vps-hosting/how-hard-to-manage-vps-beginners-guide/)
Most of the “hard” part is at the beginning (first 24–48 hours: updates, firewall, SSH hardening); after that you mostly apply updates weekly, review alerts/logs, and occasionally tweak configs. [g7cloud](https://g7cloud.com/knowledge-base/vps-dedicated-servers/first-48-hours-linux-vps-setup-checklist/)
Compared to shared hosting, a VPS needs more attention because the provider explicitly says you’re responsible for security and maintenance. [skynethosting](https://skynethosting.net/blog/what-is-linux-vps-hosting/)

## Where tools like Coolify help

Panels like Coolify hide a lot of Docker/app deployment complexity, but they do not remove your responsibility for OS updates, firewall, and backups. [reddit](https://www.reddit.com/r/VPS/comments/1ftq9ql/how_hard_is_it_to_run_and_maintain_a_vps_panel/)
They make deploying apps feel more like Vercel/Heroku, while you still need to treat the underlying VPS like any other Linux server. [blog.scalefusion](https://blog.scalefusion.com/what-is-linux-server-management/)

Given your level with Linux/terminal: have you already done basic SSH + package upgrades on a server (e.g. `apt update && apt upgrade` on Ubuntu), or would that be new territory for you?

What do I need to take into account that is automatically managed in vercel? Would that be a lot of work? make me a list. Wait, I'm going to share with you the blueprint of the website, so you will know all the external services I'm integrated with

For your blueprint (static‑heavy Next.js site + Stripe + Resend), moving from Vercel to Hetzner+Coolify mainly means you must take over all the “platform” concerns Vercel currently hides. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/128674672/d4573126-3f59-468c-ac50-ecacaede16eb/TERRATERAPIES_BLUEPRINT.md?AWSAccessKeyId=ASIA2F3EMEYEWXKDNFO7&Signature=BngDU%2FQZcnrymhGy%2FgjvoJtZRpM%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQC2TEVy3SoBqeoeJhx2NsJ5k2ycKwu8Imlaj7v71AMA7gIgQdaX%2BSaeyJNY%2BPUg%2B1M4VRXly%2FrF87jmziqPdUolrbsq8wQIZRABGgw2OTk3NTMzMDk3MDUiDK0NhsJ6gY3h1nUP9SrQBMt2KKa%2FuXtT%2FdDjZbcmpbjAjVTiIjArfsf7rm0Hn7ybRHLjUBQzQnCwDjMNv%2Fe9noddlcQSShOFjqTHPVYro20nLKDBpJq8XLlkm7Pn1wG55jZQmjmHFjDjx1eX9Zxi0AM%2B8ntmKXvpzJBp5fevpNancKetx7jKXZeZ4mw2EV0Ilj%2FlCPin1WR1VCJIVvSq0MwP9GcTY%2B1TqcH1pTvEtE%2BnX0%2BdSFLN3iOZZjeIXBksCou%2FtRSgFUEOKg4iSflIpl2ZwzH%2FE96nt1p3dp1QnZSEZ5zbhjt%2FTIjk%2BCqeIwGYf9eo1qJsphbzJxjS0vwU2brJQXapaojj1UtJ%2BiFJVX5iHakpWxf%2F9LD6gW0gcFfeppWcACylrENrUELQpNKArlJxlwzmS%2BF3m1407%2BINI8yDj09F6tJaA4rV0PO5cZy9fPx0xAX7V6RqyksmPH0Rg3l9h3dZOQT8oEdgqMrVIx380HgtqrzBGkA%2FGVp4PH60iSehDYiurJZ6G7wEtJyeVNIAXffyD%2FXyaWgMh%2BiHFLkMgpdIGj9NM742UPuNpup3SQWcqK0%2BbXZveStipqSjbpI3Kg%2Bm%2Bs8Lp6GN0cupmhzbLYJWEKEgjeuKjn2Vzm21BjC4sQRgsU%2BeGCBM8Ga4j4f5zekoG3twhD1DJvnCaJlnP86kZDFy0VSwoFhqLW5BTgiCrUfbpVjT8eWmziBLdqJAtPMJshGdhz9Uk9NDKtBpKsta2kOU9NWMKb5%2FfbN5TF34JaM6PvzXbOWUHGaTX%2FX13j61ct5UEp7NXX2i44AwgKb%2FzQY6mAGX%2Bqksak8VMeAna4Lpkt%2BFeuBlLdlrKZPTfITcqwKgGRtPInM%2BJ0vTeH%2FOmkp9J2gbeaxlYeW0NGrU6Qz8B5iRE4OsJojROc6OMuF8Vv%2BU%2BUFEbZtMi59k3qFesXCAFcl56fNWeF2tbtZExASlKeLisyrCaDfP3dmny26I1UKSM7WqkfVg6EgiBqLOcW5WfugEakzR3073Fg%3D%3D&Expires=1774181775)

## Things Vercel handles for you today

- **Build & deploy pipeline**
  - Pulls from GitHub, runs `next build`, deploys on push. [vercel](https://vercel.com/pricing)
  - Handles build logs, rollbacks, environment separation (preview vs production). [vercel](https://vercel.com/pricing)

- **Runtime & scaling**
  - Serves static pages via their global edge/CDN automatically. [checkthat](https://checkthat.ai/brands/vercel/pricing)
  - Runs your app/API routes in a managed serverless/edge environment, scales instances up/down, and restarts them on failure. [checkthat](https://checkthat.ai/brands/vercel/pricing)

- **HTTPS, domains, and DNS niceties**
  - Automatic HTTPS certificates (Let’s Encrypt) and renewal. [vercel](https://vercel.com/pricing)
  - Easy custom domain attachment, redirects, and basic DNS integration. [flexprice](https://flexprice.io/blog/vercel-pricing-breakdown)

- **Environment & secrets management**
  - Encrypted storage of `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, webhook secrets, etc. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/128674672/d4573126-3f59-468c-ac50-ecacaede16eb/TERRATERAPIES_BLUEPRINT.md?AWSAccessKeyId=ASIA2F3EMEYEWXKDNFO7&Signature=BngDU%2FQZcnrymhGy%2FgjvoJtZRpM%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQC2TEVy3SoBqeoeJhx2NsJ5k2ycKwu8Imlaj7v71AMA7gIgQdaX%2BSaeyJNY%2BPUg%2B1M4VRXly%2FrF87jmziqPdUolrbsq8wQIZRABGgw2OTk3NTMzMDk3MDUiDK0NhsJ6gY3h1nUP9SrQBMt2KKa%2FuXtT%2FdDjZbcmpbjAjVTiIjArfsf7rm0Hn7ybRHLjUBQzQnCwDjMNv%2Fe9noddlcQSShOFjqTHPVYro20nLKDBpJq8XLlkm7Pn1wG55jZQmjmHFjDjx1eX9Zxi0AM%2B8ntmKXvpzJBp5fevpNancKetx7jKXZeZ4mw2EV0Ilj%2FlCPin1WR1VCJIVvSq0MwP9GcTY%2B1TqcH1pTvEtE%2BnX0%2BdSFLN3iOZZjeIXBksCou%2FtRSgFUEOKg4iSflIpl2ZwzH%2FE96nt1p3dp1QnZSEZ5zbhjt%2FTIjk%2BCqeIwGYf9eo1qJsphbzJxjS0vwU2brJQXapaojj1UtJ%2BiFJVX5iHakpWxf%2F9LD6gW0gcFfeppWcACylrENrUELQpNKArlJxlwzmS%2BF3m1407%2BINI8yDj09F6tJaA4rV0PO5cZy9fPx0xAX7V6RqyksmPH0Rg3l9h3dZOQT8oEdgqMrVIx380HgtqrzBGkA%2FGVp4PH60iSehDYiurJZ6G7wEtJyeVNIAXffyD%2FXyaWgMh%2BiHFLkMgpdIGj9NM742UPuNpup3SQWcqK0%2BbXZveStipqSjbpI3Kg%2Bm%2Bs8Lp6GN0cupmhzbLYJWEKEgjeuKjn2Vzm21BjC4sQRgsU%2BeGCBM8Ga4j4f5zekoG3twhD1DJvnCaJlnP86kZDFy0VSwoFhqLW5BTgiCrUfbpVjT8eWmziBLdqJAtPMJshGdhz9Uk9NDKtBpKsta2kOU9NWMKb5%2FfbN5TF34JaM6PvzXbOWUHGaTX%2FX13j61ct5UEp7NXX2i44AwgKb%2FzQY6mAGX%2Bqksak8VMeAna4Lpkt%2BFeuBlLdlrKZPTfITcqwKgGRtPInM%2BJ0vTeH%2FOmkp9J2gbeaxlYeW0NGrU6Qz8B5iRE4OsJojROc6OMuF8Vv%2BU%2BUFEbZtMi59k3qFesXCAFcl56fNWeF2tbtZExASlKeLisyrCaDfP3dmny26I1UKSM7WqkfVg6EgiBqLOcW5WfugEakzR3073Fg%3D%3D&Expires=1774181775)
  - UI to manage environment variables per environment (dev/preview/prod). [vercel](https://vercel.com/pricing)

- **Basic observability / limits**
  - Request counts, bandwidth, build minutes, error logs in the dashboard. [flexprice](https://flexprice.io/blog/vercel-pricing-breakdown)
  - Automatic enforcement of limits, with usage graphs and alerts when you approach quotas. [checkthat](https://checkthat.ai/brands/vercel/pricing)

- **Platform security & OS maintenance**
  - Patching and securing the underlying OS, containers, and network. [blog.scalefusion](https://blog.scalefusion.com/what-is-linux-server-management/)
  - DDoS protection and general platform‑level hardening. [docs.hetzner](https://docs.hetzner.com/general/others/technical-and-organizational-measures)

## What you’d need to own on Hetzner + Coolify

- **Server provisioning & SSH access**
  - Create a Hetzner cloud VM, set up SSH keys, disable password/root logins. [hetzner](https://www.hetzner.com/cloud)
  - Keep a second way in (backup key or Hetzner console) in case you lock yourself out. [dchost](https://www.dchost.com/blog/en/first-24-hours-on-a-new-vps-updates-firewall-and-users-step-by-step/)

- **OS updates & security**
  - Regularly run security updates (e.g. `apt update && apt upgrade`) or configure unattended‑upgrades. [g7cloud](https://g7cloud.com/knowledge-base/vps-dedicated-servers/first-48-hours-linux-vps-setup-checklist/)
  - Possibly add Fail2ban or similar to protect SSH and common services. [youstable](https://www.youstable.com/blog/how-to-monitor-secure-vps-hosting-on-linux)

- **Firewall & network**
  - Configure UFW or `iptables` to allow only SSH, HTTP, HTTPS (and any extra ports you really need). [vpshosting](https://www.vpshosting.lk/blog/the-beginners-guide-to-using-firewalls-on-your-vps)
  - Keep an eye on open ports when you add new services (databases, dashboards, etc.). [youstable](https://www.youstable.com/blog/how-to-monitor-secure-vps-hosting-on-linux)

- **Install and maintain Coolify**
  - Install Docker, then deploy Coolify (usually via Docker Compose). [coolify](https://coolify.io)
  - Update Coolify itself when new versions or security fixes come out. [coolify](https://coolify.io/docs/get-started/introduction)

- **App deployment logic**
  - Configure Coolify to pull your Git repo and run the correct build commands for Next.js 15 (including static export vs SSR choice). [blog.logrocket](https://blog.logrocket.com/implement-coolify-self-hosted-alternative-heroku/)
  - Decide how to run API routes (`/api/stripe-checkout`, `/api/stripe-webhook`) as long‑lived containers instead of serverless functions. [coolify](https://coolify.io)

- **HTTPS & domains (via Coolify / reverse proxy)**
  - Point DNS for `terraterapies.com` to your Hetzner IP. [cloudy](https://cloudy.cc/hetzner/)
  - Use Coolify’s built‑in Traefik/Caddy/Nginx integration (or your own) to issue and renew Let’s Encrypt certs. [coolify](https://coolify.io/docs/knowledge-base/how-to/hetzner-loadbalancing)

- **Secrets management**
  - Put `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_URL` into Coolify’s environment settings. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/128674672/d4573126-3f59-468c-ac50-ecacaede16eb/TERRATERAPIES_BLUEPRINT.md?AWSAccessKeyId=ASIA2F3EMEYEWXKDNFO7&Signature=BngDU%2FQZcnrymhGy%2FgjvoJtZRpM%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQC2TEVy3SoBqeoeJhx2NsJ5k2ycKwu8Imlaj7v71AMA7gIgQdaX%2BSaeyJNY%2BPUg%2B1M4VRXly%2FrF87jmziqPdUolrbsq8wQIZRABGgw2OTk3NTMzMDk3MDUiDK0NhsJ6gY3h1nUP9SrQBMt2KKa%2FuXtT%2FdDjZbcmpbjAjVTiIjArfsf7rm0Hn7ybRHLjUBQzQnCwDjMNv%2Fe9noddlcQSShOFjqTHPVYro20nLKDBpJq8XLlkm7Pn1wG55jZQmjmHFjDjx1eX9Zxi0AM%2B8ntmKXvpzJBp5fevpNancKetx7jKXZeZ4mw2EV0Ilj%2FlCPin1WR1VCJIVvSq0MwP9GcTY%2B1TqcH1pTvEtE%2BnX0%2BdSFLN3iOZZjeIXBksCou%2FtRSgFUEOKg4iSflIpl2ZwzH%2FE96nt1p3dp1QnZSEZ5zbhjt%2FTIjk%2BCqeIwGYf9eo1qJsphbzJxjS0vwU2brJQXapaojj1UtJ%2BiFJVX5iHakpWxf%2F9LD6gW0gcFfeppWcACylrENrUELQpNKArlJxlwzmS%2BF3m1407%2BINI8yDj09F6tJaA4rV0PO5cZy9fPx0xAX7V6RqyksmPH0Rg3l9h3dZOQT8oEdgqMrVIx380HgtqrzBGkA%2FGVp4PH60iSehDYiurJZ6G7wEtJyeVNIAXffyD%2FXyaWgMh%2BiHFLkMgpdIGj9NM742UPuNpup3SQWcqK0%2BbXZveStipqSjbpI3Kg%2Bm%2Bs8Lp6GN0cupmhzbLYJWEKEgjeuKjn2Vzm21BjC4sQRgsU%2BeGCBM8Ga4j4f5zekoG3twhD1DJvnCaJlnP86kZDFy0VSwoFhqLW5BTgiCrUfbpVjT8eWmziBLdqJAtPMJshGdhz9Uk9NDKtBpKsta2kOU9NWMKb5%2FfbN5TF34JaM6PvzXbOWUHGaTX%2FX13j61ct5UEp7NXX2i44AwgKb%2FzQY6mAGX%2Bqksak8VMeAna4Lpkt%2BFeuBlLdlrKZPTfITcqwKgGRtPInM%2BJ0vTeH%2FOmkp9J2gbeaxlYeW0NGrU6Qz8B5iRE4OsJojROc6OMuF8Vv%2BU%2BUFEbZtMi59k3qFesXCAFcl56fNWeF2tbtZExASlKeLisyrCaDfP3dmny26I1UKSM7WqkfVg6EgiBqLOcW5WfugEakzR3073Fg%3D%3D&Expires=1774181775)
  - Back these up or document them carefully; there’s no Vercel “magic” here. [coolify](https://coolify.io)

- **Logging, monitoring, and backups**
  - Decide how you view logs (Coolify UI, `docker logs`, external log service). [youstable](https://www.youstable.com/blog/how-to-monitor-secure-vps-hosting-on-linux)
  - Set up uptime monitoring (e.g. UptimeRobot, Hetzner monitoring) for at least the main site and webhook endpoints. [wz-it](https://wz-it.com/en/blog/hetzner-server-maintenance-outsource-managed-services/)
  - Plan backups: VM snapshots, at least; if you add a database later, proper backups for that too. [wz-it](https://wz-it.com/en/blog/hetzner-server-maintenance-outsource-managed-services/)

- **Stripe & Resend reliability**
  - Ensure Stripe webhook endpoint (`/api/stripe-webhook`) is always reachable and protected by HTTPS. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/128674672/d4573126-3f59-468c-ac50-ecacaede16eb/TERRATERAPIES_BLUEPRINT.md?AWSAccessKeyId=ASIA2F3EMEYEWXKDNFO7&Signature=BngDU%2FQZcnrymhGy%2FgjvoJtZRpM%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQC2TEVy3SoBqeoeJhx2NsJ5k2ycKwu8Imlaj7v71AMA7gIgQdaX%2BSaeyJNY%2BPUg%2B1M4VRXly%2FrF87jmziqPdUolrbsq8wQIZRABGgw2OTk3NTMzMDk3MDUiDK0NhsJ6gY3h1nUP9SrQBMt2KKa%2FuXtT%2FdDjZbcmpbjAjVTiIjArfsf7rm0Hn7ybRHLjUBQzQnCwDjMNv%2Fe9noddlcQSShOFjqTHPVYro20nLKDBpJq8XLlkm7Pn1wG55jZQmjmHFjDjx1eX9Zxi0AM%2B8ntmKXvpzJBp5fevpNancKetx7jKXZeZ4mw2EV0Ilj%2FlCPin1WR1VCJIVvSq0MwP9GcTY%2B1TqcH1pTvEtE%2BnX0%2BdSFLN3iOZZjeIXBksCou%2FtRSgFUEOKg4iSflIpl2ZwzH%2FE96nt1p3dp1QnZSEZ5zbhjt%2FTIjk%2BCqeIwGYf9eo1qJsphbzJxjS0vwU2brJQXapaojj1UtJ%2BiFJVX5iHakpWxf%2F9LD6gW0gcFfeppWcACylrENrUELQpNKArlJxlwzmS%2BF3m1407%2BINI8yDj09F6tJaA4rV0PO5cZy9fPx0xAX7V6RqyksmPH0Rg3l9h3dZOQT8oEdgqMrVIx380HgtqrzBGkA%2FGVp4PH60iSehDYiurJZ6G7wEtJyeVNIAXffyD%2FXyaWgMh%2BiHFLkMgpdIGj9NM742UPuNpup3SQWcqK0%2BbXZveStipqSjbpI3Kg%2Bm%2Bs8Lp6GN0cupmhzbLYJWEKEgjeuKjn2Vzm21BjC4sQRgsU%2BeGCBM8Ga4j4f5zekoG3twhD1DJvnCaJlnP86kZDFy0VSwoFhqLW5BTgiCrUfbpVjT8eWmziBLdqJAtPMJshGdhz9Uk9NDKtBpKsta2kOU9NWMKb5%2FfbN5TF34JaM6PvzXbOWUHGaTX%2FX13j61ct5UEp7NXX2i44AwgKb%2FzQY6mAGX%2Bqksak8VMeAna4Lpkt%2BFeuBlLdlrKZPTfITcqwKgGRtPInM%2BJ0vTeH%2FOmkp9J2gbeaxlYeW0NGrU6Qz8B5iRE4OsJojROc6OMuF8Vv%2BU%2BUFEbZtMi59k3qFesXCAFcl56fNWeF2tbtZExASlKeLisyrCaDfP3dmny26I1UKSM7WqkfVg6EgiBqLOcW5WfugEakzR3073Fg%3D%3D&Expires=1774181775)
  - Monitor for failed webhook deliveries (Stripe dashboard) and email delivery problems (Resend dashboard), because there’s no platform‑level integration watching this for you. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/128674672/d4573126-3f59-468c-ac50-ecacaede16eb/TERRATERAPIES_BLUEPRINT.md?AWSAccessKeyId=ASIA2F3EMEYEWXKDNFO7&Signature=BngDU%2FQZcnrymhGy%2FgjvoJtZRpM%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQC2TEVy3SoBqeoeJhx2NsJ5k2ycKwu8Imlaj7v71AMA7gIgQdaX%2BSaeyJNY%2BPUg%2B1M4VRXly%2FrF87jmziqPdUolrbsq8wQIZRABGgw2OTk3NTMzMDk3MDUiDK0NhsJ6gY3h1nUP9SrQBMt2KKa%2FuXtT%2FdDjZbcmpbjAjVTiIjArfsf7rm0Hn7ybRHLjUBQzQnCwDjMNv%2Fe9noddlcQSShOFjqTHPVYro20nLKDBpJq8XLlkm7Pn1wG55jZQmjmHFjDjx1eX9Zxi0AM%2B8ntmKXvpzJBp5fevpNancKetx7jKXZeZ4mw2EV0Ilj%2FlCPin1WR1VCJIVvSq0MwP9GcTY%2B1TqcH1pTvEtE%2BnX0%2BdSFLN3iOZZjeIXBksCou%2FtRSgFUEOKg4iSflIpl2ZwzH%2FE96nt1p3dp1QnZSEZ5zbhjt%2FTIjk%2BCqeIwGYf9eo1qJsphbzJxjS0vwU2brJQXapaojj1UtJ%2BiFJVX5iHakpWxf%2F9LD6gW0gcFfeppWcACylrENrUELQpNKArlJxlwzmS%2BF3m1407%2BINI8yDj09F6tJaA4rV0PO5cZy9fPx0xAX7V6RqyksmPH0Rg3l9h3dZOQT8oEdgqMrVIx380HgtqrzBGkA%2FGVp4PH60iSehDYiurJZ6G7wEtJyeVNIAXffyD%2FXyaWgMh%2BiHFLkMgpdIGj9NM742UPuNpup3SQWcqK0%2BbXZveStipqSjbpI3Kg%2Bm%2Bs8Lp6GN0cupmhzbLYJWEKEgjeuKjn2Vzm21BjC4sQRgsU%2BeGCBM8Ga4j4f5zekoG3twhD1DJvnCaJlnP86kZDFy0VSwoFhqLW5BTgiCrUfbpVjT8eWmziBLdqJAtPMJshGdhz9Uk9NDKtBpKsta2kOU9NWMKb5%2FfbN5TF34JaM6PvzXbOWUHGaTX%2FX13j61ct5UEp7NXX2i44AwgKb%2FzQY6mAGX%2Bqksak8VMeAna4Lpkt%2BFeuBlLdlrKZPTfITcqwKgGRtPInM%2BJ0vTeH%2FOmkp9J2gbeaxlYeW0NGrU6Qz8B5iRE4OsJojROc6OMuF8Vv%2BU%2BUFEbZtMi59k3qFesXCAFcl56fNWeF2tbtZExASlKeLisyrCaDfP3dmny26I1UKSM7WqkfVg6EgiBqLOcW5WfugEakzR3073Fg%3D%3D&Expires=1774181775)

## Is that “a lot of work” for your specific project?

Given your blueprint is mostly SSG with a thin Stripe + Resend API layer, the **ongoing** workload is modest once the server is set up, but the **initial setup** is a solid weekend‑style task if you’re new to VPS admin. [virtarix](https://virtarix.com/blog/how-hard-is-it-to-manage-a-vps/)
You’ll trade Vercel’s simplicity and guardrails for: one‑time server hardening + a recurring habit of checking updates, logs, and simple monitoring dashboards. [creativeon](https://creativeon.com/blog/vps-hosting/how-hard-to-manage-vps-beginners-guide/)

If your goal is to keep ops overhead tiny for a single low‑traffic business site, would paying Vercel Pro ~20 €/month be acceptable, or do you explicitly want to minimize recurring cost even at the expense of some setup/maintenance time?

I don't want to pay 20€ / month, I don't mind spending a weekend with initial set up as long as later the maintenance is getting me only few hours/week

Your tradeoff (one intense setup weekend, then a few hours/week) is realistic with Hetzner + Coolify for this project, if you approach it with a clear checklist and some automation. [nextgrowth](https://nextgrowth.ai/what-is-coolify/)

## What your one‑time setup weekend would cover

- Provision server on Hetzner
  - Create a small cloud instance (e.g. ~3.5–5 €/month) in EU, attach SSH key, disable password/root SSH. [costgoat](https://costgoat.com/pricing/hetzner)
  - Set hostname, basic locale/timezone, and confirm SSH works from your machine. [dchost](https://www.dchost.com/blog/en/first-24-hours-on-a-new-vps-updates-firewall-and-users-step-by-step/)

- Harden the box
  - Enable firewall (UFW) with only SSH, HTTP, HTTPS open. [vpshosting](https://www.vpshosting.lk/blog/the-beginners-guide-to-using-firewalls-on-your-vps)
  - Install Fail2ban or similar to block brute‑force login attempts. [github](https://github.com/coollabsio/coolify/discussions/3043)

- Automate OS updates
  - Enable unattended security upgrades on Ubuntu (using `unattended-upgrades`), so you’re not manually patching daily. [interserver](https://www.interserver.net/tips/kb/configure-automatic-security-updates-in-ubuntu-24-04/)
  - Optionally configure email notifications if an update fails. [oneuptime](https://oneuptime.com/blog/post/2026-03-02-configure-unattended-upgrades-security-patches-ubuntu/view)

- Install and configure Coolify
  - Run the “Quick Installation” script (officially recommended) to set up Docker + Coolify in one shot. [coolify](https://coolify.io/docs/get-started/installation)
  - Secure Coolify itself: non‑default admin user, 2FA, HTTPS via its built‑in proxy/Let’s Encrypt. [massivegrid](https://www.massivegrid.com/blog/coolify-security-hardening/)

- Deploy your Terraterapies app
  - Connect Git repo, set build command and output type for your SSG Next.js 15 app. [coolify](https://coolify.io/docs/services/introduction)
  - Configure environment variables (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_URL`, etc.). [coolify](https://coolify.io)
  - Map `terraterapies.com` DNS to the server and request TLS certs via Coolify. [docs.digitalocean](https://docs.digitalocean.com/products/marketplace/catalog/coolify/index.html.md)

- Backups and basic monitoring
  - Enable snapshots / backups for the VPS (adds a small % on top of the instance price). [wz-it](https://wz-it.com/en/blog/hetzner-server-maintenance-outsource-managed-services/)
  - Configure Coolify or an external tool for scheduled backups of its data directory. [docs.digitalocean](https://docs.digitalocean.com/products/marketplace/catalog/coolify/index.html.md)
  - Add a simple uptime monitor (UptimeRobot, Hetzner monitoring) for the main site and Stripe webhook URL. [youstable](https://www.youstable.com/blog/how-to-monitor-secure-vps-hosting-on-linux)

## Typical ongoing maintenance load

With that setup, ongoing work is usually:

- 10–30 minutes/week checking:
  - OS & Coolify update status (Coolify even has “server patching” from its dashboard). [coolify](https://coolify.io/docs/knowledge-base/server/patching)
  - Disk usage, CPU spikes, and container “unhealthy” statuses if any. [nextgrowth](https://nextgrowth.ai/what-is-coolify/)
- Occasional tasks (some weeks none):
  - Click to update Coolify when a new version is out. [coolify](https://coolify.io/docs/knowledge-base/server/patching)
  - Review backup logs, adjust monitoring thresholds. [youstable](https://www.youstable.com/blog/how-to-monitor-secure-vps-hosting-on-linux)
  - Investigate rare issues like a container failing health checks. [nextgrowth](https://nextgrowth.ai/what-is-coolify/)

For a mostly static, low‑traffic marketing + gift‑card site like yours (no heavy background jobs, no DB yet), that should comfortably sit in the “few hours per month” range rather than constant babysitting. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/128674672/d4573126-3f59-468c-ac50-ecacaede16eb/TERRATERAPIES_BLUEPRINT.md)

Do you want a very concrete “step‑by‑step plan” for that weekend setup (Hetzner + Ubuntu + Coolify, tailored to Terraterapies), or are you first deciding between this path and any other low‑cost managed options?

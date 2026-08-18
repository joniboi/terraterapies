# Commands to debug Stripe workflow

stripe login

stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy to .env.local the whsec

STRIPE*WEBHOOK_SECRET=whsec*

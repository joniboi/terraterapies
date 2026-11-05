FROM node:22.14.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 1. Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 2. Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# Arguments needed during build
ARG NEXT_PUBLIC_BRAND=terra
ARG DATABASE_URL
ENV NEXT_PUBLIC_BRAND=$NEXT_PUBLIC_BRAND
ENV DATABASE_URL=$DATABASE_URL

# Run the build
RUN pnpm run build

# 3. Production runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ARG NEXT_PUBLIC_BRAND=terra
ENV NEXT_PUBLIC_BRAND=$NEXT_PUBLIC_BRAND

# Copy public folder (if it exists)
COPY --from=builder /app/public ./public

# Dynamically copy from .next-terra or .next-lotus depending on the brand
COPY --from=builder /app/.next-${NEXT_PUBLIC_BRAND}/standalone ./
COPY --from=builder /app/.next-${NEXT_PUBLIC_BRAND}/static ./.next-${NEXT_PUBLIC_BRAND}/static

EXPOSE 3000
CMD ["node", "server.js"]
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++ sqlite
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Ensure public directory exists
RUN mkdir -p /app/public
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install sqlite for better-sqlite3
RUN apk add --no-cache sqlite libc6-compat

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
# Create public directory first, then copy if it exists
RUN mkdir -p /app/public
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy standalone build files (this includes server.js and all dependencies)
# The standalone folder already contains everything needed, including static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static files - standalone build expects them at .next/static relative to server.js
# Since server.js is in .next/standalone/, static files should be in .next/standalone/.next/static
# But Next.js standalone already includes them, so we copy to the root .next/static as fallback
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy node_modules for better-sqlite3 (native module) - only production deps
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy scripts for user management
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

# Create directories for data persistence
RUN mkdir -p /app/data /app/public/uploads && \
    chown -R nextjs:nodejs /app/data /app/public/uploads

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", ".next/standalone/server.js"]


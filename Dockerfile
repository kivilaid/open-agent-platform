# Multi-stage Dockerfile for Open Agent Platform

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable Corepack for Yarn 3
RUN corepack enable

# Copy package files
COPY package.json yarn.lock ./
COPY .yarnrc.yml ./
COPY apps/web/package.json ./apps/web/
COPY turbo.json ./

# Install dependencies
RUN yarn install --immutable --immutable-cache || yarn install

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Enable Corepack for Yarn 3
RUN corepack enable

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# Copy source code
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_BASE_API_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_DEPLOYMENTS
ARG NEXT_PUBLIC_GOOGLE_AUTH_DISABLED
ARG NEXT_PUBLIC_USE_LANGSMITH_AUTH
ARG NEXT_PUBLIC_RAG_API_URL
ARG NEXT_PUBLIC_MCP_SERVER_URL
ARG NEXT_PUBLIC_MCP_AUTH_REQUIRED

# Build the application
RUN yarn build --filter=@open-agent-platform/web

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Add non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy necessary files
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# Set permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start the application
CMD ["node", "apps/web/server.js"]
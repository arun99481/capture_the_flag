# Use Ubuntu as base
FROM ubuntu:22.04 AS base

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y curl gnupg build-essential && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest

# Verify
RUN node -v
RUN npm -v

# Prune the workspace for the api app
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Install turbo
RUN npm install -g turbo
COPY . .
# Prune the workspace for the api app
RUN turbo prune --scope=api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
# RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Generate Prisma Client
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

RUN npx turbo run build --filter=api...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN groupadd -g 1001 -r nodejs
RUN useradd -u 1001 -r -g nodejs -s /bin/sh nestjs
USER nestjs

COPY --from=installer /app .

CMD ["node", "apps/api/dist/main.js"]

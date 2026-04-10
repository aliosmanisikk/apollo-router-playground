# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies
RUN npm install --frozen-lockfile || yarn install --frozen-lockfile || npm install

# Copy source files
COPY tsconfig.json ./
COPY src ./src

# Build (compile TypeScript if needed)
RUN npm run build 2>/dev/null || true

# Runtime stage
FROM node:24-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src ./src

# Install ts-node globally for runtime
RUN npm install -g ts-node @types/node

# Default to running subgraphs
CMD ["ts-node", "./src/index.ts"]

# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Build the project (client and server)
RUN npm run build

# Stage 2: Runtime
FROM node:20-slim

WORKDIR /app

# Copy package files for production
COPY package*.json ./
RUN npm install --omit=dev

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared
# We need tsx or similar to run if the entry point is still TS, 
# but the build script produces dist/index.cjs which is pure JS.

# Create .local directory for SQLite
RUN mkdir -p .local

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD npx drizzle-kit push && node dist/index.cjs

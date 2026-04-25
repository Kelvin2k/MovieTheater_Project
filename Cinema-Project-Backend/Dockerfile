# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/node_app

# Copy package configuration
COPY package.json yarn.lock ./

# Install ALL dependencies (including devDependencies for building)
RUN yarn install --frozen-lockfile

# Copy all source code
COPY . .

# Generate Prisma Client (no need for db pull, just generate from current schema.prisma)
RUN yarn prisma generate

# Build TypeScript code to dist directory
RUN yarn build

# Runtime stage
FROM node:20-alpine

WORKDIR /usr/node_app

ENV NODE_ENV=production

COPY package.json yarn.lock ./

# Install only production dependencies to reduce image size
RUN yarn install --frozen-lockfile --production

# Copy built code and database schema from builder stage
COPY --from=builder /usr/node_app/dist ./dist
COPY --from=builder /usr/node_app/prisma ./prisma

EXPOSE 8080

# Run the app (replace main.js with your entry point if different)
CMD ["node", "dist/src/main.js"]



# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies
RUN npm install
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build the application and show output for debugging
RUN npm run build
RUN ls -R dist

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy only the necessary files for production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Start the application using node directly to be more explicit
# We use the shell form to allow flexible path if needed, but dist/main should be standard
CMD ["node", "dist/main.js"]
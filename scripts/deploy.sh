#!/bin/bash
set -e

echo "🚀 Starting deployment script..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma Client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Deployment script completed successfully!"

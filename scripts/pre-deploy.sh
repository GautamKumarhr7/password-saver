#!/bin/bash
set -e

echo "🚀 Running pre-deployment checks..."

# Check if all required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set"
    exit 1
fi

echo "✅ Environment variables check passed"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Seed database if needed (optional)
# echo "🌱 Seeding database..."
# npx prisma db seed

echo "✅ Pre-deployment checks completed successfully!"

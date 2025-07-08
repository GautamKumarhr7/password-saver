#!/bin/bash
set -e

echo "🚀 Starting deployment script..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set!"
    exit 1
fi

echo "✅ DATABASE_URL is set"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma Client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Wait for database to be ready (give it some time)
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations with retry logic
echo "🗄️ Running database migrations..."
MAX_RETRIES=5
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if npx prisma migrate deploy; then
        echo "✅ Database migrations completed successfully!"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo "⚠️ Migration attempt $RETRY_COUNT failed, retrying in 10 seconds..."
        if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
            echo "❌ Failed to run migrations after $MAX_RETRIES attempts"
            exit 1
        fi
        sleep 10
    fi
done

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Deployment script completed successfully!"

#!/bin/bash
set -e

echo "Starting deployment script..."

# Generate Prisma Client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

echo "Deployment script completed successfully!"

#!/bin/bash
set -e

echo "🗄️ Setting up database..."

# For production deployment, just run migrations
if [ "$NODE_ENV" = "production" ]; then
    echo "🚀 Running production migrations..."
    npx prisma migrate deploy
else
    echo "🛠️ Running development setup..."
    # Create the database locally if needed
    psql -U postgres -c "CREATE DATABASE password_saver;" 2>/dev/null || echo "Database might already exist"
    
    # Run Prisma migrations
    npx prisma migrate dev --name init 
fi

echo "✅ Database setup completed!" 
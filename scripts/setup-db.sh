#!/bin/bash
# This script sets up a local PostgreSQL database for development

echo "🗄️  Setting up local PostgreSQL database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first:"
    echo "   macOS: brew install postgresql"
    echo "   Linux: sudo apt-get install postgresql"
    echo "   Windows: Download from https://www.postgresql.org/download/windows/"
    exit 1
fi

echo "✅ PostgreSQL found: $(psql --version)"
echo ""

# Check if PostgreSQL service is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "⚠️  PostgreSQL service is not running"
    echo "   macOS: brew services start postgresql"
    echo "   Linux: sudo systemctl start postgresql"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Database name and user
DB_NAME="property_marketplace"
DB_USER="postgres"
DB_PORT="5432"

echo "Creating database: $DB_NAME"

# Create database
psql -U $DB_USER -h localhost -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "ℹ️  Database might already exist"

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📝 Update your .env.local with:"
echo "   DATABASE_URL=\"postgresql://$DB_USER:your_password@localhost:$DB_PORT/$DB_NAME?schema=public\""
echo ""
echo "🚀 To run migrations:"
echo "   npm run db:push"
echo "   npm run db:seed (optional)"

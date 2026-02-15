#!/bin/bash

# Quick Start Guide for Property Management Marketplace
# This script provides interactive setup for the project

echo "🚀 Property Management Marketplace - Quick Setup"
echo "==============================================="
echo ""

# 1. Check Node
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    echo "   ✅ Node $(node -v) installed"
else
    echo "   ❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo ""

# 2. Install dependencies
echo "2️⃣  Installing dependencies..."
npm install --legacy-peer-deps
echo "   ✅ Dependencies installed"

echo ""

# 3. Database setup
echo "3️⃣  PostgreSQL Setup"
echo "   Before continuing, ensure PostgreSQL is running:"
echo ""
echo "   macOS:"
echo "   $ brew install postgresql@15"
echo "   $ brew services start postgresql@15"
echo ""
echo "   Linux (Ubuntu/Debian):"
echo "   $ sudo apt-get install postgresql"
echo "   $ sudo systemctl start postgresql"
echo ""
echo "   Windows:"
echo "   Download from: https://www.postgresql.org/download/windows/"
echo ""
read -p "   Press Enter when PostgreSQL is ready..."

# 4. Create database
echo ""
echo "4️⃣  Creating database..."
psql -U postgres -c "DROP DATABASE IF EXISTS property_marketplace;" 2>/dev/null
psql -U postgres -c "CREATE DATABASE property_marketplace;" 2>/dev/null
echo "   ✅ Database created"

echo ""

# 5. Environment setup
echo "5️⃣  Setting up environment..."
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo "   ✅ .env.local created"
    echo ""
    echo "   📝 Please edit .env.local and add:"
    echo "      - DATABASE_URL with your PostgreSQL password"
    echo "      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    echo "      - CLERK_SECRET_KEY"
    echo ""
    read -p "   Press Enter when .env.local is updated..."
else
    echo "   ✅ .env.local exists"
fi

echo ""

# 6. Setup database schema
echo "6️⃣  Setting up database schema..."
npm run db:push
echo "   ✅ Schema synced"

echo ""

# 7. Optional seed
read -p "7️⃣  Seed database with demo data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:seed
    echo "   ✅ Database seeded with demo data"
else
    echo "   ⏭️  Skipping seed"
fi

echo ""
echo "==============================================="
echo "✅ Setup Complete!"
echo ""
echo "📖 Next Steps:"
echo "   1. npm run dev              # Start development server"
echo "   2. npm run db:studio        # Explore database (optional)"
echo ""
echo "📚 Documentation:"
echo "   - DATABASE_SETUP.md         # Detailed database guide"
echo "   - API_DOCUMENTATION.md      # API reference"
echo "   - PRISMA_SETUP_COMPLETE.md  # Prisma integration details"
echo ""
echo "🚀 Visit http://localhost:3000"
echo ""

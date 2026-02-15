#!/bin/bash
# Quick Setup Script for Next.js Property Management Marketplace

echo "🚀 Setting up Property Management Marketplace (Next.js)..."

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "⚠️  Please edit .env.local with your credentials:"
    echo "   - Clerk: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY"
    echo "   - Supabase: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Edit .env.local with your Clerk and Supabase credentials"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:3000"
echo ""
echo "📖 For detailed info, see NEXTJS_MIGRATION.md"

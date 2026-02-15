
  # Property Management Marketplace UI

A modern, full-featured property management marketplace UI built with **Next.js 15**, **Clerk Authentication**, **Prisma ORM**, **PostgreSQL**, and **Shadcn UI**.

> **⚠️ Migration Notice**: This project has been updated to use Prisma + PostgreSQL instead of Supabase. See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database setup instructions.

## Features

- ✅ Modern Next.js App Router
- ✅ Clerk Authentication (Sign In, Sign Up, Email Verification)
- ✅ Role-Based Access Control (Tenant/Landlord)
- ✅ Protected Dashboard Routes
- ✅ **Prisma ORM** for type-safe database queries
- ✅ **PostgreSQL** local database support
- ✅ RESTful API Routes
- ✅ Responsive Design (Mobile & Desktop)
- ✅ TypeScript
- ✅ Tailwind CSS + Shadcn UI
- ✅ Dark Mode Support
- ✅ Database migrations & seeding

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI)
- **Authentication**: Clerk
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **CLI Tools**: Prisma Studio, Prisma Migrate

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup PostgreSQL Database

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

**Create the database:**
```bash
# Automatic (macOS/Linux)
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh

# Manual
psql -U postgres
CREATE DATABASE property_marketplace;
\q
```

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# PostgreSQL Database URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/property_marketplace?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
```

### 4. Setup Database Schema

```bash
npm run db:push
```

### 5. (Optional) Seed Demo Data

```bash
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (Prisma queries)
│   ├── dashboard/         # Protected dashboard pages
│   ├── sign-in/sign-up/   # Clerk auth pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── pages/            # Page-level components
│   └── ui/               # Shadcn UI components
├── lib/                  # Utilities
│   ├── prisma.ts        # Prisma client
│   ├── supabaseClient.ts # (deprecated)
│   └── utils.ts         # Helper functions
└── styles/              # Global styles

prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Seed script

scripts/
├── setup-db.sh          # Database setup (macOS/Linux)
└── setup-db.bat         # Database setup (Windows)
```

## Database Schema

The project includes comprehensive Prisma models:

- **User**: Tenants and landlords with Clerk integration
- **Property**: Listings with amenities, images, and details
- **Message**: Direct messaging between users
- **Review**: Ratings and comments on properties
- **Favorite**: User's property wishlist
- **Inquiry**: Tenant inquiries about properties

See [prisma/schema.prisma](./prisma/schema.prisma) for complete schema.

## Database Commands

```bash
npm run db:push              # Sync schema (no migrations)
npm run db:migrate           # Create and run migration
npm run db:migrate:deploy    # Deploy migrations (production)
npm run db:studio            # Open Prisma Studio GUI
npm run db:seed              # Run seed script
npm run db:reset             # Reset database
```

## API Endpoints

The project includes ready-to-use API routes:

### Properties
- `GET /api/properties` - List all properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (landlords only)
- `PATCH /api/properties/:id` - Update property (owner only)
- `DELETE /api/properties/:id` - Delete property (owner only)

### Users
- `GET /api/users/me` - Get current user profile
- `POST /api/users` - Create/sync user

### Messages
- `GET /api/messages` - Get user's messages
- `POST /api/messages` - Send message

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API documentation.

## Build & Deploy

### Build for Production
```bash
npm run build
npm start
```

### Vercel Deployment
```bash
vercel
```

Set `DATABASE_URL` environment variable in Vercel dashboard.

## Scripts

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run linting
npm run db:push          # Sync database schema
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database
```

## Documentation

- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Detailed database setup guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API endpoint reference
- [NEXTJS_MIGRATION.md](./NEXTJS_MIGRATION.md) - Vite to Next.js migration notes
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Complete migration checklist

## Troubleshooting

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Start PostgreSQL service
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### Database Reset
If you need a fresh start:
```bash
npm run db:reset
npm run db:seed
```

### Prisma Studio Not Found
```bash
npm run db:studio
```

Opens interactive GUI at http://localhost:5555

## Key Technologies

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| Prisma | Type-safe ORM |
| PostgreSQL | Database |
| Clerk | Authentication |
| Tailwind CSS | Styling |
| Shadcn UI | Component library |
| TypeScript | Type safety |

## Migration from Supabase

This project was migrated from Supabase to local PostgreSQL + Prisma:

**Changes:**
- ✅ Replaced Supabase SDK with Prisma Client
- ✅ Created comprehensive Prisma schema
- ✅ Added database seed script
- ✅ Implemented API routes with Prisma queries
- ✅ Type-safe database operations
- ✅ Full control over database

**Benefits:**
- Better type safety with Prisma
- Local development without external services
- Easier migrations and schema versioning
- Better performance with direct ORM access

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)

---

**Original Design**: [Figma](https://www.figma.com/design/SxbV1QxEJHUKKDcIaneYpA/Property-Management-Marketplace-UI)

## Features

- ✅ Modern Next.js App Router
- ✅ Clerk Authentication (Sign In, Sign Up, Email Verification)
- ✅ Role-Based Access Control (Tenant/Landlord)
- ✅ Protected Dashboard Routes
- ✅ Responsive Design (Mobile & Desktop)
- ✅ Supabase Integration Ready
- ✅ TypeScript
- ✅ Tailwind CSS + Shadcn UI
- ✅ Dark Mode Support

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI)
- **Authentication**: Clerk
- **Backend**: Supabase
- **Icons**: Lucide React
- **Forms**: React Hook Form

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Clerk account
- Supabase account

### Installation

1. **Clone/Extract the project**
```bash
cd "Property Management Marketplace UI"
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your credentials
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

4. **Run development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (future)
│   ├── dashboard/         # Protected dashboard pages
│   ├── sign-in/           # Authentication pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── pages/            # Page-level components
│   └── ui/               # Shadcn UI components
├── lib/                  # Utilities
│   ├── supabaseClient.ts # Supabase setup
│   ├── data.ts          # Mock data
│   └── utils.ts         # Helper functions
└── styles/              # Global styles
```

## Pages & Routes

### Public Pages
- `/` - Landing page
- `/search` - Property search
- `/property?id=<id>` - Property details
- `/sign-in` - Sign in
- `/sign-up` - Sign up
- `/verify-email` - Email verification

### Protected Pages (Landlords Only)
- `/dashboard` - Overview
- `/dashboard/overview` - Dashboard overview
- `/dashboard/properties` - My properties
- `/dashboard/add-property` - Add new property
- `/dashboard/messages` - Messages
- `/dashboard/settings` - Settings

## Available Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Production server
npm start

# Linting
npm run lint
```

## Authentication

### Clerk Setup
1. Create account at [clerk.com](https://clerk.com)
2. Create new application
3. Copy publishable and secret keys to `.env.local`
4. Configure sign-in/sign-up URLs in Clerk dashboard

### User Roles
- **Tenant**: Can browse, search, and view properties
- **Landlord**: Has access to dashboard and property management

## Styling

The project uses:
- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theming and dark mode
- **Shadcn UI** for pre-built components

To customize colors, edit `tailwind.config.ts`.

## Database (Supabase)

### Setup
1. Create Supabase project
2. Create required tables
3. Set up authentication policies
4. Copy credentials to `.env.local`

### Example Tables to Create
```sql
-- properties
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  price DECIMAL NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Component Library

All Shadcn UI components are available in `src/components/ui/`:
- Button, Card, Input, Select, Textarea
- Dialog, Dropdown, Menu, Sidebar
- Form, Badge, Avatar, Tooltip
- And many more...

## Development

### Add New Pages
Create files in `src/app/` following Next.js conventions:
```typescript
// src/app/example/page.tsx
export default function Example() {
  return <div>Example Page</div>;
}
```

### Add API Routes
Create files in `src/app/api/`:
```typescript
// src/app/api/properties/route.ts
export async function GET(request: Request) {
  return Response.json({ properties: [] });
}
```

### Use Supabase
```typescript
import { supabase } from '@/lib/supabaseClient';

const { data, error } = await supabase
  .from('properties')
  .select('*');
```

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel
```

### Other Platforms
Works with Netlify, AWS Amplify, Railway, Render, etc.

## Troubleshooting

### Clerk Not Loading?
- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env.local`
- Check Clerk dashboard for allowed URLs

### Supabase Connection Issues?
- Verify URL and key in `.env.local`
- Check Supabase project status
- Verify Row Level Security (RLS) policies

### Build Errors?
- Delete `.next/` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)

---

**Original Design**: [Figma](https://www.figma.com/design/SxbV1QxEJHUKKDcIaneYpA/Property-Management-Marketplace-UI)
  
# Database Setup Guide: Prisma + PostgreSQL

This project now uses **Prisma ORM** with **PostgreSQL** for the database layer. This guide will help you set up a local PostgreSQL instance and configure the project.

## Prerequisites

- Node.js 18+ (already installed)
- PostgreSQL 12+ (needs to be installed)

## Step 1: Install PostgreSQL

### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Windows
Download and install from https://www.postgresql.org/download/windows/

## Step 2: Create the Database

### Option A: Automatic Setup (macOS/Linux)
```bash
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh
```

### Option B: Manual Setup
Open PostgreSQL CLI:
```bash
psql -U postgres
```

Create the database:
```sql
CREATE DATABASE property_marketplace;
\q
```

## Step 3: Configure Environment Variables

Copy the template and update with your local PostgreSQL credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# Default PostgreSQL setup
DATABASE_URL="postgresql://postgres:password@localhost:5432/property_marketplace?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
```

**Note**: Replace `password` with your PostgreSQL password

## Step 4: Run Database Migrations

Initialize the database with the Prisma schema:

```bash
npm run db:push
```

This command will:
- Create all tables based on the Prisma schema
- Set up indexes and relationships
- Configure primary keys and constraints

## Step 5: Seed the Database (Optional)

Populate the database with demo data:

```bash
npm run db:seed
```

This will create:
- Demo landlord and tenant users
- Sample properties with images
- Messages between users
- Property inquiries

## Available Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:push` | Sync schema with database (no migration file) |
| `npm run db:migrate` | Create and run a migration interactively |
| `npm run db:migrate:deploy` | Run pending migrations (production) |
| `npm run db:studio` | Open Prisma Studio GUI (http://localhost:5555) |
| `npm run db:seed` | Run the seed script |
| `npm run db:reset` | Reset database and rerun migrations |

## Using Prisma Studio

View and edit your database with a visual interface:

```bash
npm run db:studio
```

Open your browser to http://localhost:5555

## Database Schema

### Users
- Stores tenant and landlord accounts
- Linked with Clerk authentication
- Tracks role, contact info, and avatar

### Properties
- Listed by landlords
- Contains location, details, amenities, images
- Status: ACTIVE, INACTIVE, RENTED, PENDING

### Messages
- Direct messages between users
- Tracks read status
- Links sender and receiver

### Reviews
- Ratings and comments on properties
- 1-5 star system

### Favorites
- User's wishlist of properties
- Unique constraint per user-property pair

### Inquiries
- Property inquiries from tenants
- Status tracking: PENDING, CONTACTED, ACCEPTED, REJECTED

## Troubleshooting

### "Error: connect ECONNREFUSED"
PostgreSQL is not running:
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### "Password authentication failed"
Check your `DATABASE_URL` in `.env.local`:
- Username defaults to `postgres`
- Update password to match your PostgreSQL setup
- Ensure database exists

### Reset Everything
If you need a fresh start:
```bash
npm run db:reset
npm run db:seed
```

This will:
1. Drop all tables
2. Re-run all migrations
3. Seed with demo data

## Common Tasks

### Add a New Model

1. Edit `prisma/schema.prisma`
2. Add your model:
```prisma
model Product {
  id    Int     @id @default(autoincrement())
  name  String
  price Decimal
}
```

3. Run migration:
```bash
npm run db:migrate
```

Name your migration (e.g., "add_product_model")

### Query Data in Code

```typescript
import { prisma } from "@/lib/prisma";

// Get all properties
const properties = await prisma.property.findMany();

// Get properties by owner
const myProperties = await prisma.property.findMany({
  where: { ownerId: userId },
});

// Create a new property
const property = await prisma.property.create({
  data: {
    title: "New Place",
    price: 2000,
    // ... other fields
    ownerId: userId,
  },
});
```

### API Routes Example

Create `src/app/api/properties/route.ts`:

```typescript
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const properties = await prisma.property.findMany();
  return Response.json(properties);
}

export async function POST(request: Request) {
  const data = await request.json();
  const property = await prisma.property.create({ data });
  return Response.json(property, { status: 201 });
}
```

## Production Deployment

### Environment Variables
Set `DATABASE_URL` on your hosting platform:
- Vercel: Project Settings → Environment Variables
- AWS: AWS RDS PostgreSQL endpoint
- Railway/Render: Automatic DATABASE_URL setup

### Run Migrations
Before deploying:
```bash
npm run db:migrate:deploy
```

Or on your hosting platform's deployment command:
```bash
npm run build
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-api)

## Migration from Supabase

This project has been updated from Supabase to local PostgreSQL with Prisma:

**Removed:**
- ❌ Supabase client
- ❌ Supabase environment variables
- ❌ Remote database dependency

**Added:**
- ✅ Prisma ORM
- ✅ Local PostgreSQL support
- ✅ Type-safe database queries
- ✅ Automated migrations
- ✅ Seed scripts
- ✅ Prisma Studio GUI

---

**Enjoy your new database setup!** 🚀

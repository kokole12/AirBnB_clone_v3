# Property Management Marketplace UI - Next.js Version

This is a complete rewrite of the Property Management Marketplace UI using Next.js 15, replacing the previous Vite+React setup.

## Changes from Vite to Next.js

### Key Improvements:
- **Routing**: Next.js App Router (file-based routing) instead of manual routing logic
- **Authentication**: Clerk integration with Next.js middleware for protected routes
- **Server Components**: Leverages Next.js React Server Components (RSC)
- **Performance**: Built-in optimizations like code-splitting and image optimization
- **API Routes**: Ready for serverless functions in `/app/api`
- **Environment Variables**: Proper Next.js environment setup with `.env.local`

### Project Structure:

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Clerk provider
│   ├── page.tsx                 # Home page
│   ├── search/
│   │   └── page.tsx            # Search properties
│   ├── property/
│   │   └── page.tsx            # Property details
│   ├── sign-in/[[...sign-in]]/
│   │   └── page.tsx            # Clerk sign-in page
│   ├── sign-up/[[...sign-up]]/
│   │   └── page.tsx            # Clerk sign-up page
│   ├── verify-email/
│   │   └── page.tsx            # Email verification
│   └── dashboard/               # Protected dashboard routes
│       ├── page.tsx
│       ├── overview/
│       ├── properties/
│       ├── add-property/
│       ├── messages/
│       └── settings/
├── components/                  # React components
│   ├── layout/                 # Layout components
│   ├── pages/                  # Page components
│   └── ui/                     # Shadcn UI components
├── lib/                         # Utilities and config
│   ├── supabaseClient.ts       # Supabase client
│   ├── utils.ts                # Helper functions
│   └── data.ts                 # Mock data
└── styles/                      # Global styles

middleware.ts                     # Clerk authentication middleware
next.config.js                   # Next.js configuration
tailwind.config.ts              # Tailwind CSS configuration
tsconfig.json                   # TypeScript configuration
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Authentication Flow

The app uses Clerk for authentication with the following flow:

1. **Public Pages**: Landing, Search, Property Details (available to all users)
2. **Protected Routes**: Dashboard pages require authentication
3. **Role-Based Access**: Clerk user metadata stores user role (tenant/landlord)
4. **Middleware**: `middleware.ts` protects routes before they reach components

## Routing Changes

### Old (Vite) → New (Next.js)

| Old Route | New Route |
|-----------|-----------|
| (manual routing) | `/` |
| "search" | `/search` |
| "details" | `/property?id={id}` |
| "login" | `/sign-in` |
| "register" | `/sign-up` |
| "verification" | `/verify-email` |
| "dashboard-overview" | `/dashboard/overview` |
| "dashboard-properties" | `/dashboard/properties` |
| "dashboard-add-property" | `/dashboard/add-property` |
| "dashboard-messages" | `/dashboard/messages` |
| "dashboard-settings" | `/dashboard/settings` |

## Component Updates

### Layout Components
- **PublicLayout**: Updated to use `next/link` and Clerk hooks
- **DashboardLayout**: Uses Next.js routing with `usePathname()` for active state

### Page Components
- Removed `onNavigate` and `onLogout` props
- Now use `next/link` for navigation
- Uses `useRouter()` for programmatic navigation
- `"use client"` directive for client-side components

### UI Library
All Shadcn UI components have been kept and are fully compatible with Next.js.

## Database Integration (Supabase)

The app is configured to use Supabase for backend data. To set up:

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key to `.env.local`
4. Create necessary tables/schemas in your Supabase database

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel
```

### Other Platforms
The app is a standard Next.js application and can be deployed to any platform that supports Node.js:
- Netlify
- AWS Amplify
- Railway
- Render
- etc.

## API Routes (Future)

You can add API routes in the `src/app/api` directory. For example:

```typescript
// src/app/api/properties/route.ts
export async function GET(request: Request) {
  // Fetch from Supabase
  return Response.json({ properties: [] });
}
```

## TypeScript

The project is fully typed with TypeScript. Run type checking with:

```bash
npx tsc --noEmit
```

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Pre-built React components
- **CSS Variables**: Dark mode support via CSS custom properties

## Known Limitations

- PropertyCard, SearchPage, and others still use mock data
- Dashboard functionality is UI-only (needs backend integration)
- Supabase integration is configured but not fully implemented in pages

## Next Steps

1. **Connect Supabase**: Update API calls in components to fetch real data
2. **Add API Routes**: Create serverless functions for properties, messages, etc.
3. **User Profile**: Update dashboard header with real user data from Clerk
4. **Testing**: Add Jest and Cypress tests
5. **Analytics**: Integrate with Vercel Analytics or similar

## Migration Notes from Vite

### Breaking Changes
- No more `import.meta.env`, use `process.env`
- No more React Router, use Next.js App Router
- Navigation is now file-based instead of component-based

### Preserved
- All UI components (Shadcn)
- Component structure and styling
- Mock data in `/lib/data.ts`
- Clerk authentication setup

## Support

For issues or questions:
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

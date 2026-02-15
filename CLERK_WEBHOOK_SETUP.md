# Clerk Webhook Setup Guide

## Overview
This guide explains how to set up Clerk webhooks to automatically sync user data to your PostgreSQL database when users sign up or authenticate with Google.

## What Changed
- Added `/api/webhooks/clerk` endpoint to handle Clerk webhook events
- Updated `/api/users/me` to automatically create users if they don't exist in the database
- Added fallback `/api/users` PUT endpoint for manual user syncing

## Setup Steps

### 1. Get Your Webhook Secret
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Webhooks** in the sidebar
3. Create a new endpoint with:
   - **URL**: `https://your-domain.com/api/webhooks/clerk`
   - **Events**: Select `user.created`, `user.updated`, and `user.deleted`
4. Copy the **Signing Secret**

### 2. Add Environment Variable
Add the webhook secret to your `.env.local` file:
```env
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

### 3. Install Svix Package
The webhook verification uses Svix. Install it:
```bash
npm install svix
```

### 4. Deploy
- Make sure to add the `CLERK_WEBHOOK_SECRET` to your production environment variables
- Update the webhook URL in Clerk dashboard to point to your production domain

## How It Works

### User Creation Flow
1. User signs up via email or Google authentication
2. Clerk creates the user and triggers the `user.created` webhook
3. Our webhook endpoint receives the event
4. User data is automatically synced to PostgreSQL:
   - `clerkId` - Clerk's unique user ID
   - `email` - User's email
   - `firstName` - User's first name
   - `lastName` - User's last name
   - `role` - User's role (TENANT or LANDLORD) from signup metadata

### User Updates
- When a user updates their profile in Clerk, the `user.updated` webhook syncs changes
- The user record is updated in PostgreSQL

### User Deletion
- When a user is deleted from Clerk, the `user.deleted` webhook removes them from PostgreSQL

## Fallback Mechanism
If for any reason the webhook fails or doesn't trigger:
- The `/api/users/me` GET endpoint will create the user in the database on first access
- This ensures users are always synced, even if the webhook fails

## Testing Webhooks Locally

### Option 1: Using Ngrok (Recommended)
```bash
# Install ngrok
brew install ngrok

# Start ngrok
ngrok http 3000

# Get your public URL (e.g., https://abc123.ngrok.io)
# Update Clerk webhook URL to: https://abc123.ngrok.io/api/webhooks/clerk
```

### Option 2: Using Clerk Testing
Clerk Dashboard provides a test event sender under Webhooks > Your Endpoint > Testing

## Troubleshooting

### Webhook Secret Not Found
- Error: "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
- Solution: Copy the signing secret from Clerk Dashboard and add it to `.env.local`

### Webhook Verification Failed
- Error: "Error verifying webhook"
- Solution: Ensure the CLERK_WEBHOOK_SECRET is correct (no extra spaces)

### Users Not Syncing to Database
- Check if `CLERK_WEBHOOK_SECRET` is set correctly
- Verify the webhook URL is accessible
- Check Clerk Dashboard webhook logs for errors
- Fallback: Users will be created when they access `/api/users/me`

## Security Notes
- Webhook signatures are verified using Svix to ensure authenticity
- Never expose your `CLERK_WEBHOOK_SECRET` in client-side code
- Keep your webhook endpoint secure and don't require authentication (it verifies via signature)

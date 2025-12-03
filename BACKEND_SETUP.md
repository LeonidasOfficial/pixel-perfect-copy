# Supabase Backend Setup Guide

## Overview

This project uses **Supabase** as the backend database for persistent online storage. The frontend connects directly to Supabase using the Supabase JavaScript client, eliminating the need for a separate Express server in production.

## Quick Start

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note your project URL and anon key from **Settings → API**

### Step 2: Set Up Database

1. Go to your Supabase project dashboard
2. Open the **SQL Editor**
3. Copy and paste the contents of `supabase-migration.sql`
4. Click **Run** to create the `bookings` table

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### Step 4: Migrate Existing Bookings (Optional)

If you have existing bookings in `server/bookings.json`, migrate them to Supabase:

```bash
export VITE_SUPABASE_URL="https://your-project-id.supabase.co"
export VITE_SUPABASE_ANON_KEY="your-anon-key"
node migrate-bookings.js
```

### Step 5: Start Development Server

```bash
npm run dev
```

The admin dashboard will now connect to Supabase and all changes will be saved online!

## How It Works

- **Frontend** → Directly connects to Supabase using `@supabase/supabase-js`
- **Database** → PostgreSQL database hosted on Supabase
- **Storage** → All booking data is stored in the `bookings` table
- **Persistence** → Data persists across sessions and devices

## Database Schema

The `bookings` table has the following structure:

- `id` (TEXT, PRIMARY KEY) - Unique booking identifier
- `start_date` (TIMESTAMPTZ) - Booking start date (Saturday)
- `end_date` (TIMESTAMPTZ) - Booking end date (next Saturday)
- `guest_name` (TEXT, nullable) - Guest name
- `guest_email` (TEXT, nullable) - Guest email
- `status` (TEXT) - Booking status: 'confirmed', 'pending', or 'cancelled'
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

## Troubleshooting

### Error: "Supabase environment variables are not set"

**Solution:** Make sure your `.env` file exists and contains:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Error: "Failed to fetch bookings"

**Possible causes:**
1. Supabase credentials are incorrect
2. Database table doesn't exist (run `supabase-migration.sql`)
3. Row Level Security (RLS) policies are blocking access

**Solution:**
1. Verify your credentials in Supabase dashboard
2. Check that the `bookings` table exists in your database
3. Verify RLS policies allow access (the migration script sets up permissive policies)

### Data not persisting

**Solution:** 
- Check Supabase dashboard → Table Editor → `bookings` table
- Verify your environment variables are set correctly
- Check browser console for error messages

## Production Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

Your admin dashboard will work online with persistent data storage.

## Legacy Express Server

The Express server (`server/index.js`) is still available for local development if needed:

```bash
npm run server
```

However, for production, Supabase is recommended as it provides:
- Persistent online storage
- Automatic backups
- No server maintenance
- Scalable infrastructure

## Security Notes

- The current RLS policy allows all operations (permissive for development)
- For production, consider adding authentication and more restrictive policies
- Never commit your `.env` file to version control
- Keep your Supabase anon key secure (it's safe to use in frontend code)

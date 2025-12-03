# Supabase Setup Instructions

## ✅ Step 1: Database Setup (Do This First!)

1. Go to your Supabase project: https://supabase.com/dashboard/project/oiusaaliepjsqtyddiio
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `supabase-migration.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

This creates the `bookings` table in your database.

## ✅ Step 2: Local Environment Setup

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
VITE_SUPABASE_URL=https://oiusaaliepjsqtyddiio.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pdXNhYWxpZXBqc3F0eWRkaWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NjE3NDcsImV4cCI6MjA4MDMzNzc0N30.1pRAmwKXt1ulH3J-k4MzllyUh3x-3lB_v53O8kmoYkI
```

## ✅ Step 3: Migrate Existing Bookings

If you want to import your existing 2 bookings from `server/bookings.json`:

```bash
export VITE_SUPABASE_URL="https://oiusaaliepjsqtyddiio.supabase.co"
export VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pdXNhYWxpZXBqc3F0eWRkaWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NjE3NDcsImV4cCI6MjA4MDMzNzc0N30.1pRAmwKXt1ulH3J-k4MzllyUh3x-3lB_v53O8kmoYkI"
node migrate-bookings.js
```

## ✅ Step 4: Test Locally

```bash
npm run dev
```

Visit `http://localhost:8080/admin` and test creating/editing bookings. All changes will be saved to Supabase!

## ✅ Step 5: Deploy to Vercel

1. Push your code to GitHub
2. Go to Vercel dashboard → Your project → Settings → Environment Variables
3. Add these two variables:
   - `VITE_SUPABASE_URL` = `https://oiusaaliepjsqtyddiio.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pdXNhYWxpZXBqc3F0eWRkaWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NjE3NDcsImV4cCI6MjA4MDMzNzc0N30.1pRAmwKXt1ulH3J-k4MzllyUh3x-3lB_v53O8kmoYkI`
4. Redeploy your project

Your admin dashboard will now work online with persistent data storage! 🎉

## Troubleshooting

- **"Failed to fetch bookings"**: Make sure you ran the SQL migration script in Supabase
- **"Environment variables not set"**: Check your `.env` file exists and has the correct values
- **Data not saving**: Check Supabase dashboard → Table Editor → `bookings` table to see if data is being saved

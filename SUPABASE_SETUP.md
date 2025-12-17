# Supabase Setup Instructions

## ✅ Step 1: Get Your Supabase Credentials from Vercel

Since you created the Supabase project from Vercel, the credentials are already configured there. However, you'll need them for local development too.

### Option A: Get from Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Find `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Copy both values

### Option B: Get from Supabase Dashboard (Recommended)
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Find your project (the one connected to Vercel)
3. Click on **Settings** → **API**
4. Copy:
   - **Project URL** (this is your `VITE_SUPABASE_URL`)
   - **anon public** key (this is your `VITE_SUPABASE_ANON_KEY`)

## ✅ Step 2: Database Setup

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `supabase-migration.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

This creates the `bookings` table in your database.

## ✅ Step 3: Local Environment Setup

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your **NEW** Supabase credentials (from Step 1):

```env
VITE_SUPABASE_URL=https://your-new-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-new-anon-public-key-here
```

**Important:** Use the credentials from your Vercel-connected Supabase project, not the old ones!

## ✅ Step 4: Migrate Existing Bookings (Optional)

If you want to import your existing 2 bookings from `server/bookings.json`:

```bash
export VITE_SUPABASE_URL="https://your-new-project-id.supabase.co"
export VITE_SUPABASE_ANON_KEY="your-new-anon-key"
node migrate-bookings.js
```

## ✅ Step 5: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000/admin` and test creating/editing bookings. All changes will be saved to Supabase!

## ✅ Step 6: Verify Vercel Environment Variables

Since you created Supabase from Vercel, the environment variables should already be set. But verify:

1. Go to Vercel dashboard → Your project → **Settings** → **Environment Variables**
2. Verify these two variables exist:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. If they're missing, add them with your Supabase credentials
4. **Redeploy** your project after adding/updating variables

Your admin dashboard will now work online with persistent data storage! 🎉

## Troubleshooting

- **"Failed to fetch bookings"**: 
  - Make sure you ran the SQL migration script in Supabase (Step 2)
  - Verify your environment variables match the Vercel-connected project
  
- **"Environment variables not set"**: 
  - Check your `.env` file exists and has the correct values
  - Make sure you're using the NEW project credentials, not the old ones
  
- **Data not saving**: 
  - Check Supabase dashboard → Table Editor → `bookings` table to see if data is being saved
  - Verify Vercel environment variables are set correctly

- **Vercel deployment not working**:
  - Make sure environment variables are set in Vercel dashboard
  - Redeploy after adding/updating environment variables
  - Check Vercel deployment logs for errors

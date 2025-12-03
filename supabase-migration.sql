-- Create bookings table for La Maison Du Lavoir Vert
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  guest_name TEXT,
  guest_email TEXT,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on start_date for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_start_date ON bookings(start_date);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since we're using anon key)
-- In production, you might want to add authentication and more restrictive policies
CREATE POLICY "Allow all operations for authenticated and anon users"
ON bookings
FOR ALL
USING (true)
WITH CHECK (true);

-- Add comment to table
COMMENT ON TABLE bookings IS 'Booking management for La Maison Du Lavoir Vert vacation rental';


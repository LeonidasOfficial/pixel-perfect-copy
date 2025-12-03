/**
 * Migration script to import existing bookings from server/bookings.json to Supabase
 * 
 * Usage:
 * 1. Set environment variables:
 *    export VITE_SUPABASE_URL="https://your-project.supabase.co"
 *    export VITE_SUPABASE_ANON_KEY="your-anon-key"
 * 
 * 2. Run: node migrate-bookings.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set');
  console.error('Example:');
  console.error('  export VITE_SUPABASE_URL="https://your-project.supabase.co"');
  console.error('  export VITE_SUPABASE_ANON_KEY="your-anon-key"');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateBookings() {
  try {
    // Read existing bookings from JSON file
    const bookingsFile = path.join(__dirname, 'server', 'bookings.json');
    const fileContent = await fs.readFile(bookingsFile, 'utf-8');
    const bookings = JSON.parse(fileContent);

    if (!Array.isArray(bookings) || bookings.length === 0) {
      console.log('No bookings found in server/bookings.json');
      return;
    }

    console.log(`Found ${bookings.length} booking(s) to migrate...`);

    // Transform bookings to match database schema (snake_case)
    const bookingsToInsert = bookings.map(booking => ({
      id: booking.id,
      start_date: booking.startDate,
      end_date: booking.endDate,
      guest_name: booking.guestName || null,
      guest_email: booking.guestEmail || null,
      status: booking.status,
      created_at: booking.createdAt,
      updated_at: booking.updatedAt,
    }));

    // Insert bookings into Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingsToInsert)
      .select();

    if (error) {
      console.error('Error migrating bookings:', error);
      process.exit(1);
    }

    console.log(`Successfully migrated ${data.length} booking(s) to Supabase!`);
    console.log('Migrated bookings:');
    data.forEach((booking, index) => {
      console.log(`  ${index + 1}. ID: ${booking.id}, Dates: ${booking.start_date} to ${booking.end_date}`);
    });
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateBookings();


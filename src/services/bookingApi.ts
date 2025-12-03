import { supabase } from '@/lib/supabase';

export interface Booking {
  id: string;
  startDate: string; // ISO date string (Saturday)
  endDate: string; // ISO date string (next Saturday)
  guestName?: string;
  guestEmail?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Database row type (snake_case)
interface BookingRow {
  id: string;
  start_date: string;
  end_date: string;
  guest_name: string | null;
  guest_email: string | null;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Convert database row to Booking interface
function rowToBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    startDate: row.start_date,
    endDate: row.end_date,
    guestName: row.guest_name || undefined,
    guestEmail: row.guest_email || undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Convert Booking interface to database row
function bookingToRow(booking: Partial<Booking>): Partial<BookingRow> {
  const row: Partial<BookingRow> = {};
  if (booking.startDate !== undefined) row.start_date = booking.startDate;
  if (booking.endDate !== undefined) row.end_date = booking.endDate;
  if (booking.guestName !== undefined) row.guest_name = booking.guestName || null;
  if (booking.guestEmail !== undefined) row.guest_email = booking.guestEmail || null;
  if (booking.status !== undefined) row.status = booking.status;
  return row;
}

export async function fetchBookings(): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data.map(rowToBooking);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    // Return empty array if Supabase is not available (for development)
    return [];
  }
}

export async function createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
  try {
    const now = new Date().toISOString();
    const rowData: Partial<BookingRow> = {
      ...bookingToRow(booking),
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([rowData])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw new Error(`Failed to create booking: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from create booking');
    }

    return rowToBooking(data);
  } catch (error) {
    console.error('Create booking error:', error);
    throw error;
  }
}

export async function updateBooking(id: string, booking: Partial<Booking>): Promise<Booking> {
  try {
    const rowData: Partial<BookingRow> = {
      ...bookingToRow(booking),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('bookings')
      .update(rowData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking:', error);
      throw new Error(`Failed to update booking: ${error.message}`);
    }

    if (!data) {
      throw new Error('Booking not found');
    }

    return rowToBooking(data);
  } catch (error) {
    console.error('Update booking error:', error);
    throw error;
  }
}

export async function deleteBooking(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      throw new Error(`Failed to delete booking: ${error.message}`);
    }
  } catch (error) {
    console.error('Delete booking error:', error);
    throw error;
  }
}

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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function fetchBookings(): Promise<Booking[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout - backend server may not be running');
    } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('Backend server is not running. Please start it with: npm run server');
    } else {
      console.error('Error fetching bookings:', error);
    }
    // Return empty array if API is not available (for development)
    return [];
  }
}

export async function createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Failed to create booking: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Backend server is not running. Please start it with: npm run server');
    }
    console.error('Create booking error:', error);
    throw error;
  }
}

export async function updateBooking(id: string, booking: Partial<Booking>): Promise<Booking> {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(booking),
  });

  if (!response.ok) {
    throw new Error('Failed to update booking');
  }

  return await response.json();
}

export async function deleteBooking(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete booking');
  }
}


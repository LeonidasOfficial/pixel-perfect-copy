import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, startOfWeek, addDays, addWeeks, isSameDay, isBefore, isAfter, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { fetchBookings, Booking } from '@/services/bookingApi';

interface BookingCalendarProps {
  startDate: Date;
  endDate: Date;
}

export function BookingCalendar({ startDate, endDate }: BookingCalendarProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(null);

  useEffect(() => {
    loadBookings();
    
    // Listen for booking updates from admin dashboard
    const handleBookingsUpdate = () => {
      loadBookings();
    };
    
    window.addEventListener('bookingsUpdated', handleBookingsUpdate);
    
    // Refresh bookings every 30 seconds to catch updates
    const interval = setInterval(loadBookings, 30000);
    
    return () => {
      window.removeEventListener('bookingsUpdated', handleBookingsUpdate);
      clearInterval(interval);
    };
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all Saturday dates in the range
  const getSaturdayDates = () => {
    const saturdays: Date[] = [];
    let current = new Date(startDate);
    
    // Find the first Saturday on or after start date
    const dayOfWeek = current.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    if (daysUntilSaturday > 0) {
      current = addDays(current, daysUntilSaturday);
    }

    while (current <= endDate) {
      saturdays.push(new Date(current));
      current = addWeeks(current, 1);
    }
    
    return saturdays;
  };

  // Check if a week (Saturday) is booked (excluding cancelled bookings)
  const isWeekBooked = (saturdayDate: Date): boolean => {
    return bookings
      .filter(booking => booking.status !== 'cancelled')
      .some(booking => {
        const bookingStart = parseISO(booking.startDate);
        return isSameDay(bookingStart, saturdayDate);
      });
  };

  // Check if a date is within a booked week
  const isDateInBookedWeek = (date: Date): boolean => {
    // Find the Saturday of the week containing this date
    const dayOfWeek = date.getDay();
    const daysSinceSaturday = (dayOfWeek + 1) % 7; // Saturday is 6, so days since Saturday
    const saturday = addDays(date, -daysSinceSaturday);
    return isWeekBooked(saturday);
  };

  // Check if a date is selectable (must be a Saturday)
  const isDateSelectable = (date: Date): boolean => {
    return date.getDay() === 6; // Saturday
  };

  // Custom day modifier for styling
  const modifiers = {
    booked: (date: Date) => isDateInBookedWeek(date),
    available: (date: Date) => {
      if (date.getDay() !== 6) return false;
      return !isWeekBooked(date);
    },
    selectable: (date: Date) => isDateSelectable(date) && !isDateInBookedWeek(date),
  };

  const modifiersClassNames = {
    booked: 'bg-red-500/20 text-red-600 border border-red-500/50 hover:bg-red-500/30',
    available: 'bg-green-500/20 text-green-600 border border-green-500/50 hover:bg-green-500/30',
    selectable: 'cursor-pointer',
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isDateSelectable(date) && !isDateInBookedWeek(date)) {
      setSelectedWeek(date);
    }
  };

  const saturdayDates = getSaturdayDates();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading availability...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Legend - centered and compact */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500/20 border border-green-500/50 rounded"></div>
          <span className="text-sm text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500/20 border border-red-500/50 rounded"></div>
          <span className="text-sm text-muted-foreground">Booked</span>
        </div>
      </div>

      {/* Calendar - centered */}
      <div className="flex justify-center">
      <Calendar
        mode="single"
        selected={selectedWeek || undefined}
        onSelect={handleDateSelect}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        disabled={(date) => {
          // Disable dates outside range or not Saturdays
          return (
            isBefore(date, startDate) ||
            isAfter(date, endDate) ||
            !isDateSelectable(date) ||
            isDateInBookedWeek(date)
          );
        }}
        fromDate={startDate}
        toDate={endDate}
        defaultMonth={startDate}
        className="rounded-md border"
      />
      </div>

      {selectedWeek && (
        <div className="p-6 bg-card/50 border border-border/30 rounded-lg max-w-md mx-auto">
          <h4 className="font-heading text-lg text-foreground mb-4 text-center">Selected Week</h4>
          <div className="space-y-2 mb-6">
            <p className="body-text text-sm text-center">
              Check-in: <span className="font-semibold">{format(selectedWeek, 'EEEE, MMMM d, yyyy')}</span>
            </p>
            <p className="body-text text-sm text-center">
              Check-out: <span className="font-semibold">{format(addDays(selectedWeek, 7), 'EEEE, MMMM d, yyyy')}</span>
            </p>
          </div>
          <div className="p-4 bg-accent/5 border-l-2 border-accent/30 rounded">
            <p className="body-text text-sm text-center">
              To book this week, please contact us at{' '}
              <a href="mailto:uli@art-of-nuts.com" className="text-accent hover:underline font-semibold">
                uli@art-of-nuts.com
              </a>
              {' '}or call{' '}
              <a href="tel:+33674492318" className="text-accent hover:underline font-semibold">
                +33 6 74 49 23 18
              </a>
            </p>
          </div>
        </div>
      )}

      <div className="p-4 bg-accent/5 border-l-2 border-accent/30 rounded max-w-2xl mx-auto">
        <p className="body-text text-sm text-center">
          <span className="font-semibold">Note:</span> All bookings are weekly, from Saturday to Saturday. 
          Please contact us if you need assistance with your reservation.
        </p>
      </div>
    </div>
  );
}


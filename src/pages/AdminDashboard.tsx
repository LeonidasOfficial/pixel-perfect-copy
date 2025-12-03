import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Calendar as CalendarIcon, LogOut } from 'lucide-react';
import { format, parseISO, addDays, isBefore, isAfter, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fetchBookings, createBooking, updateBooking, deleteBooking, Booking } from '@/services/bookingApi';
import { useToast } from '@/hooks/use-toast';
import { isAuthenticated, logout } from '@/utils/auth';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const { toast: showToast } = useToast();

  // Valid date range: June 15, 2026 to September 15, 2026
  const MIN_DATE = new Date('2026-06-15');
  const MAX_DATE = new Date('2026-09-15');

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    status: 'confirmed' as 'confirmed' | 'pending' | 'cancelled',
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchBookings();
      setBookings(data);
      setBackendConnected(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load bookings';
      if (errorMessage.includes('Backend server is not running') || errorMessage.includes('Failed to fetch')) {
        setBackendConnected(false);
        showToast({
          title: 'Backend Server Not Running',
          description: 'Please start the backend server with: npm run server',
          variant: 'destructive',
        });
      } else {
        showToast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (booking?: Booking) => {
    if (booking) {
      setEditingBooking(booking);
      setSelectedDate(parseISO(booking.startDate));
      setDateRange({ from: undefined, to: undefined });
      setFormData({
        guestName: booking.guestName || '',
        guestEmail: booking.guestEmail || '',
        status: booking.status,
      });
    } else {
      setEditingBooking(null);
      setSelectedDate(undefined);
      setDateRange({ from: undefined, to: undefined });
      setFormData({
        guestName: '',
        guestEmail: '',
        status: 'confirmed',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBooking(null);
    setSelectedDate(undefined);
    setDateRange({ from: undefined, to: undefined });
    setFormData({
      guestName: '',
      guestEmail: '',
      status: 'confirmed',
    });
  };

  const handleSave = async () => {
    // Use dateRange if available, otherwise use selectedDate
    const startDateToUse = dateRange.from || selectedDate;
    
    if (!startDateToUse) {
      showToast({
        title: 'Error',
        description: 'Please select a Saturday check-in date',
        variant: 'destructive',
      });
      return;
    }

    if (startDateToUse.getDay() !== 6) {
      showToast({
        title: 'Error',
        description: 'Check-in must be on a Saturday',
        variant: 'destructive',
      });
      return;
    }

    // If range is selected, use it; otherwise default to 1 week
    let endDateToUse: Date;
    if (dateRange.to && dateRange.to.getDay() === 6) {
      endDateToUse = dateRange.to;
    } else {
      endDateToUse = addDays(startDateToUse, 7);
    }

    try {
      const startDate = startDateToUse.toISOString();
      const endDate = endDateToUse.toISOString();

      if (editingBooking) {
        await updateBooking(editingBooking.id, {
          startDate,
          endDate,
          ...formData,
        });
        showToast({
          title: 'Success',
          description: 'Booking updated successfully',
        });
      } else {
        await createBooking({
          startDate,
          endDate,
          ...formData,
        });
        showToast({
          title: 'Success',
          description: 'Booking created successfully',
        });
      }

      await loadBookings();
      handleCloseDialog();
      // Trigger event to refresh calendar in other components
      window.dispatchEvent(new CustomEvent('bookingsUpdated'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save booking';
      console.error('Save booking error:', error);
      showToast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Get all dates in selected range for highlighting
  const getDatesInRange = (): Date[] => {
    if (!dateRange.from) return [];
    if (!dateRange.to) return [dateRange.from];
    
    return eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    });
  };

  const datesInSelectedRange = getDatesInRange();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await deleteBooking(id);
      showToast({
        title: 'Success',
        description: 'Booking deleted successfully',
      });
      await loadBookings();
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to delete booking',
        variant: 'destructive',
      });
    }
  };

  // Get all booked Saturdays for calendar highlighting (excluding cancelled)
  const bookedDates = bookings
    .filter(booking => booking.status !== 'cancelled')
    .map(booking => parseISO(booking.startDate));

  // Check if a date is within a booked week (not just the Saturday check-in)
  const isDateInBookedWeek = (date: Date): boolean => {
    return bookings
      .filter(booking => booking.status !== 'cancelled')
      .some(booking => {
        const bookingStart = parseISO(booking.startDate);
        const bookingEnd = parseISO(booking.endDate);
        // Check if date falls within the booking range
        return (
          !isBefore(date, bookingStart) &&
          isBefore(date, bookingEnd)
        );
      });
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => 
      format(bookedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    showToast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  const modifiers = {
    booked: (date: Date) => isDateInBookedWeek(date),
    bookedSaturday: (date: Date) => isDateBooked(date), // Highlight check-in Saturdays differently
  };

  const modifiersClassNames = {
    booked: 'bg-red-500/20 text-red-600 border border-red-500/50 hover:bg-red-500/30',
    bookedSaturday: 'bg-red-500/30 text-red-700 border-2 border-red-500/70 font-semibold hover:bg-red-500/40',
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated()) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <main className="relative bg-background text-foreground min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="relative bg-background text-foreground min-h-screen">
      <Header />
      
      <section className="py-24 md:py-32">
        <div className="section-container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="heading-xl text-foreground mb-4">Booking Management Dashboard</h1>
              <p className="body-text text-muted-foreground">
                Manage all bookings for La Maison Du Lavoir Vert
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!backendConnected && (
                <div className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-sm text-red-600 font-semibold">
                    ⚠️ Backend server offline - Start with: npm run server
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <Button
              onClick={() => handleOpenDialog()}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Booking
            </Button>
          </div>

          {/* Calendar Overview */}
          <div className="mb-12 p-6 bg-card/50 border border-border/30 rounded-lg">
            <h2 className="font-heading text-2xl text-foreground mb-4 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-accent" />
              Calendar Overview
            </h2>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                disabled={(date) => {
                  // Only allow selecting Saturdays within valid range
                  return (
                    date.getDay() !== 6 ||
                    isBefore(date, MIN_DATE) ||
                    isAfter(date, MAX_DATE)
                  );
                }}
                fromDate={MIN_DATE}
                toDate={MAX_DATE}
                defaultMonth={MIN_DATE}
                className="rounded-md border"
              />
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500/20 border border-green-500/50 rounded"></div>
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500/20 border border-red-500/50 rounded"></div>
                <span className="text-sm text-muted-foreground">Booked</span>
              </div>
            </div>
          </div>

          {/* Organized Bookings Lists */}
          <div className="space-y-8">
            {/* Confirmed & Upcoming Reservations */}
            <div>
              <h2 className="font-heading text-2xl text-foreground mb-4">
                Confirmed & Upcoming Reservations
              </h2>
              {(() => {
                const activeBookings = bookings
                  .filter(b => b.status === 'confirmed' || b.status === 'pending')
                  .sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
                
                const today = new Date();
                const upcoming = activeBookings.filter(b => parseISO(b.startDate) >= today);
                const past = activeBookings.filter(b => parseISO(b.startDate) < today);

                return (
                  <div className="space-y-6">
                    {upcoming.length > 0 && (
                      <div>
                        <h3 className="font-heading text-lg text-foreground mb-3 text-green-600">
                          Upcoming ({upcoming.length})
                        </h3>
                        <div className="space-y-3">
                          {upcoming.map((booking) => {
                            const startDate = parseISO(booking.startDate);
                            const endDate = parseISO(booking.endDate);
                            return (
                              <div
                                key={booking.id}
                                className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg"
                              >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                      <h4 className="font-heading text-base text-foreground font-semibold">
                                        {booking.guestName || 'Unnamed Guest'}
                                      </h4>
                                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-600">
                                        {booking.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                      {booking.guestEmail}
                                    </p>
                                    <p className="text-sm text-foreground">
                                      <span className="font-semibold">{format(startDate, 'MMM d')}</span> -{' '}
                                      <span className="font-semibold">{format(endDate, 'MMM d, yyyy')}</span>
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOpenDialog(booking)}
                                      className="gap-2"
                                    >
                                      <Edit className="w-3 h-3" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                              onClick={async () => {
                                try {
                                  await updateBooking(booking.id, { status: 'cancelled' });
                                  showToast({
                                    title: 'Success',
                                    description: 'Reservation cancelled - dates are now available',
                                  });
                                  await loadBookings();
                                  // Trigger a custom event to refresh calendar in other components
                                  window.dispatchEvent(new CustomEvent('bookingsUpdated'));
                                } catch (error) {
                                  showToast({
                                    title: 'Error',
                                    description: 'Failed to cancel reservation',
                                    variant: 'destructive',
                                  });
                                }
                              }}
                                      className="gap-2 text-yellow-600 hover:text-yellow-700 hover:border-yellow-500"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {past.length > 0 && (
                      <div>
                        <h3 className="font-heading text-lg text-foreground mb-3 text-muted-foreground">
                          Past Reservations ({past.length})
                        </h3>
                        <div className="space-y-3">
                          {past.map((booking) => {
                            const startDate = parseISO(booking.startDate);
                            const endDate = parseISO(booking.endDate);
                            return (
                              <div
                                key={booking.id}
                                className="p-4 bg-card/30 border border-border/20 rounded-lg opacity-75"
                              >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                      <h4 className="font-heading text-base text-foreground">
                                        {booking.guestName || 'Unnamed Guest'}
                                      </h4>
                                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                                        {booking.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                      {booking.guestEmail}
                                    </p>
                                    <p className="text-sm text-foreground">
                                      <span className="font-semibold">{format(startDate, 'MMM d')}</span> -{' '}
                                      <span className="font-semibold">{format(endDate, 'MMM d, yyyy')}</span>
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOpenDialog(booking)}
                                      className="gap-2"
                                    >
                                      <Edit className="w-3 h-3" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDelete(booking.id)}
                                      className="gap-2 text-red-600 hover:text-red-700 hover:border-red-500"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {activeBookings.length === 0 && (
                      <div className="p-8 text-center bg-card/50 border border-border/30 rounded-lg">
                        <p className="text-muted-foreground">No active reservations. Click "Add New Booking" to create one.</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Cancelled Reservations */}
            {(() => {
              const cancelled = bookings.filter(b => b.status === 'cancelled');
              if (cancelled.length === 0) return null;
              
              return (
                <div>
                  <h2 className="font-heading text-2xl text-foreground mb-4">
                    Cancelled Reservations ({cancelled.length})
                  </h2>
                  <div className="space-y-3">
                    {cancelled.map((booking) => {
                      const startDate = parseISO(booking.startDate);
                      const endDate = parseISO(booking.endDate);
                      return (
                        <div
                          key={booking.id}
                          className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg opacity-60"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-heading text-base text-foreground">
                                  {booking.guestName || 'Unnamed Guest'}
                                </h4>
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-600">
                                  Cancelled
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {booking.guestEmail}
                              </p>
                              <p className="text-sm text-foreground">
                                <span className="font-semibold">{format(startDate, 'MMM d')}</span> -{' '}
                                <span className="font-semibold">{format(endDate, 'MMM d, yyyy')}</span>
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(booking.id)}
                                className="gap-2 text-red-600 hover:text-red-700 hover:border-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Add/Edit Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">
              {editingBooking ? 'Edit Booking' : 'Add New Booking'}
            </DialogTitle>
            <DialogDescription>
              {editingBooking
                ? 'Update booking details below'
                : 'Select a Saturday date and fill in guest information'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Date Selection */}
            <div>
              <Label className="mb-2 block">
                Select Saturday Dates (Click first Saturday for check-in, then second Saturday for check-out)
              </Label>
              <div className="flex justify-center">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from) {
                      if (range.from.getDay() !== 6) {
                        showToast({
                          title: 'Invalid Date',
                          description: 'Check-in must be on a Saturday',
                          variant: 'destructive',
                        });
                        return;
                      }
                      
                      if (range.to && range.to.getDay() !== 6) {
                        showToast({
                          title: 'Invalid Date',
                          description: 'Check-out must be on a Saturday',
                          variant: 'destructive',
                        });
                        return;
                      }

                      if (range.from && range.to) {
                        setDateRange({ from: range.from, to: range.to });
                      } else if (range.from) {
                        setDateRange({ from: range.from, to: undefined });
                      }

                      // Set selectedDate for backward compatibility
                      setSelectedDate(range.from);
                    } else {
                      setDateRange({ from: undefined, to: undefined });
                      setSelectedDate(undefined);
                    }
                  }}
                  modifiers={{
                    ...modifiers,
                    inRange: (date) => {
                      if (!dateRange.from) return false;
                      if (!dateRange.to) return false;
                      return (
                        !isBefore(date, dateRange.from) &&
                        !isAfter(date, dateRange.to)
                      );
                    },
                  }}
                  modifiersClassNames={{
                    ...modifiersClassNames,
                    inRange: 'bg-red-500/30 text-red-700 border border-red-500/70',
                  }}
                  disabled={(date) => {
                    // Restrict to valid date range and only Saturdays
                    const isBooked = isDateBooked(date);
                    const isOutsideRange = isBefore(date, MIN_DATE) || isAfter(date, MAX_DATE);
                    const isNotSaturday = date.getDay() !== 6;
                    
                    // Allow selecting booked dates only if editing that specific booking
                    if (editingBooking && isBooked) {
                      const bookingStart = format(parseISO(editingBooking.startDate), 'yyyy-MM-dd');
                      const currentDate = format(date, 'yyyy-MM-dd');
                      if (bookingStart === currentDate) {
                        return isOutsideRange || isNotSaturday;
                      }
                    }
                    
                    return isNotSaturday || isOutsideRange || isBooked;
                  }}
                  fromDate={MIN_DATE}
                  toDate={MAX_DATE}
                  defaultMonth={MIN_DATE}
                  numberOfMonths={1}
                  className="rounded-md border"
                />
              </div>
              {(dateRange.from || selectedDate) && (
                <div className="mt-4 p-4 bg-accent/5 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">Check-in:</span>{' '}
                    {format(dateRange.from || selectedDate!, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Check-out:</span>{' '}
                    {format(
                      dateRange.to || addDays(dateRange.from || selectedDate!, 7),
                      'EEEE, MMMM d, yyyy'
                    )}
                  </p>
                  {dateRange.from && dateRange.to && (
                    <p className="text-sm mt-2 text-muted-foreground">
                      Duration: {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Guest Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="guestName">Guest Name</Label>
                <Input
                  id="guestName"
                  value={formData.guestName}
                  onChange={(e) =>
                    setFormData({ ...formData, guestName: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="guestEmail">Guest Email</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={formData.guestEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, guestEmail: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'confirmed' | 'pending' | 'cancelled',
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!dateRange.from && !selectedDate}>
                {editingBooking ? 'Update Booking' : 'Create Booking'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}


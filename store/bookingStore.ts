import { create } from 'zustand';
import * as bookingService from '@/services/bookingService';
import type {
  AdminBookingOverview,
  Booking,
  BookingCreateRequest,
  BookingStatus,
} from '@/types/api';

interface BookingState {
  bookings: Booking[];
  pendingBookings: Booking[];
  adminOverview: AdminBookingOverview[];
  isLoading: boolean;
  error: string | null;

  fetchBookings: () => Promise<void>;
  fetchPendingBookings: () => Promise<void>;
  fetchAdminOverview: () => Promise<void>;
  createBooking: (data: BookingCreateRequest) => Promise<Booking>;
  updateStatus: (bookingId: number, newStatus: BookingStatus) => Promise<void>;
  removeBooking: (id: number) => Promise<void>;
  adminRemoveBooking: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  pendingBookings: [],
  adminOverview: [],
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await bookingService.getBookings();
      set({ bookings, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load bookings',
      });
    }
  },

  fetchPendingBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const pendingBookings = await bookingService.getPendingBookings();
      set({ pendingBookings, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error:
          err instanceof Error ? err.message : 'Failed to load pending bookings',
      });
    }
  },

  fetchAdminOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const adminOverview = await bookingService.getAdminBookingDashboard();
      set({ adminOverview, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error:
          err instanceof Error ? err.message : 'Failed to load admin dashboard',
      });
    }
  },

  createBooking: async (data) => {
    const booking = await bookingService.createBooking(data);
    set((state) => ({ bookings: [...state.bookings, booking] }));
    return booking;
  },

  updateStatus: async (bookingId, newStatus) => {
    await bookingService.updateBookingStatus({ bookingId, newStatus });
    const patch = (list: Booking[]) =>
      list.map((b) =>
        b.id === bookingId ? { ...b, status: newStatus } : b
      );
    set((state) => ({
      bookings: patch(state.bookings),
      pendingBookings: patch(state.pendingBookings).filter(
        (b) => b.status === 'Pending'
      ),
    }));
  },

  removeBooking: async (id) => {
    await bookingService.deleteBooking(id);
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
      pendingBookings: state.pendingBookings.filter((b) => b.id !== id),
    }));
  },

  adminRemoveBooking: async (id) => {
    await bookingService.adminDeleteBooking(id);
    set((state) => ({
      adminOverview: state.adminOverview.filter((b) => b.bookingId !== id),
    }));
  },

  clearError: () => set({ error: null }),
}));

export function bookingsForResource(
  bookings: Booking[],
  resourceId: number
): Booking[] {
  return bookings.filter((b) => b.resourceId === resourceId);
}

export function bookingsForUser(
  bookings: Booking[],
  userId: number
): Booking[] {
  return bookings.filter((b) => b.userId === userId);
}

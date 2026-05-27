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
    console.log('[Store] Fetching all bookings...');
    try {
      const bookings = await bookingService.getBookings();
      console.log(`[Store] Fetched ${bookings.length} bookings successfully.`);
      set({ bookings, isLoading: false });
    } catch (err) {
      console.error('[Store] Fetching bookings failed:', err);
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load bookings',
      });
    }
  },

  fetchPendingBookings: async () => {
    set({ isLoading: true, error: null });
    console.log('[Store] Fetching pending bookings...');
    try {
      const pendingBookings = await bookingService.getPendingBookings();
      console.log(`[Store] Fetched ${pendingBookings.length} pending bookings successfully.`);
      set({ pendingBookings, isLoading: false });
    } catch (err) {
      console.error('[Store] Fetching pending bookings failed:', err);
      set({
        isLoading: false,
        error:
          err instanceof Error ? err.message : 'Failed to load pending bookings',
      });
    }
  },

  fetchAdminOverview: async () => {
    set({ isLoading: true, error: null });
    console.log('[Store] Fetching admin booking overview...');
    try {
      const adminOverview = await bookingService.getAdminBookingDashboard();
      console.log(`[Store] Fetched ${adminOverview.length} admin overview bookings.`);
      set({ adminOverview, isLoading: false });
    } catch (err) {
      console.error('[Store] Fetching admin overview failed:', err);
      set({
        isLoading: false,
        error:
          err instanceof Error ? err.message : 'Failed to load admin dashboard',
      });
    }
  },

  createBooking: async (data) => {
    console.log('[Store] Initiating booking creation payload:', JSON.stringify(data));
    try {
      const booking = await bookingService.createBooking(data);
      console.log('[Store] Booking created successfully:', JSON.stringify(booking));
      set((state) => ({ bookings: [...state.bookings, booking] }));
      return booking;
    } catch (err) {
      console.error('[Store] Booking creation failed:', err);
      throw err;
    }
  },

  updateStatus: async (bookingId, newStatus) => {
    console.log(`[Store] Updating booking status (ID: ${bookingId}, Status: ${newStatus})...`);
    try {
      await bookingService.updateBookingStatus({ bookingId, newStatus });
      console.log(`[Store] Booking status update successful for ID ${bookingId}`);
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
    } catch (err) {
      console.error(`[Store] Updating status failed for ID ${bookingId}:`, err);
      throw err;
    }
  },

  removeBooking: async (id) => {
    console.log(`[Store] Removing booking ID: ${id}...`);
    try {
      await bookingService.deleteBooking(id);
      console.log(`[Store] Booking ID ${id} removed successfully.`);
      set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== id),
        pendingBookings: state.pendingBookings.filter((b) => b.id !== id),
      }));
    } catch (err) {
      console.error(`[Store] Removing booking ID ${id} failed:`, err);
      throw err;
    }
  },

  adminRemoveBooking: async (id) => {
    console.log(`[Store] Admin removing booking ID: ${id}...`);
    try {
      await bookingService.adminDeleteBooking(id);
      console.log(`[Store] Admin removed booking ID ${id} successfully.`);
      set((state) => ({
        adminOverview: state.adminOverview.filter((b) => b.bookingId !== id),
      }));
    } catch (err) {
      console.error(`[Store] Admin removing booking ID ${id} failed:`, err);
      throw err;
    }
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
  userId: number,
  fullName?: string
): Booking[] {
  return bookings.filter((b) => {
    if (b.userId === userId) return true;
    if (fullName && b.farmerName && b.farmerName.toLowerCase() === fullName.toLowerCase()) return true;
    return false;
  });
}

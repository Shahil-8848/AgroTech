import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { useResourceStore } from '@/store/resourceStore';
import { useUserStore } from '@/store/userStore';

/** Loads API data for the active role when the dashboard mounts. */
export function useDashboardData() {
  const role = useAuthStore((s) => s.role);
  const fetchResources = useResourceStore((s) => s.fetchResources);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const fetchPendingBookings = useBookingStore((s) => s.fetchPendingBookings);
  const fetchAdminOverview = useBookingStore((s) => s.fetchAdminOverview);
  const fetchUsers = useUserStore((s) => s.fetchUsers);

  useEffect(() => {
    fetchResources(true);
  }, [fetchResources]);

  useEffect(() => {
    if (!role) return;

    if (role === 'admin') {
      fetchAdminOverview();
      fetchUsers();
      return;
    }

    if (role === 'owner') {
      fetchPendingBookings();
      fetchBookings();
      return;
    }

    fetchBookings();
  }, [
    role,
    fetchBookings,
    fetchPendingBookings,
    fetchAdminOverview,
    fetchUsers,
  ]);
}

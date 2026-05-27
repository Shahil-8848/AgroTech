import { useEffect, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError } from '@/services/apiClient';
import { formatApiDateTime } from '@/lib/dates';
import { useAuthStore } from '@/store/authStore';
import {
  bookingsForUser,
  useBookingStore,
} from '@/store/bookingStore';
import { useResourceStore } from '@/store/resourceStore';
import type { AdminBookingOverview, Booking, BookingStatus } from '@/types/api';

function statusColor(status: BookingStatus): string {
  switch (status) {
    case 'Approved':
      return '#A4D65E';
    case 'Rejected':
      return '#EF4444';
    default:
      return '#F59E0B';
  }
}

export default function BookingsScreen() {
  const role = useAuthStore((s) => s.role);
  const user = useAuthStore((s) => s.user);
  
  const resources = useResourceStore((s) => s.resources);
  const fetchResources = useResourceStore((s) => s.fetchResources);

  const bookings = useBookingStore((s) => s.bookings);
  const pendingBookings = useBookingStore((s) => s.pendingBookings);
  const adminOverview = useBookingStore((s) => s.adminOverview);
  const isLoading = useBookingStore((s) => s.isLoading);
  const error = useBookingStore((s) => s.error);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const fetchPendingBookings = useBookingStore((s) => s.fetchPendingBookings);
  const fetchAdminOverview = useBookingStore((s) => s.fetchAdminOverview);
  const updateStatus = useBookingStore((s) => s.updateStatus);
  const adminRemoveBooking = useBookingStore((s) => s.adminRemoveBooking);

  // Tab for Owner & Farmer: 'pending' or 'history'
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  const load = () => {
    fetchResources(); // Always pull resources for lookup and owner filtering
    if (role === 'admin') {
      fetchAdminOverview();
      return;
    }
    if (role === 'owner') {
      fetchPendingBookings();
    }
    fetchBookings();
  };

  useEffect(() => {
    load();
  }, [role]);

  const resourceName = (resourceId: number) =>
    resources.find((r) => r.id === resourceId)?.name ?? `Resource #${resourceId}`;

  const handleOwnerAction = (booking: Booking, newStatus: BookingStatus) => {
    Alert.alert(
      newStatus === 'Approved' ? 'Approve booking' : 'Reject booking',
      `Set this request to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await updateStatus(booking.id, newStatus);
            } catch (err) {
              const msg =
                err instanceof ApiError
                  ? err.message
                  : 'Could not update booking';
              Alert.alert('Error', msg);
            }
          },
        },
      ]
    );
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.resourceName || resourceName(item.resourceId)}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.meta}>
        {formatApiDateTime(item.startTime)} → {formatApiDateTime(item.endTime)}
      </Text>
      {item.farmerName ? (
        <Text style={styles.meta}>Farmer: {item.farmerName}</Text>
      ) : null}

      {role === 'owner' && item.status === 'Pending' ? (
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, styles.approveBtn]}
            onPress={() => handleOwnerAction(item, 'Approved')}
          >
            <Text style={styles.actionBtnText}>Approve</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => handleOwnerAction(item, 'Rejected')}
          >
            <Text style={styles.actionBtnText}>Reject</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  const renderAdminRow = ({ item }: { item: AdminBookingOverview }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.resourceName ?? 'Resource'}</Text>
      <Text style={styles.meta}>Owner: {item.ownerName ?? '—'}</Text>
      <Text style={styles.meta}>Farmer: {item.farmerName ?? '—'}</Text>
      <Text style={styles.meta}>
        {formatApiDateTime(item.startTime)} → {formatApiDateTime(item.endTime)}
      </Text>
      <Pressable
        style={styles.deleteBtn}
        onPress={() => {
          Alert.alert('Remove booking', 'Delete this booking from the platform?', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                try {
                  await adminRemoveBooking(item.bookingId);
                } catch (err) {
                  Alert.alert(
                    'Error',
                    err instanceof ApiError ? err.message : 'Delete failed'
                  );
                }
              },
            },
          ]);
        }}
      >
        <Text style={styles.deleteBtnText}>Remove</Text>
      </Pressable>
    </View>
  );

  // Filter bookings for owner
  const myResourceIds = useMemo(() => {
    if (!user) return new Set<number>();
    return new Set(resources.filter((r) => r.ownerId === user.id).map((r) => r.id));
  }, [resources, user]);

  const ownerPendingList = useMemo(() => {
    return pendingBookings.filter((b) => b.resourceId === 0 || myResourceIds.has(b.resourceId));
  }, [pendingBookings, myResourceIds]);

  const ownerHistoryList = useMemo(() => {
    return bookings.filter(
      (b) => (b.resourceId === 0 || myResourceIds.has(b.resourceId)) && b.status !== 'Pending'
    );
  }, [bookings, myResourceIds]);

  // Filter bookings for farmer
  const farmerPendingList = useMemo(() => {
    return user ? bookingsForUser(bookings, user.id, user.fullName).filter((b) => b.status === 'Pending') : [];
  }, [bookings, user]);

  const farmerHistoryList = useMemo(() => {
    return user ? bookingsForUser(bookings, user.id, user.fullName).filter((b) => b.status !== 'Pending') : [];
  }, [bookings, user]);

  const listData = useMemo(() => {
    if (role === 'admin') {
      return adminOverview;
    }
    if (role === 'owner') {
      return activeTab === 'pending' ? ownerPendingList : ownerHistoryList;
    }
    return activeTab === 'pending' ? farmerPendingList : farmerHistoryList;
  }, [role, activeTab, adminOverview, ownerPendingList, ownerHistoryList, farmerPendingList, farmerHistoryList]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Bookings</Text>
      <Text style={styles.subtitle}>
        {role === 'admin'
          ? 'All platform reservations'
          : role === 'owner'
            ? 'Review and manage equipment reservations'
            : 'Your equipment reservations'}
      </Text>

      {/* Tab Selector */}
      {role === 'owner' || role === 'farmer' ? (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'pending' && styles.tabButtonActive]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'pending' && styles.tabButtonTextActive]}>
              {role === 'owner' ? 'Pending Requests' : 'Pending Bookings'} ({role === 'owner' ? ownerPendingList.length : farmerPendingList.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'history' && styles.tabButtonActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'history' && styles.tabButtonTextActive]}>
              {role === 'owner' ? 'Booking History' : 'My History'} ({role === 'owner' ? ownerHistoryList.length : farmerHistoryList.length})
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isLoading && listData.length === 0 ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color="#A4D65E"
        />
      ) : (
        <FlatList
          data={listData as (Booking | AdminBookingOverview)[]}
          keyExtractor={(item) =>
            'bookingId' in item ? String(item.bookingId) : String(item.id)
          }
          renderItem={({ item }) => {
            if (role === 'admin') {
              return renderAdminRow({ item: item as AdminBookingOverview });
            }
            return renderBooking({ item: item as Booking });
          }}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={load} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No bookings to show.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  // Tab styles
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  tabButtonTextActive: {
    color: '#1F2937',
  },
  error: { color: '#B91C1C', paddingHorizontal: 20, marginBottom: 8 },
  loader: { marginTop: 40 },
  list: { paddingHorizontal: 20, paddingBottom: 32, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  meta: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  approveBtn: { backgroundColor: '#A4D65E' },
  rejectBtn: { backgroundColor: '#EF4444' },
  actionBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  deleteBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  deleteBtnText: { color: '#B91C1C', fontWeight: '600' },
  empty: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 40,
    fontSize: 15,
  },
});

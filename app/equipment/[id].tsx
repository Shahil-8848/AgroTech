import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Star,
  Tractor,
  User,
} from 'lucide-react-native';
import { ApiError } from '@/services/apiClient';
import { formatApiDateTime, toApiDateTime } from '@/lib/dates';
import * as resourceService from '@/services/resourceService';
import { useAuthStore } from '@/store/authStore';
import {
  bookingsForResource,
  useBookingStore,
} from '@/store/bookingStore';
import { useResourceStore } from '@/store/resourceStore';
import type { ResourceDisplay } from '@/types/api';

const PLACEHOLDER_IMAGE =
  'https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?auto=compress&cs=tinysrgb&w=800';

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const resourceId = Number(id);

  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const getById = useResourceStore((s) => s.getById);
  const fetchResources = useResourceStore((s) => s.fetchResources);
  const bookings = useBookingStore((s) => s.bookings);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const createBooking = useBookingStore((s) => s.createBooking);

  const [resource, setResource] = useState<ResourceDisplay | null>(
    () => getById(resourceId) ?? null
  );
  const [loading, setLoading] = useState(!resource);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchResources();
    fetchBookings();
  }, [fetchResources, fetchBookings]);

  useEffect(() => {
    const cached = getById(resourceId);
    if (cached) {
      setResource(cached);
      setLoading(false);
      return;
    }

    if (!Number.isFinite(resourceId)) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const raw = await resourceService.getResourceById(resourceId);
        if (!cancelled) {
          setResource({
            ...raw,
            ownerName: `Owner #${raw.ownerId}`,
            averageRating: null,
            reviewCount: 0,
          });
        }
      } catch {
        if (!cancelled) setResource(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resourceId, getById]);

  const schedule = useMemo(
    () => bookingsForResource(bookings, resourceId),
    [bookings, resourceId]
  );

  const handleReserve = () => {
    if (!user) {
      Alert.alert('Sign in required', 'Please log in as a farmer to reserve.');
      return;
    }
    if (role !== 'farmer') {
      Alert.alert(
        'Farmers only',
        'Only farmer accounts can create reservations.'
      );
      return;
    }

    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(9, 0, 0, 0);
    const end = new Date(start);
    end.setHours(17, 0, 0, 0);

    Alert.alert(
      'Confirm reservation',
      `Reserve "${resource?.name}" for tomorrow 9:00 AM – 5:00 PM?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reserve',
          onPress: async () => {
            setBookingLoading(true);
            try {
              await createBooking({
                resourceId,
                userId: user.id,
                startTime: toApiDateTime(start),
                endTime: toApiDateTime(end),
              });
              Alert.alert(
                'Request sent',
                'Your booking is pending owner approval.'
              );
              router.push('/(app)/(tabs)/bookings');
            } catch (err) {
              Alert.alert(
                'Booking failed',
                err instanceof ApiError
                  ? err.message
                  : 'Could not create reservation'
              );
            } finally {
              setBookingLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={styles.centered} size="large" color="#A4D65E" />
      </SafeAreaView>
    );
  }

  if (!resource) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Resource not found</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <ArrowLeft size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {resource.name}
        </Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: PLACEHOLDER_IMAGE }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.body}>
          <Text style={styles.title}>{resource.name}</Text>
          <Text style={styles.description}>{resource.description}</Text>

          <View style={styles.ownerRow}>
            <User size={18} color="#6B7280" />
            <Text style={styles.ownerText}>{resource.ownerName}</Text>
          </View>

          {resource.averageRating != null ? (
            <View style={styles.ratingRow}>
              <Star size={16} color="#FFC107" fill="#FFC107" />
              <Text style={styles.ratingText}>
                {resource.averageRating.toFixed(1)} ({resource.reviewCount}{' '}
                reviews)
              </Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color="#A4D65E" />
              <Text style={styles.sectionTitle}>Reservation schedule</Text>
            </View>
            {schedule.length === 0 ? (
              <Text style={styles.scheduleEmpty}>
                No bookings yet — this resource is open.
              </Text>
            ) : (
              schedule.map((b) => (
                <View key={b.id} style={styles.scheduleItem}>
                  <Text style={styles.scheduleStatus}>{b.status}</Text>
                  <Text style={styles.scheduleTime}>
                    {formatApiDateTime(b.startTime)} →{' '}
                    {formatApiDateTime(b.endTime)}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {role === 'farmer' ? (
        <View style={styles.footer}>
          <Pressable
            style={[styles.reserveBtn, bookingLoading && styles.disabled]}
            onPress={handleReserve}
            disabled={bookingLoading}
          >
            {bookingLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Tractor size={20} color="#FFFFFF" />
                <Text style={styles.reserveText}>Reserve for tomorrow</Text>
              </>
            )}
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  heroImage: { width: '100%', height: 220 },
  body: { padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#1F2937' },
  description: { fontSize: 15, lineHeight: 22, color: '#4B5563' },
  ownerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ownerText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingText: { fontSize: 14, color: '#1F2937', fontWeight: '600' },
  section: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  scheduleEmpty: { fontSize: 14, color: '#9CA3AF' },
  scheduleItem: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  scheduleStatus: { fontSize: 12, fontWeight: '700', color: '#A16207' },
  scheduleTime: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  reserveBtn: {
    backgroundColor: '#A4D65E',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  disabled: { opacity: 0.7 },
  reserveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  errorText: { fontSize: 16, color: '#6B7280', marginBottom: 16 },
  backBtn: {
    backgroundColor: '#A4D65E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backBtnText: { color: '#FFFFFF', fontWeight: '600' },
});

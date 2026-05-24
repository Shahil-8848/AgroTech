import { router } from 'expo-router';
import {
  Calendar,
  RefreshCw,
  ShoppingBag,
  Star,
  Tractor,
} from 'lucide-react-native';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { bookingsForUser, useBookingStore } from '@/store/bookingStore';
import { useResourceStore } from '@/store/resourceStore';

export function FarmerDashboard() {
  const user = useAuthStore((s) => s.user);
  const resources = useResourceStore((s) => s.resources);
  const resourcesLoading = useResourceStore((s) => s.isLoading);
  const fetchResources = useResourceStore((s) => s.fetchResources);
  const bookings = useBookingStore((s) => s.bookings);
  const bookingsLoading = useBookingStore((s) => s.isLoading);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);

  const myBookings = user ? bookingsForUser(bookings, user.id) : [];
  const featured = resources.slice(0, 3);
  const refreshing = resourcesLoading || bookingsLoading;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.userName}>{user?.fullName ?? 'Farmer'}</Text>
        </View>
        <Pressable
          style={styles.refreshBtn}
          onPress={() => {
            fetchResources(true);
            fetchBookings();
          }}
        >
          <RefreshCw size={18} color="#4D7C0F" />
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{resources.length}</Text>
          <Text style={styles.statLabel}>Resources listed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{myBookings.length}</Text>
          <Text style={styles.statLabel}>My reservations</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Browse & book equipment</Text>
        <Text style={styles.cardBody}>
          Reserve tractors, harvesters, and tools from verified owners — live
          from the AgroTech API.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(app)/(tabs)/marketplace')}
        >
          <ShoppingBag size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Open Marketplace</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(app)/(tabs)/marketplace')}
          >
            <Tractor size={24} color="#A4D65E" />
            <Text style={styles.actionLabel}>Rent equipment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(app)/(tabs)/bookings')}
          >
            <Calendar size={24} color="#8B5A2B" />
            <Text style={styles.actionLabel}>My bookings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {refreshing && featured.length === 0 ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color="#A4D65E"
        />
      ) : null}

      {featured.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured resources</Text>
            <TouchableOpacity
              onPress={() => router.push('/(app)/(tabs)/marketplace')}
            >
              <Text style={styles.link}>See all</Text>
            </TouchableOpacity>
          </View>
          {featured.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.listItem}
              onPress={() => router.push(`/equipment/${item.id}`)}
            >
              <View style={styles.listIcon}>
                <Tractor size={22} color="#A4D65E" />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listTitle}>{item.name}</Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {item.ownerName}
                </Text>
              </View>
              {item.averageRating != null ? (
                <View style={styles.rating}>
                  <Star size={12} color="#FFC107" fill="#FFC107" />
                  <Text style={styles.ratingText}>
                    {item.averageRating.toFixed(1)}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: { fontSize: 16, color: '#6B7280' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  refreshBtn: {
    backgroundColor: '#ECFCCB',
    padding: 10,
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    gap: 10,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  cardBody: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  primaryButton: {
    marginTop: 8,
    backgroundColor: '#A4D65E',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  link: { color: '#A4D65E', fontWeight: '500' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  loader: { marginVertical: 24 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  listIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: { flex: 1, gap: 4 },
  listTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  meta: { fontSize: 12, color: '#6B7280' },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, color: '#6B7280' },
});

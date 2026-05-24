import { router } from 'expo-router';
import {
  ClipboardList,
  RefreshCw,
  Shield,
  Users,
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
import { useBookingStore } from '@/store/bookingStore';
import { useUserStore } from '@/store/userStore';

export function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const users = useUserStore((s) => s.users);
  const usersLoading = useUserStore((s) => s.isLoading);
  const fetchUsers = useUserStore((s) => s.fetchUsers);
  const adminOverview = useBookingStore((s) => s.adminOverview);
  const overviewLoading = useBookingStore((s) => s.isLoading);
  const fetchAdminOverview = useBookingStore((s) => s.fetchAdminOverview);

  const farmers = users.filter(
    (u) => u.role.toLowerCase() === 'farmer'
  ).length;
  const owners = users.filter((u) => u.role.toLowerCase() === 'owner').length;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin panel</Text>
          <Text style={styles.userName}>{user?.fullName ?? 'Admin'}</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            style={styles.refreshBtn}
            onPress={() => {
              fetchUsers();
              fetchAdminOverview();
            }}
          >
            <RefreshCw size={18} color="#0EA5E9" />
          </Pressable>
          <View style={styles.roleBadge}>
            <Shield size={14} color="#0EA5E9" />
            <Text style={styles.roleText}>Admin</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          {usersLoading ? (
            <ActivityIndicator color="#0EA5E9" />
          ) : (
            <Text style={styles.statValue}>{users.length}</Text>
          )}
          <Text style={styles.statLabel}>Total users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{farmers}</Text>
          <Text style={styles.statLabel}>Farmers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{owners}</Text>
          <Text style={styles.statLabel}>Owners</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Platform overview</Text>
        <Text style={styles.cardBody}>
          {overviewLoading
            ? 'Loading booking data…'
            : `${adminOverview.length} active bookings on the platform.`}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Management</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(app)/(tabs)/bookings')}
        >
          <ClipboardList size={22} color="#0EA5E9" />
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Booking dashboard</Text>
            <Text style={styles.menuSubtitle}>
              View all reservations · {adminOverview.length} records
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => fetchUsers()}
        >
          <Users size={22} color="#A4D65E" />
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>User management</Text>
            <Text style={styles.menuSubtitle}>
              {users.length} registered users from API
            </Text>
          </View>
        </TouchableOpacity>
      </View>
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
  headerRight: { alignItems: 'flex-end', gap: 8 },
  refreshBtn: {
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: { color: '#0EA5E9', fontWeight: '600', fontSize: 12 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  statLabel: { fontSize: 11, color: '#6B7280', textAlign: 'center' },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    gap: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  cardBody: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  section: { padding: 20, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 14,
    elevation: 2,
  },
  menuText: { flex: 1, gap: 4 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  menuSubtitle: { fontSize: 13, color: '#6B7280' },
});

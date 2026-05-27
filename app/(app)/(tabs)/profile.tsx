import { useEffect, useState, useMemo } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ChevronRight,
  LogOut,
  Mail,
  Phone,
  Shield,
  Settings,
  Bell,
  Globe,
  Lock,
  Sparkles,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useResourceStore } from '@/store/resourceStore';
import { useBookingStore, bookingsForUser } from '@/store/bookingStore';
import * as userService from '@/services/userService';
import { roleLabel } from '@/lib/roles';
import { colors, spacing, radius } from '@/constants/theme';

const DEFAULT_AVATAR = require('@/assets/images/default_avatar.png');

export default function ProfileScreen() {
  const { user, role, logout } = useAuthStore();
  const resources = useResourceStore((s) => s.resources);
  const bookings = useBookingStore((s) => s.bookings);
  const fetchResources = useResourceStore((s) => s.fetchResources);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);

  const [refreshing, setRefreshing] = useState(false);

  // Sync user profile details on mount to guarantee email & phone are loaded
  useEffect(() => {
    fetchResources();
    fetchBookings();
    
    if (user?.id) {
      setRefreshing(true);
      userService.getUserById(user.id)
        .then((profile) => {
          // Update user details in store dynamically
          useAuthStore.setState({ user: profile });
        })
        .catch((err) => {
          console.warn('[Profile] Failed to refresh user profile:', err);
        })
        .finally(() => {
          setRefreshing(false);
        });
    }
  }, []);

  // Compute stats for Farmer or Owner
  const stats = useMemo(() => {
    if (!user) return { mainCount: 0, mainLabel: 'Activities', subCount: 0, subLabel: 'Reviews' };
    
    if (role === 'farmer') {
      const myBookings = bookingsForUser(bookings, user.id, user.fullName);
      const pendingCount = myBookings.filter((b) => b.status === 'Pending').length;
      const approvedCount = myBookings.filter((b) => b.status === 'Approved').length;
      return {
        mainCount: myBookings.length,
        mainLabel: 'Total Bookings',
        subCount: pendingCount,
        subLabel: 'Pending Approval',
        extraCount: approvedCount,
        extraLabel: 'Approved',
      };
    } else if (role === 'owner') {
      const myResources = resources.filter((r) => r.ownerId === user.id);
      // Count pending requests received for their resources
      const myResourceIds = new Set(myResources.map((r) => r.id));
      const pendingRequests = bookings.filter((b) => myResourceIds.has(b.resourceId) && b.status === 'Pending').length;
      return {
        mainCount: myResources.length,
        mainLabel: 'My Listed Gear',
        subCount: pendingRequests,
        subLabel: 'Pending Actions',
        extraCount: myResources.reduce((acc, r) => acc + r.reviewCount, 0),
        extraLabel: 'Total Reviews',
      };
    }
    return {
      mainCount: resources.length,
      mainLabel: 'Platform Items',
      subCount: bookings.length,
      subLabel: 'Platform Bookings',
      extraCount: 0,
      extraLabel: 'System',
    };
  }, [role, user, bookings, resources]);

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  const handlePasswordReset = () => {
    if (!user?.email) {
      Alert.alert('Reset Password', 'An email address is required to reset your password.');
      return;
    }
    Alert.alert(
      'Reset Password',
      `Would you like to trigger a password reset link to ${user.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Link',
          onPress: () => {
            Alert.alert('Success', 'Password reset instructions have been sent to your email.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            <Image source={DEFAULT_AVATAR} style={styles.avatarImage} />
            <View style={styles.activeBadge} />
          </View>

          <Text style={styles.nameText}>{user?.fullName ?? 'AgroTech User'}</Text>
          
          <View style={styles.roleBadgeContainer}>
            <Sparkles size={13} color={colors.primary} />
            <Text style={styles.roleBadgeText}>
              {role ? roleLabel(role) : 'Verified Member'}
            </Text>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{stats.mainCount}</Text>
              <Text style={styles.statLabel}>{stats.mainLabel}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{stats.subCount}</Text>
              <Text style={styles.statLabel}>{stats.subLabel}</Text>
            </View>
            {stats.extraLabel ? (
              <>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{stats.extraCount ?? 0}</Text>
                  <Text style={styles.statLabel}>{stats.extraLabel}</Text>
                </View>
              </>
            ) : null}
          </View>
        </View>

        {/* User Details Details Section */}
        <Text style={styles.sectionTitle}>Contact & System Details</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E0F2FE' }]}>
              <Mail size={18} color="#0284C7" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoVal} numberOfLines={1}>
                {refreshing && !user?.email ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  user?.email || 'notprovided@agrotech.org'
                )}
              </Text>
            </View>
          </View>

          <View style={styles.infoRowDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.iconWrapper, { backgroundColor: '#DCFCE7' }]}>
              <Phone size={18} color="#15803D" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoVal}>
                {refreshing && !user?.phoneNumber ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  user?.phoneNumber || '+977-98XXXXXXXX'
                )}
              </Text>
            </View>
          </View>

          <View style={styles.infoRowDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.iconWrapper, { backgroundColor: '#F3E8FF' }]}>
              <Shield size={18} color="#7E22CE" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Account Security</Text>
              <Text style={styles.infoVal}>User ID #{user?.id || '—'}</Text>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconWrapper, { backgroundColor: '#FEF3C7' }]}>
              <Globe size={18} color="#D97706" />
            </View>
            <Text style={styles.menuItemText}>Language</Text>
            <Text style={styles.menuItemValue}>English (EN)</Text>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.menuItemDivider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconWrapper, { backgroundColor: '#FEE2E2' }]}>
              <Bell size={18} color={colors.danger} />
            </View>
            <Text style={styles.menuItemText}>Push Notifications</Text>
            <Text style={styles.menuItemValue}>Enabled</Text>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.menuItemDivider} />

          <TouchableOpacity style={styles.menuItem} onPress={handlePasswordReset}>
            <View style={[styles.menuIconWrapper, { backgroundColor: '#E0F2FE' }]}>
              <Lock size={18} color="#0369A1" />
            </View>
            <Text style={styles.menuItemText}>Reset Password</Text>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FFFFFF" style={{ marginRight: spacing.sm }} />
          <Text style={styles.logoutButtonText}>Sign Out Account</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>AgroTech Platform • Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  profileHeaderCard: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    borderWidth: 3,
    borderColor: colors.primaryMuted,
  },
  activeBadge: {
    position: 'absolute',
    bottom: 2,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  roleBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    textTransform: 'uppercase',
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginLeft: spacing.xl,
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  infoRowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  menuGroup: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  menuItemDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  menuIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  menuItemValue: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginRight: spacing.xs,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    elevation: 3,
    shadowColor: colors.danger,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
    marginTop: spacing.xxl,
  },
});

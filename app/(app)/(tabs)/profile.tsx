import { roleLabel } from '@/lib/roles';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import {
  ChevronRight,
  LogOut,
  Mail,
  Phone,
  Shield,
  User,
} from 'lucide-react-native';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, role, logout } = useAuthStore();

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <User size={40} color="#6B7280" />
          </View>
          <Text style={styles.name}>{user?.fullName ?? 'User'}</Text>
          <Text style={styles.role}>{role ? roleLabel(role) : ''}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Mail size={18} color="#6B7280" />
            <Text style={styles.rowText}>{user?.email ?? '—'}</Text>
          </View>
          <View style={styles.row}>
            <Phone size={18} color="#6B7280" />
            <Text style={styles.rowText}>{user?.phoneNumber ?? '—'}</Text>
          </View>
          <View style={styles.row}>
            <Shield size={18} color="#6B7280" />
            <Text style={styles.rowText}>User ID: {user?.id ?? '—'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sign out</Text>
            <ChevronRight size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>AgroTech v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  role: {
    fontSize: 15,
    color: '#A4D65E',
    fontWeight: '600',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 14,
    padding: 16,
    gap: 16,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowText: { fontSize: 16, color: '#1F2937', flex: 1 },
  section: { paddingHorizontal: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 2,
  },
  logoutText: { flex: 1, fontSize: 16, color: '#EF4444', fontWeight: '500' },
  version: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginVertical: 32,
  },
});

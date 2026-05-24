import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { FarmerDashboard } from '@/components/dashboard/FarmerDashboard';
import { OwnerDashboard } from '@/components/dashboard/OwnerDashboard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuthStore } from '@/store/authStore';

export default function DashboardScreen() {
  const role = useAuthStore((s) => s.role);
  useDashboardData();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {role === 'admin' && <AdminDashboard />}
      {role === 'owner' && <OwnerDashboard />}
      {(role === 'farmer' || !role) && <FarmerDashboard />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
});

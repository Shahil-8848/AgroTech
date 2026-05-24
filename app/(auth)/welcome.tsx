import { router } from 'expo-router';
import { Shield, Tractor, User } from 'lucide-react-native';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { AppRole } from '@/types/api';

const ROLES: {
  role: AppRole;
  title: string;
  description: string;
  icon: typeof User;
  color: string;
}[] = [
  {
    role: 'farmer',
    title: 'Farmer',
    description: 'Browse and book agricultural equipment from local owners',
    icon: User,
    color: '#A4D65E',
  },
  {
    role: 'owner',
    title: 'Equipment Owner',
    description: 'List resources, manage bookings, and grow your rental business',
    icon: Tractor,
    color: '#A16207',
  },
  {
    role: 'admin',
    title: 'Administrator',
    description: 'Oversee platform bookings, users, and operations',
    icon: Shield,
    color: '#0EA5E9',
  },
];

export default function WelcomeScreen() {
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>AgroTech</Text>
        <Text style={styles.subtitle}>
          Connect farmers with equipment owners across Nepal
        </Text>
      </View>

      <Text style={styles.sectionLabel}>I am a...</Text>
      <View style={styles.roles}>
        {ROLES.map((item) => (
          <TouchableOpacity
            key={item.role}
            style={[
              styles.roleCard,
              selectedRole === item.role && {
                borderColor: item.color,
                borderWidth: 2,
              },
            ]}
            onPress={() => setSelectedRole(item.role)}
          >
            <View
              style={[styles.roleIcon, { backgroundColor: `${item.color}20` }]}
            >
              <item.icon size={28} color={item.color} />
            </View>
            <Text style={styles.roleTitle}>{item.title}</Text>
            <Text style={styles.roleDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, !selectedRole && styles.disabled]}
        disabled={!selectedRole}
        onPress={() =>
          router.push({
            pathname: '/(auth)/register',
            params: { role: selectedRole! },
          })
        }
      >
        <Text style={styles.primaryButtonText}>Create account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={styles.secondaryButtonText}>
          Already have an account? Sign in
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { paddingBottom: 40 },
  header: {
    alignItems: 'center',
    paddingTop: 72,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  title: { fontSize: 36, fontWeight: 'bold', color: '#1F2937' },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  roles: { paddingHorizontal: 20, gap: 12 },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    elevation: 2,
  },
  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  roleTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  roleDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#A4D65E',
    marginHorizontal: 20,
    marginTop: 28,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabled: { backgroundColor: '#D1D5DB' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  secondaryButton: { marginTop: 16, alignItems: 'center' },
  secondaryButtonText: { color: '#A16207', fontSize: 15, fontWeight: '500' },
});

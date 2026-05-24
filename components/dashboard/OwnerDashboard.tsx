import { useState } from 'react';
import { router } from 'expo-router';
import { ClipboardList, Package, Plus, RefreshCw, Wrench } from 'lucide-react-native';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { selectOwnerResources, useResourceStore } from '@/store/resourceStore';

export function OwnerDashboard() {
  const user = useAuthStore((s) => s.user);
  const resources = useResourceStore((s) => s.resources);
  const fetchResources = useResourceStore((s) => s.fetchResources);
  const createResource = useResourceStore((s) => s.createResource);
  const resourcesLoading = useResourceStore((s) => s.isLoading);
  const pendingBookings = useBookingStore((s) => s.pendingBookings);
  const fetchPending = useBookingStore((s) => s.fetchPendingBookings);

  // Modal & form states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const myResources = user
    ? selectOwnerResources(resources, user.id)
    : [];

  const handleCreateResource = async () => {
    if (!user) return;
    const nameTrimmed = newName.trim();
    const descTrimmed = newDescription.trim();

    if (nameTrimmed.length < 6) {
      setValidationError('Name must be at least 6 characters.');
      return;
    }
    if (nameTrimmed.length > 100) {
      setValidationError('Name must not exceed 100 characters.');
      return;
    }
    if (descTrimmed.length < 10) {
      setValidationError('Description must be at least 10 characters.');
      return;
    }
    if (descTrimmed.length > 500) {
      setValidationError('Description must not exceed 500 characters.');
      return;
    }

    setValidationError(null);
    setSubmitting(true);
    try {
      await createResource({
        name: nameTrimmed,
        description: descTrimmed,
        ownerId: user.id,
      });
      setAddModalVisible(false);
      setNewName('');
      setNewDescription('');
      Alert.alert('Success', 'Resource registered successfully!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not create resource';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Owner dashboard</Text>
          <Text style={styles.userName}>{user?.fullName ?? 'Owner'}</Text>
        </View>
        <Pressable
          style={styles.refreshBtn}
          onPress={() => {
            fetchResources(true);
            fetchPending();
          }}
        >
          <RefreshCw size={18} color="#A16207" />
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Package size={22} color="#A16207" />
          {resourcesLoading ? (
            <ActivityIndicator color="#A16207" style={styles.statLoader} />
          ) : (
            <Text style={styles.statValue}>{myResources.length}</Text>
          )}
          <Text style={styles.statLabel}>My resources</Text>
        </View>
        <View style={styles.statCard}>
          <ClipboardList size={22} color="#A4D65E" />
          <Text style={styles.statValue}>{pendingBookings.length}</Text>
          <Text style={styles.statLabel}>Pending requests</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Wrench size={28} color="#A16207" />
        <Text style={styles.cardTitle}>Manage your listings</Text>
        <Text style={styles.cardBody}>
          Review farmer reservation requests and register your tools or equipment for rental.
        </Text>
        <View style={styles.cardActionsRow}>
          <TouchableOpacity
            style={[styles.primaryButton, { flex: 1 }]}
            onPress={() => router.push('/(app)/(tabs)/bookings')}
          >
            <ClipboardList size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, { flex: 1 }]}
            onPress={() => {
              setValidationError(null);
              setAddModalVisible(true);
            }}
          >
            <Plus size={18} color="#A16207" />
            <Text style={styles.secondaryButtonText}>Add equipment</Text>
          </TouchableOpacity>
        </View>
      </View>


      {myResources.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Your listed resources</Text>
          {myResources.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={styles.listItem}
              onPress={() => router.push(`/equipment/${r.id}`)}
            >
              <Text style={styles.resourceName}>{r.name}</Text>
              <Text style={styles.resourceDesc} numberOfLines={1}>
                {r.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(app)/(tabs)/marketplace')}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Browse marketplace</Text>
      </TouchableOpacity>
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
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    elevation: 2,
  },
  statLoader: { marginVertical: 4 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  statLabel: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    gap: 10,
    alignItems: 'flex-start',
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  cardBody: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  primaryButton: {
    marginTop: 8,
    backgroundColor: '#A16207',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '600' },
  listSection: { paddingHorizontal: 20, marginTop: 20, gap: 8 },
  listTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    elevation: 1,
  },
  resourceName: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  resourceDesc: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  addButton: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 32,
    backgroundColor: '#A4D65E',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

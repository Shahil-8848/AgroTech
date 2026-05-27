import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  MessageSquare,
  Star,
  Tractor,
  Trash2,
  User,
} from 'lucide-react-native';
import { ApiError } from '@/services/apiClient';
import { formatApiDateTime, toApiDateTime } from '@/lib/dates';
import * as resourceService from '@/services/resourceService';
import * as reviewService from '@/services/reviewService';
import * as userService from '@/services/userService';
import { useAuthStore } from '@/store/authStore';
import {
  bookingsForResource,
  useBookingStore,
} from '@/store/bookingStore';
import { useResourceStore } from '@/store/resourceStore';
import type { ResourceDisplay, Review, UserProfile } from '@/types/api';

const PLACEHOLDER_IMAGE =
  'https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?auto=compress&cs=tinysrgb&w=800';

const BUSINESS_HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 6 AM to 8 PM (6 to 20)

function formatHour(hour: number): string {
  if (hour === 12) return '12:00 PM';
  return hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
}

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const resourceId = Number(id);

  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const getById = useResourceStore((s) => s.getById);
  const fetchResources = useResourceStore((s) => s.fetchResources);
  const updateResource = useResourceStore((s) => s.updateResource);
  const deleteResource = useResourceStore((s) => s.deleteResource);
  
  const bookings = useBookingStore((s) => s.bookings);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const createBooking = useBookingStore((s) => s.createBooking);

  const [resource, setResource] = useState<ResourceDisplay | null>(
    () => getById(resourceId) ?? null
  );
  const [loading, setLoading] = useState(!resource);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Reviews states
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Edit states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Booking picker states
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0); // 0 (tomorrow) to 6
  const [startHour, setStartHour] = useState(9); // default 9 AM
  const [endHour, setEndHour] = useState(17); // default 5 PM

  // Calculate reservation date list (next 7 days, starting from tomorrow)
  const availableDates = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      list.push(d);
    }
    return list;
  }, []);

  const loadReviewsAndUsers = async () => {
    setReviewsLoading(true);
    try {
      const [allReviews, allUsers] = await Promise.all([
        reviewService.getReviews().catch(() => []),
        userService.getUsers().catch(() => []),
      ]);
      const filtered = allReviews.filter((r) => r.resourceId === resourceId);
      setReviewsList(filtered);
      setUsersList(allUsers);
    } catch (err) {
      console.warn('Could not load reviews/users', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
    fetchBookings();
    loadReviewsAndUsers();
  }, [fetchResources, fetchBookings, resourceId]);

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

  const handleEditResource = async () => {
    if (!user || !resource) return;
    const nameTrimmed = editName.trim();
    const descTrimmed = editDescription.trim();

    if (nameTrimmed.length < 6) {
      setEditError('Name must be at least 6 characters.');
      return;
    }
    if (nameTrimmed.length > 100) {
      setEditError('Name must not exceed 100 characters.');
      return;
    }
    if (descTrimmed.length < 10) {
      setEditError('Description must be at least 10 characters.');
      return;
    }
    if (descTrimmed.length > 500) {
      setEditError('Description must not exceed 500 characters.');
      return;
    }

    setEditError(null);
    setEditSubmitting(true);
    try {
      const updated = await updateResource(resourceId, {
        name: nameTrimmed,
        description: descTrimmed,
        ownerId: user.id,
      });
      setResource((prev) => prev ? { ...prev, ...updated } : null);
      setEditModalVisible(false);
      Alert.alert('Success', 'Resource updated successfully!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update resource';
      Alert.alert('Error', msg);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteResource = () => {
    Alert.alert(
      'Delete Resource',
      'Are you sure you want to permanently delete this resource? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteResource(resourceId);
              Alert.alert('Deleted', 'Resource removed successfully.');
              router.back();
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Failed to delete resource';
              Alert.alert('Error', msg);
            }
          },
        },
      ]
    );
  };

  const handleOpenEdit = () => {
    if (!resource) return;
    setEditName(resource.name);
    setEditDescription(resource.description);
    setEditError(null);
    setEditModalVisible(true);
  };

  const handleOpenBooking = () => {
    if (!user) {
      Alert.alert('Sign in required', 'Please log in as a farmer to reserve.');
      return;
    }
    if (role !== 'farmer') {
      Alert.alert('Farmers only', 'Only farmer accounts can create reservations.');
      return;
    }
    setBookingModalVisible(true);
  };

  const handleReserve = async () => {
    if (!user) return;
    
    if (endHour <= startHour) {
      Alert.alert('Invalid Time', 'End time must be after start time.');
      return;
    }

    const date = availableDates[selectedDateIndex];
    
    const start = new Date(date);
    start.setHours(startHour, 0, 0, 0);
    
    const end = new Date(date);
    end.setHours(endHour, 0, 0, 0);

    setBookingLoading(true);
    try {
      await createBooking({
        resourceId,
        userId: user.id,
        startTime: toApiDateTime(start),
        endTime: toApiDateTime(end),
      });
      setBookingModalVisible(false);
      Alert.alert(
        'Request Sent',
        'Your booking request is pending owner approval.',
        [{ text: 'OK', onPress: () => router.push('/(app)/(tabs)/bookings') }]
      );
    } catch (err) {
      Alert.alert(
        'Booking Failed',
        err instanceof ApiError ? err.message : 'Could not create reservation'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) return;
    
    const commentTrimmed = newComment.trim();
    if (commentTrimmed.length > 500) {
      Alert.alert('Validation Error', 'Comment must not exceed 500 characters.');
      return;
    }

    setReviewSubmitting(true);
    try {
      await reviewService.createReview({
        resourceId,
        farmerId: user.id,
        rating: newRating,
        comment: commentTrimmed || undefined,
      });
      setNewComment('');
      setNewRating(5);
      Alert.alert('Thank you', 'Review submitted successfully!');
      // Reload reviews and main resource data
      loadReviewsAndUsers();
      fetchResources(true);
    } catch (err) {
      Alert.alert(
        'Submission Failed',
        err instanceof Error ? err.message : 'Could not submit review'
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const getFarmerName = (farmerId: number) => {
    return usersList.find((u) => u.id === farmerId)?.fullName ?? `Farmer #${farmerId}`;
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

  const isOwner = user && user.id === resource.ownerId;

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
          <View style={styles.titleRow}>
            <Text style={styles.title}>{resource.name}</Text>
          </View>
          
          <Text style={styles.description}>{resource.description}</Text>

          <View style={styles.ownerRow}>
            <User size={18} color="#6B7280" />
            <Text style={styles.ownerText}>Listed by: {resource.ownerName}</Text>
          </View>

          {resource.averageRating != null ? (
            <View style={styles.ratingRow}>
              <Star size={16} color="#FFC107" fill="#FFC107" />
              <Text style={styles.ratingText}>
                {resource.averageRating.toFixed(1)} ({resource.reviewCount}{' '}
                {resource.reviewCount === 1 ? 'review' : 'reviews'})
              </Text>
            </View>
          ) : (
            <View style={styles.ratingRow}>
              <Star size={16} color="#9CA3AF" />
              <Text style={styles.noRatingText}>No reviews yet</Text>
            </View>
          )}

          {/* Owner Actions Section */}
          {isOwner ? (
            <View style={styles.ownerActionsCard}>
              <Text style={styles.ownerActionsTitle}>Listing Management</Text>
              <View style={styles.ownerActionsButtons}>
                <TouchableOpacity
                  style={[styles.ownerBtn, styles.editBtn]}
                  onPress={handleOpenEdit}
                >
                  <Edit size={16} color="#A16207" />
                  <Text style={styles.editBtnText}>Edit Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.ownerBtn, styles.deleteBtn]}
                  onPress={handleDeleteResource}
                >
                  <Trash2 size={16} color="#DC2626" />
                  <Text style={styles.deleteBtnText}>Delete Resource</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {/* Schedule Section */}
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
                  <View style={styles.scheduleHeaderRow}>
                    <Text style={styles.scheduleStatus}>{b.status}</Text>
                    {b.farmerName ? (
                      <Text style={styles.scheduleFarmer}>Reserver: {b.farmerName}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.scheduleTime}>
                    {formatApiDateTime(b.startTime)} →{' '}
                    {formatApiDateTime(b.endTime)}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* Reviews List Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MessageSquare size={20} color="#A4D65E" />
              <Text style={styles.sectionTitle}>Reviews</Text>
            </View>
            {reviewsLoading ? (
              <ActivityIndicator color="#A4D65E" style={{ marginVertical: 10 }} />
            ) : reviewsList.length === 0 ? (
              <Text style={styles.scheduleEmpty}>No comments listed for this resource.</Text>
            ) : (
              reviewsList.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewFarmer}>{getFarmerName(review.farmerId)}</Text>
                    <View style={styles.reviewStars}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={12}
                          color={idx < review.rating ? '#FFC107' : '#E5E7EB'}
                          fill={idx < review.rating ? '#FFC107' : 'transparent'}
                        />
                      ))}
                    </View>
                  </View>
                  {review.comment ? (
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  ) : (
                    <Text style={styles.reviewCommentMuted}>No written review comments.</Text>
                  )}
                </View>
              ))
            )}
          </View>

          {/* Leave a Review (Farmers Only) */}
          {role === 'farmer' ? (
            <View style={styles.section}>
              <Text style={styles.reviewFormTitle}>Rate this Equipment</Text>
              
              <View style={styles.starRatingInputRow}>
                {Array.from({ length: 5 }).map((_, idx) => {
                  const starVal = idx + 1;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setNewRating(starVal)}
                      activeOpacity={0.7}
                    >
                      <Star
                        size={32}
                        color={starVal <= newRating ? '#FFC107' : '#D1D5DB'}
                        fill={starVal <= newRating ? '#FFC107' : 'transparent'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                style={[styles.input, styles.commentInput]}
                placeholder="Leave a review comment (optional)..."
                value={newComment}
                onChangeText={setNewComment}
                multiline={true}
                numberOfLines={3}
                maxLength={500}
              />

              <TouchableOpacity
                style={[styles.submitReviewBtn, reviewSubmitting && styles.disabledBtn]}
                onPress={handleSubmitReview}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitReviewText}>Submit Review</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Footer Booking Trigger */}
      {role === 'farmer' ? (
        <View style={styles.footer}>
          <Pressable
            style={[styles.reserveBtn, bookingLoading && styles.disabled]}
            onPress={handleOpenBooking}
            disabled={bookingLoading}
          >
            <Tractor size={20} color="#FFFFFF" />
            <Text style={styles.reserveText}>Book Equipment</Text>
          </Pressable>
        </View>
      ) : null}

      {/* Owner Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Equipment Details</Text>

            {editError ? (
              <Text style={styles.errorText}>{editError}</Text>
            ) : null}

            <Text style={styles.inputLabel}>Name (min 6 characters)</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editName}
              onChangeText={setEditName}
              maxLength={100}
            />

            <Text style={styles.inputLabel}>Description (min 10 characters)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={editDescription}
              onChangeText={setEditDescription}
              multiline={true}
              numberOfLines={4}
              maxLength={500}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setEditModalVisible(false)}
                disabled={editSubmitting}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.submitBtn]}
                onPress={handleEditResource}
                disabled={editSubmitting}
              >
                {editSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Farmer Booking Modal */}
      <Modal
        visible={bookingModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Reservation Time</Text>

            {/* Date Slider Selector */}
            <Text style={styles.inputLabel}>Select Date</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datePickerContainer}
            >
              {availableDates.map((date, idx) => {
                const isSelected = selectedDateIndex === idx;
                const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
                const dayNum = date.getDate();
                const monthName = date.toLocaleDateString(undefined, { month: 'short' });

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.dateCard, isSelected && styles.dateCardActive]}
                    onPress={() => setSelectedDateIndex(idx)}
                  >
                    <Text style={[styles.dateDayText, isSelected && styles.dateActiveText]}>{dayName}</Text>
                    <Text style={[styles.dateNumberText, isSelected && styles.dateActiveText]}>{dayNum}</Text>
                    <Text style={[styles.dateMonthText, isSelected && styles.dateActiveText]}>{monthName}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Time Grid Picker */}
            <Text style={styles.inputLabel}>Start Time</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeScroll}>
              {BUSINESS_HOURS.slice(0, -1).map((hour) => {
                const isSelected = startHour === hour;
                return (
                  <TouchableOpacity
                    key={hour}
                    style={[styles.timeOption, isSelected && styles.timeOptionActive]}
                    onPress={() => {
                      setStartHour(hour);
                      if (endHour <= hour) {
                        setEndHour(hour + 1);
                      }
                    }}
                  >
                    <Text style={[styles.timeOptionText, isSelected && styles.timeOptionTextActive]}>
                      {formatHour(hour)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.inputLabel}>End Time</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeScroll}>
              {BUSINESS_HOURS.filter(h => h > startHour).map((hour) => {
                const isSelected = endHour === hour;
                return (
                  <TouchableOpacity
                    key={hour}
                    style={[styles.timeOption, isSelected && styles.timeOptionActive]}
                    onPress={() => setEndHour(hour)}
                  >
                    <Text style={[styles.timeOptionText, isSelected && styles.timeOptionTextActive]}>
                      {formatHour(hour)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Calculations Card */}
            <View style={styles.calcCard}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.calcText}>
                Duration: <Text style={{ fontWeight: '700' }}>{endHour - startHour} hours</Text>
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setBookingModalVisible(false)}
                disabled={bookingLoading}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.reserveSubmitBtn]}
                onPress={handleReserve}
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.reserveSubmitBtnText}>Confirm Booking</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#1F2937', flex: 1 },
  description: { fontSize: 15, lineHeight: 22, color: '#4B5563' },
  ownerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ownerText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingText: { fontSize: 14, color: '#1F2937', fontWeight: '600' },
  noRatingText: { fontSize: 14, color: '#6B7280' },
  section: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 10,
    elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  scheduleEmpty: { fontSize: 14, color: '#9CA3AF' },
  scheduleItem: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleStatus: { fontSize: 12, fontWeight: '700', color: '#A16207' },
  scheduleFarmer: { fontSize: 12, color: '#6B7280' },
  scheduleTime: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  // Owner card
  ownerActionsCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginTop: 12,
    gap: 12,
  },
  ownerActionsTitle: { fontSize: 15, fontWeight: '700', color: '#92400E' },
  ownerActionsButtons: { flexDirection: 'row', gap: 10 },
  ownerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  editBtn: { backgroundColor: '#FFFFFF', borderColor: '#F59E0B' },
  editBtnText: { color: '#B45309', fontWeight: '600', fontSize: 13 },
  deleteBtn: { backgroundColor: '#FEE2E2', borderColor: '#FECACA' },
  deleteBtnText: { color: '#DC2626', fontWeight: '600', fontSize: 13 },
  // Review UI
  reviewItem: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 10,
    gap: 4,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewFarmer: { fontSize: 14, fontWeight: '600', color: '#374151' },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewComment: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
  reviewCommentMuted: { fontSize: 13, color: '#9CA3AF', fontStyle: 'italic' },
  reviewFormTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  starRatingInputRow: { flexDirection: 'row', gap: 8, marginVertical: 6 },
  commentInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  submitReviewBtn: {
    backgroundColor: '#A4D65E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitReviewText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  disabledBtn: { opacity: 0.6 },
  // Footer
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    gap: 12,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginTop: 4 },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2937',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: { backgroundColor: '#F3F4F6' },
  cancelBtnText: { color: '#4B5563', fontWeight: '600' },
  submitBtn: { backgroundColor: '#A16207' },
  submitBtnText: { color: '#FFFFFF', fontWeight: '600' },
  reserveSubmitBtn: { backgroundColor: '#A4D65E' },
  reserveSubmitBtnText: { color: '#FFFFFF', fontWeight: '600' },
  // Date slider styles
  datePickerContainer: { gap: 8, paddingVertical: 4 },
  dateCard: {
    width: 60,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateCardActive: {
    backgroundColor: '#A4D65E',
    borderColor: '#A4D65E',
  },
  dateDayText: { fontSize: 11, color: '#6B7280', fontWeight: '600' },
  dateNumberText: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginVertical: 2 },
  dateMonthText: { fontSize: 10, color: '#6B7280', textTransform: 'uppercase' },
  dateActiveText: { color: '#FFFFFF' },
  // Time selector styles
  timeScroll: { gap: 6, paddingVertical: 4 },
  timeOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeOptionActive: {
    backgroundColor: '#E2F0D9',
    borderColor: '#A4D65E',
  },
  timeOptionText: { fontSize: 13, color: '#4B5563', fontWeight: '500' },
  timeOptionTextActive: { color: '#2C5E1A', fontWeight: '700' },
  calcCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 4,
  },
  calcText: { fontSize: 14, color: '#4B5563' },
});

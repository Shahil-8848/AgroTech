import { asRecord, asRecordArray, pickNumber, pickString } from '@/lib/normalize';
import type {
  AdminBookingOverview,
  AuthResponse,
  Booking,
  BookingStatus,
  Resource,
  Review,
  UserProfile,
} from '@/types/api';

export function mapAuthResponse(raw: unknown): AuthResponse {
  const r = asRecord(raw);
  return {
    token: pickString(r, 'token', 'Token', 'accessToken', 'AccessToken'),
    refreshToken: pickString(r, 'refreshToken', 'RefreshToken'),
    role: pickString(r, 'role', 'Role'),
    fullName: pickString(r, 'fullName', 'FullName'),
  };
}

export function mapUser(raw: unknown): UserProfile {
  const r = asRecord(raw);
  return {
    id: pickNumber(r, 'id', 'Id'),
    fullName: pickString(r, 'fullName', 'FullName'),
    email: pickString(r, 'email', 'Email'),
    role: pickString(r, 'role', 'Role'),
    phoneNumber: pickString(r, 'phoneNumber', 'PhoneNumber'),
  };
}

export function mapUserList(raw: unknown): UserProfile[] {
  return asRecordArray(raw).map(mapUser);
}

export function mapResource(raw: unknown): Resource {
  const r = asRecord(raw);
  return {
    id: pickNumber(r, 'id', 'Id'),
    name: pickString(r, 'name', 'Name'),
    description: pickString(r, 'description', 'Description'),
    ownerId: pickNumber(r, 'ownerId', 'OwnerId'),
  };
}

export function mapResourceList(raw: unknown): Resource[] {
  return asRecordArray(raw).map(mapResource);
}

function mapBookingStatus(value: unknown): BookingStatus {
  const s = String(value ?? 'Pending');
  if (s === 'Approved' || s === 'Rejected') return s;
  return 'Pending';
}

export function mapBooking(raw: unknown): Booking {
  const r = asRecord(raw);
  const mapped: Booking = {
    id: pickNumber(r, 'id', 'Id', 'bookingId', 'BookingId'),
    resourceId: pickNumber(r, 'resourceId', 'ResourceId'),
    userId: pickNumber(r, 'userId', 'UserId', 'farmerId', 'FarmerId'),
    startTime: pickString(r, 'startTime', 'StartTime'),
    endTime: pickString(r, 'endTime', 'EndTime'),
    status: mapBookingStatus(r.status ?? r.Status),
    resourceName: pickString(r, 'resourceName', 'ResourceName') || undefined,
    farmerName: pickString(r, 'farmerName', 'FarmerName', 'userName', 'UserName') || undefined,
  };
  console.log(`[Mapper] Mapped booking ID ${mapped.id}:`, JSON.stringify(mapped));
  return mapped;
}

export function mapBookingList(raw: unknown): Booking[] {
  return asRecordArray(raw).map(mapBooking);
}

export function mapAdminBookingOverview(raw: unknown): AdminBookingOverview {
  const r = asRecord(raw);
  return {
    bookingId: pickNumber(r, 'bookingId', 'BookingId'),
    ownerName: pickString(r, 'ownerName', 'OwnerName') || null,
    resourceName: pickString(r, 'resourceName', 'ResourceName') || null,
    farmerName: pickString(r, 'farmerName', 'FarmerName') || null,
    startTime: pickString(r, 'startTime', 'StartTime'),
    endTime: pickString(r, 'endTime', 'EndTime'),
  };
}

export function mapAdminBookingOverviewList(
  raw: unknown
): AdminBookingOverview[] {
  return asRecordArray(raw).map(mapAdminBookingOverview);
}

export function mapReview(raw: unknown): Review {
  const r = asRecord(raw);
  return {
    id: pickNumber(r, 'id', 'Id'),
    resourceId: pickNumber(r, 'resourceId', 'ResourceId'),
    farmerId: pickNumber(r, 'farmerId', 'FarmerId'),
    rating: pickNumber(r, 'rating', 'Rating'),
    comment: pickString(r, 'comment', 'Comment') || null,
  };
}

export function mapReviewList(raw: unknown): Review[] {
  return asRecordArray(raw).map(mapReview);
}

export type ApiRole = 'Farmer' | 'Owner' | 'Admin';

export type AppRole = 'farmer' | 'owner' | 'admin';

export type BookingStatus = 'Pending' | 'Approved' | 'Rejected';

export interface AuthResponse {
  token: string;
  refreshToken: string;
  role: string;
  fullName: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
}

export interface UserCreateRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: string;
}

export interface Resource {
  id: number;
  name: string;
  description: string;
  ownerId: number;
}

/** Enriched resource for list/detail UI */
export interface ResourceDisplay extends Resource {
  ownerName: string;
  averageRating: number | null;
  reviewCount: number;
}

export interface ResourceCreateRequest {
  name: string;
  description: string;
  ownerId: number;
}

export interface Booking {
  id: number;
  resourceId: number;
  userId: number;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  resourceName?: string;
  farmerName?: string;
}

export interface BookingCreateRequest {
  resourceId: number;
  userId: number;
  startTime: string;
  endTime: string;
}

export interface BookingStatusUpdateRequest {
  bookingId: number;
  newStatus: BookingStatus;
}

export interface AdminBookingOverview {
  bookingId: number;
  ownerName: string | null;
  resourceName: string | null;
  farmerName: string | null;
  startTime: string;
  endTime: string;
}

export interface Review {
  id: number;
  resourceId: number;
  farmerId: number;
  rating: number;
  comment: string | null;
}

export interface ReviewCreateRequest {
  resourceId: number;
  farmerId: number;
  rating: number;
  comment?: string;
}

export interface ApiErrorBody {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
}

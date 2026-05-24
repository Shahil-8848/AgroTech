import { urls } from '@/api/urls';
import {
  mapAdminBookingOverviewList,
  mapBooking,
  mapBookingList,
} from '@/lib/mappers';
import { apiRequest } from '@/services/apiClient';
import type {
  AdminBookingOverview,
  Booking,
  BookingCreateRequest,
  BookingStatusUpdateRequest,
} from '@/types/api';

export async function getBookings(): Promise<Booking[]> {
  const raw = await apiRequest<unknown>(urls.booking.list);
  return mapBookingList(raw);
}

export async function getBookingById(id: number): Promise<Booking> {
  const raw = await apiRequest<unknown>(urls.booking.byId(id));
  return mapBooking(raw);
}

export async function getPendingBookings(): Promise<Booking[]> {
  const raw = await apiRequest<unknown>(urls.booking.pending);
  return mapBookingList(raw);
}

export async function getAdminBookingDashboard(): Promise<
  AdminBookingOverview[]
> {
  const raw = await apiRequest<unknown>(urls.booking.adminDashboard);
  return mapAdminBookingOverviewList(raw);
}

export async function createBooking(
  data: BookingCreateRequest
): Promise<Booking> {
  const raw = await apiRequest<unknown>(urls.booking.list, {
    method: 'POST',
    body: data,
  });
  return mapBooking(raw);
}

export async function updateBookingStatus(
  data: BookingStatusUpdateRequest
): Promise<void> {
  await apiRequest<void>(urls.booking.updateStatus, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteBooking(id: number): Promise<void> {
  await apiRequest<void>(urls.booking.byId(id), { method: 'DELETE' });
}

export async function adminDeleteBooking(id: number): Promise<void> {
  await apiRequest<void>(urls.booking.adminDelete(id), { method: 'DELETE' });
}

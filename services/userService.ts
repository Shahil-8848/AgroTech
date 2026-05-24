import { urls } from '@/api/urls';
import { mapUser, mapUserList } from '@/lib/mappers';
import { apiRequest } from '@/services/apiClient';
import type { UserCreateRequest, UserProfile } from '@/types/api';

export async function getUsers(): Promise<UserProfile[]> {
  const raw = await apiRequest<unknown>(urls.user.list);
  return mapUserList(raw);
}

export async function getUserById(id: number): Promise<UserProfile> {
  const raw = await apiRequest<unknown>(urls.user.byId(id));
  return mapUser(raw);
}

export async function searchUsers(name: string): Promise<UserProfile[]> {
  const raw = await apiRequest<unknown>(urls.user.search(name));
  return mapUserList(raw);
}

export async function createUser(data: UserCreateRequest): Promise<UserProfile> {
  const raw = await apiRequest<unknown>(urls.user.list, {
    method: 'POST',
    body: data,
  });
  return mapUser(raw);
}

export async function updateUser(
  id: number,
  data: UserCreateRequest
): Promise<UserProfile> {
  const raw = await apiRequest<unknown>(urls.user.byId(id), {
    method: 'PUT',
    body: data,
  });
  return mapUser(raw);
}

export async function deleteUser(id: number): Promise<void> {
  await apiRequest<void>(urls.user.byId(id), { method: 'DELETE' });
}

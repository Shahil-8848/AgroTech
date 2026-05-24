import { urls } from '@/api/urls';
import { mapResource, mapResourceList } from '@/lib/mappers';
import { apiRequest } from '@/services/apiClient';
import type { Resource, ResourceCreateRequest } from '@/types/api';

export async function getResources(): Promise<Resource[]> {
  const raw = await apiRequest<unknown>(urls.resource.list);
  return mapResourceList(raw);
}

export async function getResourceById(id: number): Promise<Resource> {
  const raw = await apiRequest<unknown>(urls.resource.byId(id));
  return mapResource(raw);
}

export async function createResource(
  data: ResourceCreateRequest
): Promise<Resource> {
  const raw = await apiRequest<unknown>(urls.resource.list, {
    method: 'POST',
    body: data,
  });
  return mapResource(raw);
}

export async function updateResource(
  id: number,
  data: ResourceCreateRequest
): Promise<Resource> {
  const raw = await apiRequest<unknown>(urls.resource.byId(id), {
    method: 'PUT',
    body: data,
  });
  return mapResource(raw);
}

export async function deleteResource(id: number): Promise<void> {
  await apiRequest<void>(urls.resource.byId(id), { method: 'DELETE' });
}

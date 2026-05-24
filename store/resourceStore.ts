import { create } from 'zustand';
import { buildResourceDisplayList } from '@/lib/resourceDisplay';
import * as resourceService from '@/services/resourceService';
import * as reviewService from '@/services/reviewService';
import * as userService from '@/services/userService';
import type { Resource, ResourceCreateRequest, ResourceDisplay } from '@/types/api';

interface ResourceState {
  resources: ResourceDisplay[];
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;

  fetchResources: (force?: boolean) => Promise<void>;
  getById: (id: number) => ResourceDisplay | undefined;
  createResource: (data: ResourceCreateRequest) => Promise<Resource>;
  updateResource: (id: number, data: ResourceCreateRequest) => Promise<Resource>;
  deleteResource: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: [],
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  fetchResources: async (force = false) => {
    const { isLoading, lastFetchedAt, resources } = get();
    if (isLoading) return;
    if (!force && lastFetchedAt && resources.length > 0) return;

    set({ isLoading: true, error: null });

    try {
      const [rawResources, users, reviews] = await Promise.all([
        resourceService.getResources(),
        userService.getUsers().catch(() => []),
        reviewService.getReviews().catch(() => []),
      ]);

      const enriched = buildResourceDisplayList(
        rawResources,
        users,
        reviews
      );

      set({
        resources: enriched,
        isLoading: false,
        lastFetchedAt: Date.now(),
      });
    } catch (err) {
      set({
        isLoading: false,
        error:
          err instanceof Error ? err.message : 'Failed to load resources',
      });
    }
  },

  getById: (id) => get().resources.find((r) => r.id === id),

  createResource: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await resourceService.createResource(data);
      set({ isLoading: false });
      await get().fetchResources(true);
      return res;
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to create resource',
      });
      throw err;
    }
  },

  updateResource: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await resourceService.updateResource(id, data);
      set({ isLoading: false });
      await get().fetchResources(true);
      return res;
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to update resource',
      });
      throw err;
    }
  },

  deleteResource: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await resourceService.deleteResource(id);
      set({ isLoading: false });
      await get().fetchResources(true);
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to delete resource',
      });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

export function selectOwnerResources(
  resources: ResourceDisplay[],
  ownerId: number
): ResourceDisplay[] {
  return resources.filter((r) => r.ownerId === ownerId);
}


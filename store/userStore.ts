import { create } from 'zustand';
import * as userService from '@/services/userService';
import type { UserCreateRequest, UserProfile } from '@/types/api';

interface UserAdminState {
  users: UserProfile[];
  isLoading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;
  createUser: (data: UserCreateRequest) => Promise<UserProfile>;
  removeUser: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserAdminState>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await userService.getUsers();
      set({ users, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load users',
      });
    }
  },

  createUser: async (data) => {
    const user = await userService.createUser(data);
    set((state) => ({ users: [...state.users, user] }));
    return user;
  },

  removeUser: async (id) => {
    await userService.deleteUser(id);
    set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
  },

  clearError: () => set({ error: null }),
}));

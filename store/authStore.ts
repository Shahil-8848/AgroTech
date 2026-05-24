import { create } from 'zustand';
import { getUserIdFromToken, isTokenExpired } from '@/lib/jwt';
import { toAppRole } from '@/lib/roles';
import * as storage from '@/lib/storage';
import {
  setAccessTokenGetter,
  setRefreshHandler,
} from '@/services/apiClient';
import * as authService from '@/services/authService';
import * as userService from '@/services/userService';
import type { AppRole, AuthResponse, UserProfile } from '@/types/api';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: UserProfile | null;
  role: AppRole | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isHydrating: boolean;

  applyAuthResponse: (response: AuthResponse) => Promise<void>;
  hydrate: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  logout: () => Promise<void>;
}

async function loadProfile(
  accessToken: string,
  response: AuthResponse
): Promise<UserProfile> {
  const userId = getUserIdFromToken(accessToken);
  if (userId) {
    try {
      return await userService.getUserById(userId);
    } catch {
      // Profile fetch can fail briefly; fall back to auth payload.
    }
  }

  return {
    id: userId ?? 0,
    fullName: response.fullName,
    email: '',
    role: response.role,
    phoneNumber: '',
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  role: null,
  tokens: null,
  isAuthenticated: false,
  isHydrating: true,

  applyAuthResponse: async (response) => {
    await storage.saveTokens(response.token, response.refreshToken);

    const tokens = {
      accessToken: response.token,
      refreshToken: response.refreshToken,
    };

    const user = await loadProfile(response.token, response);
    const role = toAppRole(user.role || response.role);

    set({
      tokens,
      user,
      role,
      isAuthenticated: true,
      isHydrating: false,
    });
  },

  hydrate: async () => {
    set({ isHydrating: true });

    try {
      const stored = await storage.getTokens();
      if (!stored.accessToken || !stored.refreshToken) {
        set({
          user: null,
          role: null,
          tokens: null,
          isAuthenticated: false,
          isHydrating: false,
        });
        return;
      }

      set({
        tokens: {
          accessToken: stored.accessToken,
          refreshToken: stored.refreshToken,
        },
      });

      if (isTokenExpired(stored.accessToken)) {
        const refreshed = await get().refreshSession();
        if (!refreshed) {
          await storage.clearTokens();
          set({
            user: null,
            role: null,
            tokens: null,
            isAuthenticated: false,
            isHydrating: false,
          });
          return;
        }
      }

      const { tokens } = get();
      if (!tokens) {
        set({ isHydrating: false, isAuthenticated: false });
        return;
      }

      const userId = getUserIdFromToken(tokens.accessToken);
      if (!userId) {
        throw new Error('Invalid session');
      }

      const user = await userService.getUserById(userId);

      set({
        user,
        role: toAppRole(user.role),
        isAuthenticated: true,
        isHydrating: false,
      });
    } catch {
      await storage.clearTokens();
      set({
        user: null,
        role: null,
        tokens: null,
        isAuthenticated: false,
        isHydrating: false,
      });
    }
  },

  refreshSession: async () => {
    const { tokens } = get();
    if (!tokens?.accessToken || !tokens.refreshToken) {
      return false;
    }

    try {
      const response = await authService.refreshToken({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
      await get().applyAuthResponse(response);
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    await storage.clearTokens();
    set({
      user: null,
      role: null,
      tokens: null,
      isAuthenticated: false,
      isHydrating: false,
    });
  },
}));

setAccessTokenGetter(() => useAuthStore.getState().tokens?.accessToken ?? null);
setRefreshHandler(() => useAuthStore.getState().refreshSession());

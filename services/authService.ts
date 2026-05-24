import { urls } from '@/api/urls';
import { mapAuthResponse } from '@/lib/mappers';
import { apiRequest } from '@/services/apiClient';
import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from '@/types/api';

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const raw = await apiRequest<unknown>(urls.auth.register, {
    method: 'POST',
    body: data,
    auth: false,
  });
  return mapAuthResponse(raw);
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const raw = await apiRequest<unknown>(urls.auth.login, {
    method: 'POST',
    body: data,
    auth: false,
  });
  return mapAuthResponse(raw);
}

export async function refreshToken(
  data: RefreshTokenRequest
): Promise<AuthResponse> {
  const raw = await apiRequest<unknown>(urls.auth.refreshToken, {
    method: 'POST',
    body: data,
    auth: false,
    skipRefresh: true,
  });
  return mapAuthResponse(raw);
}

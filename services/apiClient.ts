import { API_BASE_URL, API_PREFIX } from '@/constants/config';
import type { ApiErrorBody } from '@/types/api';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
  skipRefresh?: boolean;
}

let accessTokenGetter: () => string | null = () => null;
let refreshHandler: (() => Promise<boolean>) | null = null;

export function setAccessTokenGetter(getter: () => string | null): void {
  accessTokenGetter = getter;
}

export function setRefreshHandler(handler: () => Promise<boolean>): void {
  refreshHandler = handler;
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorBody | string;
    if (typeof data === 'string') return data;
    if (data.errors) {
      const first = Object.values(data.errors).flat()[0];
      if (first) return first;
    }
    return data.message ?? data.title ?? response.statusText;
  } catch {
    return response.statusText || 'Request failed';
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, auth = true, skipRefresh = false } = options;

  const execute = async (): Promise<Response> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    if (auth) {
      const token = accessTokenGetter();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    console.log(`[API Request] ${method} ${API_BASE_URL}${API_PREFIX}${path}`, body !== undefined ? JSON.stringify(body) : '');
    const token = auth ? accessTokenGetter() : null;
    if (auth && token) {
      // Log token prefix for debugging auth issues
      console.log(`[API Auth] Using token starting with: ${token.substring(0, 15)}...`);
    }

    return fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let response;
  try {
    response = await execute();
    console.log(`[API Response Status] ${method} ${path} -> ${response.status} ${response.statusText}`);
  } catch (fetchErr) {
    console.error(`[API Network Error] ${method} ${path} failed:`, fetchErr);
    throw fetchErr;
  }

  if (
    response.status === 401 &&
    auth &&
    !skipRefresh &&
    refreshHandler
  ) {
    console.log(`[API Refresh] Token expired (401), attempting token refresh...`);
    const refreshed = await refreshHandler();
    if (refreshed) {
      console.log(`[API Refresh] Token refreshed successfully. Retrying request...`);
      response = await execute();
      console.log(`[API Response Status (Retry)] ${method} ${path} -> ${response.status} ${response.statusText}`);
    } else {
      console.warn(`[API Refresh] Token refresh failed.`);
    }
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    console.error(`[API Error Response] ${method} ${path} -> ${response.status}: ${message}`);
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

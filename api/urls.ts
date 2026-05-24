/** API route paths (relative to `/api`). Pair with `API_BASE_URL` in apiClient. */

export const urls = {
  auth: {
    register: '/Auth/register',
    login: '/Auth/login',
    refreshToken: '/Auth/refresh-token',
  },
  user: {
    list: '/User',
    byId: (id: number) => `/User/${id}`,
    search: (name: string) =>
      `/User/search?name=${encodeURIComponent(name)}`,
    resetPassword: (email: string, password: string) =>
      `/User/Reset-Password?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
  },
  resource: {
    list: '/Resource',
    byId: (id: number) => `/Resource/${id}`,
  },
  booking: {
    list: '/Booking',
    byId: (id: number) => `/Booking/${id}`,
    pending: '/Booking/pending',
    updateStatus: '/Booking/update-status',
    adminDashboard: '/Booking/admin-dashboard',
    adminDelete: (id: number) => `/Booking/admin-dashboard/delete/${id}`,
  },
  review: {
    list: '/Review',
    byId: (id: number) => `/Review/${id}`,
  },
} as const;

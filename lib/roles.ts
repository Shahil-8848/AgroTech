import type { ApiRole, AppRole } from '@/types/api';

export function toAppRole(role: string): AppRole {
  const normalized = role.trim().toLowerCase();
  if (normalized === 'owner') return 'owner';
  if (normalized === 'admin') return 'admin';
  return 'farmer';
}

export function toApiRole(role: AppRole): ApiRole {
  switch (role) {
    case 'owner':
      return 'Owner';
    case 'admin':
      return 'Admin';
    default:
      return 'Farmer';
  }
}

/** Register endpoint expects `farmer` | `owner` | `admin` (case-insensitive). */
export function toRegisterRole(role: AppRole): string {
  return role;
}

export function roleLabel(role: AppRole): string {
  switch (role) {
    case 'owner':
      return 'Equipment Owner';
    case 'admin':
      return 'Administrator';
    default:
      return 'Farmer';
  }
}

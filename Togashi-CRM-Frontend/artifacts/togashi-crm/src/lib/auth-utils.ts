import type { Permission } from './permissions';
import type { RoleId } from './roles';
import { getRolePermissions } from './roles';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: RoleId;
  permissions: Permission[];
}

export function hasPermission(user: AppUser | null, permission: Permission): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

export function hasAnyPermission(user: AppUser | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.some((p) => user.permissions.includes(p));
}

export function hasAllPermissions(user: AppUser | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.every((p) => user.permissions.includes(p));
}

export function canAccessModule(user: AppUser | null, modulePermission: Permission): boolean {
  return hasPermission(user, modulePermission);
}

export function getUserPermissions(roleId: RoleId): Permission[] {
  return getRolePermissions(roleId);
}

export const ROLE_LABELS: Record<RoleId, string> = {
  ADMIN: 'Administrator',
  EXECUTIVE: 'CEO / Executive',
  BUSINESS_DEVELOPMENT: 'Business Development',
  SALES: 'Sales',
  PROJECT_MANAGER: 'Project Manager',
  PROJECT_TEAM: 'Project Team Member',
  FINANCE: 'Finance',
  CUSTOMER_SERVICE: 'Customer Service',
  VIEWER: 'Viewer',
};

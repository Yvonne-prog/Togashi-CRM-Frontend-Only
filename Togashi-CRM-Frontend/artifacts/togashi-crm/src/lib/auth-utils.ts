import type { Permission } from './permissions';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  accountType: 'ADMIN' | 'USER';
  jobTitle?: string;
  permissions: Permission[];
}

export function hasPermission(user: AppUser | null, permission: Permission): boolean {
  if (!user) return false;
  if (user.accountType === 'ADMIN') return true;
  return user.permissions.includes(permission);
}

export function hasAnyPermission(user: AppUser | null, permissions: Permission[]): boolean {
  if (!user) return false;
  if (user.accountType === 'ADMIN') return true;
  return permissions.some((p) => user.permissions.includes(p));
}

export function hasAllPermissions(user: AppUser | null, permissions: Permission[]): boolean {
  if (!user) return false;
  if (user.accountType === 'ADMIN') return true;
  return permissions.every((p) => user.permissions.includes(p));
}

export function hasModuleAccess(user: AppUser | null, module: string): boolean {
  if (!user) return false;
  if (user.accountType === 'ADMIN') return true;
  return user.permissions.includes(`${module}.view` as Permission);
}

export function canViewFinancialField(user: AppUser | null, field: 'invoice_amounts' | 'receipt_amounts' | 'revenue' | 'outstanding_balances'): boolean {
  if (!user) return false;
  if (user.accountType === 'ADMIN') return true;
  const permMap: Record<string, Permission> = {
    invoice_amounts: 'financial.view_invoice_amounts',
    receipt_amounts: 'financial.view_receipt_amounts',
    revenue: 'financial.view_revenue',
    outstanding_balances: 'financial.view_outstanding_balances',
  };
  return user.permissions.includes(permMap[field]);
}

import {
  createContext, useContext, ReactNode, useEffect, useMemo, useState,
} from 'react';
import { useLocation } from 'wouter';
import { RefreshCircle } from 'iconsax-react';
import type { Permission } from '@/lib/permissions';
import { ALL_PERMISSIONS } from '@/lib/permissions';
import type { RoleId } from '@/lib/roles';
import { getRolePermissions, ROLES } from '@/lib/roles';
import { ROLE_LABELS as RLABELS } from '@/lib/auth-utils';

export interface FrontendUser {
  id: string;
  name: string;
  email: string;
  role: RoleId;
  permissions: Permission[];
  roleLabel: string;
}

interface AuthContextType {
  user: FrontendUser | null;
  isLoading: boolean;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: () => undefined,
  hasPermission: () => false,
  hasAnyPermission: () => false,
});

export const useAuth = () => useContext(AuthContext);

function normaliseRole(value: string): RoleId {
  const upper = value.toUpperCase();

  const knownIds: RoleId[] = ['ADMIN', 'EXECUTIVE', 'BUSINESS_DEVELOPMENT', 'SALES', 'PROJECT_MANAGER', 'PROJECT_TEAM', 'FINANCE', 'CUSTOMER_SERVICE', 'VIEWER'];

  if (knownIds.includes(upper as RoleId)) {
    return upper as RoleId;
  }

  const labelMap: Record<string, RoleId> = {
    'administrator': 'ADMIN',
    'ceo / executive': 'EXECUTIVE',
    'executive': 'EXECUTIVE',
    'business development': 'BUSINESS_DEVELOPMENT',
    'sales': 'SALES',
    'project manager': 'PROJECT_MANAGER',
    'project team member': 'PROJECT_TEAM',
    'finance': 'FINANCE',
    'customer service': 'CUSTOMER_SERVICE',
    'viewer': 'VIEWER',
  };

  return labelMap[value.toLowerCase()] || 'ADMIN';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<FrontendUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated =
      localStorage.getItem('togashi_crm_authenticated') === 'true';
    const storedUser = localStorage.getItem('togashi_crm_user');

    if (!isAuthenticated || !storedUser) {
      setUser(null);
      setIsLoading(false);
      setLocation('/login');
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      const normalisedRole = normaliseRole(parsed.role || 'ADMIN');
      const permissions = normalisedRole === 'ADMIN'
        ? [...ALL_PERMISSIONS]
        : getRolePermissions(normalisedRole);
      const roleLabel = RLABELS[normalisedRole] || ROLES[normalisedRole]?.label || 'Administrator';

      setUser({
        id: parsed.id || 'demo-admin-001',
        name: parsed.name || 'Togashi Administrator',
        email: parsed.email || 'admin@togashi.local',
        role: normalisedRole,
        permissions,
        roleLabel,
      });
    } catch {
      localStorage.removeItem('togashi_crm_authenticated');
      localStorage.removeItem('togashi_crm_user');
      setUser(null);
      setLocation('/login');
    } finally {
      setIsLoading(false);
    }
  }, [setLocation]);

  const logout = () => {
    localStorage.removeItem('togashi_crm_authenticated');
    localStorage.removeItem('togashi_crm_user');
    setUser(null);
    setLocation('/login');
  };

  const hasPermissionFn = (permission: Permission) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return user.permissions.includes(permission);
  };

  const hasAnyPermissionFn = (permissions: Permission[]) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return permissions.some((p) => user.permissions.includes(p));
  };

  const contextValue = useMemo(
    () => ({ user, isLoading, logout, hasPermission: hasPermissionFn, hasAnyPermission: hasAnyPermissionFn }),
    [user, isLoading],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F3F8F5]">
        <RefreshCircle className="h-8 w-8 animate-spin text-[#16A34A] mb-4" size={32} color="currentColor" />
        <p className="text-slate-500 font-medium text-sm">Loading Togashi CRM...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

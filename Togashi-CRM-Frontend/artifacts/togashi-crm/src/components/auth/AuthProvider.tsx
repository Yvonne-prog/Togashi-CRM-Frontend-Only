import {
  createContext, useContext, ReactNode, useEffect, useMemo, useState, useCallback,
} from 'react';
import { useLocation } from 'wouter';
import { RefreshCircle } from 'iconsax-react';
import type { Permission } from '@/lib/permissions';
import { ALL_PERMISSIONS } from '@/lib/permissions';
import { supabase } from '@/lib/supabase';
import { apiGet } from '@/lib/api-client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

import { useToast } from '@/hooks/use-toast';

const PHASE_1_DEVELOPMENT_MODE = true;

export interface FrontendUser {
  id: string;
  name: string;
  email: string;
  accountType: 'ADMIN' | 'USER';
  jobTitle?: string;
  permissions: Permission[];
}

interface AuthContextType {
  user: FrontendUser | null;
  isLoading: boolean;
  supabaseUser: SupabaseUser | null;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  supabaseUser: null,
  logout: async () => undefined,
  hasPermission: () => false,
  hasAnyPermission: () => false,
  refreshProfile: async () => undefined,
});

export const useAuth = () => useContext(AuthContext);

interface BackendProfile {
  uid: string;
  organization: string;
  name: string;
  email: string;
  avatar: string | null;
  jobTitle: string | null;
  department: string | null;
  roleCodes: string[];
  status: string;
}

function roleCodesToPermissions(roleCodes: string[]): Permission[] {
  if (roleCodes.includes('SUPER_ADMIN')) return [...ALL_PERMISSIONS];
  if (roleCodes.length === 0) return [];
  return ALL_PERMISSIONS;
}

const DEV_USER: FrontendUser = {
  id: 'dev-user-id',
  name: 'Togashi Admin',
  email: 'admin@togashi.dev',
  accountType: 'ADMIN',
  jobTitle: 'System Administrator',
  permissions: [...ALL_PERMISSIONS],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [frontendUser, setFrontendUser] = useState<FrontendUser | null>(PHASE_1_DEVELOPMENT_MODE ? DEV_USER : null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const fetchProfile = useCallback(async (sUser: SupabaseUser) => {
    setIsProfileLoading(true);
    try {
      const profile = await apiGet<BackendProfile>('/auth/me');
      const user: FrontendUser = {
        id: profile.uid,
        name: profile.name,
        email: profile.email,
        accountType: profile.roleCodes.includes('SUPER_ADMIN') ? 'ADMIN' : 'USER',
        jobTitle: profile.jobTitle ?? undefined,
        permissions: roleCodesToPermissions(profile.roleCodes),
      };
      setFrontendUser(user);
    } catch {
      setFrontendUser(null);
      await supabase.auth.signOut();
      setLocation('/login', { replace: true });
    } finally {
      setIsProfileLoading(false);
    }
  }, [setLocation]);

  useEffect(() => {
    if (PHASE_1_DEVELOPMENT_MODE) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        fetchProfile(session.user);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setSupabaseUser(user);
      if (!user) {
        setFrontendUser(null);
        setLocation('/login', { replace: true });
      } else {
        fetchProfile(user);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, setLocation]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setSupabaseUser(null);
    setFrontendUser(null);
    setLocation('/login', { replace: true });
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully',
    });
  }, [setLocation, toast]);

  const refreshProfile = useCallback(async () => {
    if (supabaseUser) {
      await fetchProfile(supabaseUser);
    }
  }, [supabaseUser, fetchProfile]);

  const hasPermissionFn = useCallback((permission: Permission) => {
    if (!frontendUser) return false;
    if (frontendUser.accountType === 'ADMIN') return true;
    return frontendUser.permissions.includes(permission);
  }, [frontendUser]);

  const hasAnyPermissionFn = useCallback((permissions: Permission[]) => {
    if (!frontendUser) return false;
    if (frontendUser.accountType === 'ADMIN') return true;
    return permissions.some((p) => frontendUser.permissions.includes(p));
  }, [frontendUser]);

  const contextValue = useMemo(
    () => ({
      user: frontendUser,
      isLoading: isLoading || isProfileLoading,
      supabaseUser,
      logout,
      hasPermission: hasPermissionFn,
      hasAnyPermission: hasAnyPermissionFn,
      refreshProfile,
    }),
    [frontendUser, isLoading, isProfileLoading, supabaseUser, logout, hasPermissionFn, hasAnyPermissionFn, refreshProfile],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F3F8F5]">
        <RefreshCircle className="h-8 w-8 animate-spin text-[#16A34A] mb-4" size={32} color="currentColor" />
        <p className="text-slate-500 font-medium text-sm">Loading Togashi CRM...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

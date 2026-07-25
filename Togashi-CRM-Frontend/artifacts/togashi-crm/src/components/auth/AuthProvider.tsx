import {
  createContext, useContext, ReactNode, useEffect, useMemo, useState,
} from 'react';
import { useLocation } from 'wouter';
import { RefreshCircle } from 'iconsax-react';

interface FrontendUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: FrontendUser | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: () => undefined,
});

export const useAuth = () => useContext(AuthContext);

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
      const parsedUser = JSON.parse(storedUser) as FrontendUser;
      setUser(parsedUser);
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

  const contextValue = useMemo(
    () => ({ user, isLoading, logout }),
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

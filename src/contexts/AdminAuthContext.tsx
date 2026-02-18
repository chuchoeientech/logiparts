import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'logiparts_admin';

const AdminAuthContext = createContext<{
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
} | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    setIsAuthenticated(stored === '1');
  }, []);

  const login = useCallback((password: string): boolean => {
    const expected = import.meta.env.VITE_ADMIN_PASSWORD ?? '';
    if (!expected) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setIsAuthenticated(true);
      return true;
    }
    if (password === expected) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

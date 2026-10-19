import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { api, getSession, setSession, clearSession } from '../lib/api';

interface AuthUser { email: string; role: 'owner'; }
interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const fromSession = (): AuthUser | null => {
  const s = getSession();
  return s ? { email: s.email, role: 'owner' } : null;
};

const failMap = new Map<string, { count: number; until: number }>();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(fromSession);

  useEffect(() => {
    const sync = () => setUser(fromSession());
    window.addEventListener('auth-change', sync);
    return () => window.removeEventListener('auth-change', sync);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const key = email.toLowerCase();
    const record = failMap.get(key) ?? { count: 0, until: 0 };
    if (Date.now() < record.until) {
      const secs = Math.ceil((record.until - Date.now()) / 1000);
      return { success: false, error: `Too many attempts. Try again in ${secs}s.` };
    }

    try {
      const res = await api('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      if (res.ok) {
        const { token } = await res.json();
        failMap.delete(key);
        setSession({ token, email });
        setUser({ email, role: 'owner' });
        window.dispatchEvent(new Event('auth-change'));
        return { success: true };
      }
    } catch {
      return { success: false, error: 'Could not reach the server. Try again.' };
    }

    const count = record.count + 1;
    failMap.set(key, { count, until: count >= 5 ? Date.now() + 15 * 60 * 1000 : 0 });
    if (count >= 5) return { success: false, error: 'Account locked for 15 minutes.' };
    return { success: false, error: `Invalid credentials. ${5 - count} attempts remaining.` };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
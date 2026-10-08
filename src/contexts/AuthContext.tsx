import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const AUTH_KEY = 'portfolio_auth';
const ADMIN_EMAIL = 'admin@alexrivera.dev';
const ADMIN_PASSWORD = 'Admin@2024!';

interface AuthUser { email: string; role: 'owner'; }
interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function loadAuth(): AuthUser | null {
  try {
    const s = sessionStorage.getItem(AUTH_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

const failMap = new Map<string, { count: number; until: number }>();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadAuth);

  const login = useCallback(async (email: string, password: string) => {
    const key = email.toLowerCase();
    const record = failMap.get(key) ?? { count: 0, until: 0 };

    if (Date.now() < record.until) {
      const secs = Math.ceil((record.until - Date.now()) / 1000);
      return { success: false, error: `Too many attempts. Try again in ${secs}s.` };
    }

    await new Promise(r => setTimeout(r, 400));

    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      failMap.delete(key);
      const u: AuthUser = { email, role: 'owner' };
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(u));
      setUser(u);
      return { success: true };
    }

    const count = record.count + 1;
    const until = count >= 5 ? Date.now() + 15 * 60 * 1000 : 0;
    failMap.set(key, { count, until });
    if (count >= 5) return { success: false, error: 'Account locked for 15 minutes.' };
    return { success: false, error: `Invalid credentials. ${5 - count} attempts remaining.` };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setUser(null);
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

export { ADMIN_EMAIL, ADMIN_PASSWORD };

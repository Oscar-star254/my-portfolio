export type Session = { token: string; email: string };
const KEY = 'portfolio_session';

function expired(token: string) {
  try {
    const p = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof p.exp === 'number' && p.exp * 1000 < Date.now();
  } catch { return true; }
}

export function getSession(): Session | null {
  try {
    const s = sessionStorage.getItem(KEY);
    if (!s) return null;
    const v = JSON.parse(s);
    if (!v?.token || expired(v.token)) { sessionStorage.removeItem(KEY); return null; }
    return v;
  } catch { return null; }
}
export const setSession = (s: Session) => sessionStorage.setItem(KEY, JSON.stringify(s));
export const clearSession = () => sessionStorage.removeItem(KEY);

export async function api(path: string, init: RequestInit = {}) {
  const session = getSession();
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (session) headers.set('Authorization', `Bearer ${session.token}`);
  const res = await fetch(path, { ...init, headers });
  if (res.status === 401 && session && path !== '/api/login') {
    clearSession();
    window.dispatchEvent(new Event('auth-change'));
  }
  return res;
}
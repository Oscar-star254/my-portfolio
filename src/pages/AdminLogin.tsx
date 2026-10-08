import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ADMIN_EMAIL } from '../contexts/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: ADMIN_EMAIL, password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) { nav('/admin', { replace: true }); return null; }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) nav('/admin', { replace: true });
    else setError(result.error || 'Login failed.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div style={{ position: 'absolute', top: '30%', left: '30%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(124,92,255,0.1) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: '30%', height: '30%', background: 'radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, var(--violet), #5b3fd4)' }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Sign in to manage your portfolio</p>
        </div>

        {/* Form */}
        <div className="glass-strong p-8 relative overflow-hidden">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--violet), var(--cyan))' }} />

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field"
                placeholder="admin@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Authenticating...
                </>
              ) : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 p-3 rounded-lg text-xs" style={{ background: 'rgba(124,92,255,0.08)', border: '1px solid rgba(124,92,255,0.15)', color: 'var(--muted-foreground)' }}>
            <strong style={{ color: 'var(--violet)' }}>Default credentials:</strong><br />
            Email: {ADMIN_EMAIL}<br />
            Password: Admin@2024!
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-xs transition-colors" style={{ color: 'var(--muted-foreground)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--violet)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-foreground)')}
          >
            ← Back to portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

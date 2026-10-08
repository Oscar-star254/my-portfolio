import { useState } from 'react';
import { useData } from '../../contexts/DataContext';

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return <div className={`toast toast-${type}`}>{msg}</div>;
}

export default function ProfileEditor() {
  const { data, updateProfile } = useData();
  const [form, setForm] = useState({ ...data.profile });
  const [rolesText, setRolesText] = useState(data.profile.roles.join(', '));
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [dirty, setDirty] = useState(false);

  const set = (k: string, v: any) => { setForm(f => ({ ...f, [k]: v })); setDirty(true); };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const save = () => {
    const roles = rolesText.split(',').map(r => r.trim()).filter(Boolean);
    updateProfile({ ...form, roles });
    setDirty(false);
    showToast('Profile saved successfully!');
  };

  return (
    <div className="max-w-2xl space-y-8">
      {toast && <Toast {...toast} />}

      {dirty && (
        <div className="p-3 rounded-lg text-sm flex items-center gap-2" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}>
          ⚠️ You have unsaved changes
        </div>
      )}

      {/* Basic Info */}
      <section className="glass p-6">
        <h3 className="font-semibold text-sm mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Full Name</label>
            <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Tagline</label>
            <input className="input-field" value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="One-line value proposition" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Typing Roles (comma-separated)</label>
            <input className="input-field" value={rolesText} onChange={e => { setRolesText(e.target.value); setDirty(true); }} placeholder="Full-Stack Developer, UI Designer, ..." />
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>These cycle in the hero typing animation.</p>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Bio</label>
            <textarea className="input-field" rows={6} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Your bio (separate paragraphs with blank lines)" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Avatar URL</label>
            <input className="input-field" value={form.avatar} onChange={e => set('avatar', e.target.value)} placeholder="https://... (leave blank for initials)" />
            {form.avatar && <img src={form.avatar} alt="Preview" className="w-16 h-16 rounded-full object-cover mt-2" />}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="glass p-6">
        <h3 className="font-semibold text-sm mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>Contact Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'phone', label: 'Phone', type: 'tel' },
            { key: 'location', label: 'Location', type: 'text' },
            { key: 'github', label: 'GitHub URL', type: 'url' },
            { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
            { key: 'twitter', label: 'Twitter/X URL', type: 'url' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{field.label}</label>
              <input type={field.type} className="input-field" value={(form as any)[field.key]} onChange={e => set(field.key, e.target.value)} />
            </div>
          ))}
        </div>
      </section>

      {/* Resume */}
      <section className="glass p-6">
        <h3 className="font-semibold text-sm mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>Resume Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Resume URL / Path</label>
            <input className="input-field" value={form.resumeUrl} onChange={e => set('resumeUrl', e.target.value)} placeholder="/resume.pdf" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Button Label</label>
              <input className="input-field" value={form.resumeLabel} onChange={e => set('resumeLabel', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>File Info Label</label>
              <input className="input-field" value={form.resumeInfo} onChange={e => set('resumeInfo', e.target.value)} />
            </div>
          </div>
          <div className="p-4 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>Total downloads: </span>
            <strong style={{ color: 'var(--cyan)' }}>{form.resumeDownloads}</strong>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="glass p-6">
        <h3 className="font-semibold text-sm mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>Stats Row</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {form.stats.map((stat, i) => (
            <div key={i} className="p-4 rounded-lg space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide mb-1" style={{ color: 'var(--muted-foreground)' }}>Label</label>
                <input className="input-field" value={stat.label} onChange={e => {
                  const stats = [...form.stats]; stats[i] = { ...stat, label: e.target.value };
                  set('stats', stats);
                }} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wide mb-1" style={{ color: 'var(--muted-foreground)' }}>Value</label>
                  <input type="number" className="input-field" value={stat.value} onChange={e => {
                    const stats = [...form.stats]; stats[i] = { ...stat, value: +e.target.value };
                    set('stats', stats);
                  }} />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wide mb-1" style={{ color: 'var(--muted-foreground)' }}>Suffix</label>
                  <input className="input-field" value={stat.suffix} onChange={e => {
                    const stats = [...form.stats]; stats[i] = { ...stat, suffix: e.target.value };
                    set('stats', stats);
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button onClick={save} className="btn-primary">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Save Changes
      </button>
    </div>
  );
}

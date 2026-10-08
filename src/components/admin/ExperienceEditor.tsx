import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import type { Experience } from '../../data/seed';

const EMPTY: Omit<Experience, 'id'> = { company: '', role: '', start: '', end: '', current: false, logo: '', achievements: ['', '', ''] };

export default function ExperienceEditor() {
  const { data, addExperience, updateExperience, deleteExperience } = useData();
  const [form, setForm] = useState<Omit<Experience, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const save = () => {
    const achievements = form.achievements.filter(Boolean);
    const entry = { ...form, achievements };
    if (editId) {
      updateExperience(data.experience.map(e => e.id === editId ? { ...entry, id: editId } : e));
      showToast('Experience updated!');
      setEditId(null);
    } else {
      addExperience(entry);
      showToast('Experience added!');
    }
    setForm(EMPTY);
  };

  const startEdit = (exp: Experience) => {
    setEditId(exp.id);
    const achievements = [...exp.achievements];
    while (achievements.length < 3) achievements.push('');
    setForm({ company: exp.company, role: exp.role, start: exp.start, end: exp.end, current: exp.current, logo: exp.logo, achievements });
  };

  const setAchievement = (i: number, val: string) => {
    const achievements = [...form.achievements];
    achievements[i] = val;
    setForm(f => ({ ...f, achievements }));
  };

  return (
    <div className="max-w-2xl space-y-6">
      {toast && <div className="toast toast-success">{toast}</div>}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="glass-strong p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold mb-2">Delete this entry?</h3>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { deleteExperience(confirmDel); setConfirmDel(null); showToast('Deleted.'); }} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: '#ef4444', color: '#fff' }}>Delete</button>
              <button onClick={() => setConfirmDel(null)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="glass p-6 space-y-4">
        <h3 className="font-semibold text-sm">{editId ? 'Edit Experience' : 'Add Experience'}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Company</label>
            <input className="input-field" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Role</label>
            <input className="input-field" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Start (e.g. Jan 2022)</label>
            <input className="input-field" value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>End</label>
            <input className="input-field" value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))} disabled={form.current} placeholder={form.current ? 'Present' : ''} />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Logo Letter</label>
            <input className="input-field" value={form.logo} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))} maxLength={2} />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className="w-10 h-6 rounded-full relative transition-colors"
            style={{ background: form.current ? 'var(--cyan)' : 'rgba(255,255,255,0.1)' }}
            onClick={() => setForm(f => ({ ...f, current: !f.current }))}
          >
            <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: form.current ? 22 : 4 }} />
          </div>
          <span className="text-sm">Current position</span>
        </label>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: 'var(--muted-foreground)' }}>Key Achievements</label>
          <div className="space-y-2">
            {[0, 1, 2].map(i => (
              <input key={i} className="input-field" value={form.achievements[i] || ''} onChange={e => setAchievement(i, e.target.value)} placeholder={`Achievement ${i + 1}`} />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={save} className="btn-primary text-sm">{editId ? 'Update' : 'Add'}</button>
          {editId && <button onClick={() => { setEditId(null); setForm(EMPTY); }} className="btn-secondary text-sm">Cancel</button>}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {data.experience.map(exp => (
          <div key={exp.id} className="glass p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--violet), #5b3fd4)', color: '#fff' }}>
              {exp.logo}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{exp.role}</p>
              <p className="text-xs" style={{ color: 'var(--cyan)' }}>{exp.company}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{exp.start} — {exp.current ? 'Present' : exp.end}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(exp)} className="text-xs px-2.5 py-1 rounded-md" style={{ background: 'rgba(124,92,255,0.1)', color: 'var(--violet)' }}>Edit</button>
              <button onClick={() => setConfirmDel(exp.id)} className="text-xs px-2.5 py-1 rounded-md" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

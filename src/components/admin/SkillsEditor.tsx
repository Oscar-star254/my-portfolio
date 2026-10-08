import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import type { Skill } from '../../data/seed';

const CATEGORIES = ['Frontend', 'Backend', 'Tools', 'Soft Skills'];
const EMPTY: Omit<Skill, 'id'> = { category: 'Frontend', name: '', level: 80, icon: '⚡' };

export default function SkillsEditor() {
  const { data, addSkill, updateSkills, deleteSkill } = useData();
  const [form, setForm] = useState<Omit<Skill, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const save = () => {
    if (!form.name.trim()) return;
    if (editId) {
      updateSkills(data.skills.map(s => s.id === editId ? { ...form, id: editId } : s));
      showToast('Skill updated!');
      setEditId(null);
    } else {
      addSkill(form);
      showToast('Skill added!');
    }
    setForm(EMPTY);
  };

  const startEdit = (s: Skill) => {
    setEditId(s.id);
    setForm({ name: s.name, category: s.category, level: s.level, icon: s.icon });
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY); };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = data.skills.filter(s => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="max-w-3xl space-y-6">
      {toast && <div className="toast toast-success">{toast}</div>}

      {/* Add/Edit form */}
      <div className="glass p-6">
        <h3 className="font-semibold text-sm mb-5">{editId ? 'Edit Skill' : 'Add Skill'}</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Name</label>
            <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. React / Next.js" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Category</label>
            <select className="input-field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Icon (emoji)</label>
            <input className="input-field" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="⚡" maxLength={4} />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
              Proficiency: <strong style={{ color: 'var(--violet)' }}>{form.level}%</strong>
            </label>
            <input type="range" min={0} max={100} value={form.level} onChange={e => setForm(f => ({ ...f, level: +e.target.value }))} className="w-full accent-violet-500" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={save} className="btn-primary text-sm">{editId ? 'Update Skill' : 'Add Skill'}</button>
          {editId && <button onClick={cancelEdit} className="btn-secondary text-sm">Cancel</button>}
        </div>
      </div>

      {/* Skills by category */}
      {CATEGORIES.map(cat => grouped[cat]?.length > 0 && (
        <div key={cat}>
          <h3 className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--violet)' }}>— {cat}</h3>
          <div className="space-y-2">
            {grouped[cat].map(skill => (
              <div key={skill.id} className="glass p-4 flex items-center gap-4">
                <span className="text-xl w-8">{skill.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-medium text-sm">{skill.name}</span>
                    <span className="font-mono text-xs" style={{ color: 'var(--cyan)' }}>{skill.level}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="progress-bar" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(skill)} className="text-xs px-2.5 py-1 rounded-md" style={{ background: 'rgba(124,92,255,0.1)', color: 'var(--violet)' }}>Edit</button>
                  <button onClick={() => { deleteSkill(skill.id); showToast('Skill removed.'); }} className="text-xs px-2.5 py-1 rounded-md" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import type { Testimonial } from '../../data/seed';

const EMPTY: Omit<Testimonial, 'id'> = { name: '', role: '', avatar: '', quote: '', rating: 5, approved: true };

export default function TestimonialsEditor() {
  const { data, addTestimonial, updateTestimonials, deleteTestimonial } = useData();
  const [form, setForm] = useState<Omit<Testimonial, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const save = () => {
    if (!form.name.trim() || !form.quote.trim()) return;
    if (editId) {
      updateTestimonials(data.testimonials.map(t => t.id === editId ? { ...form, id: editId } : t));
      showToast('Updated!');
      setEditId(null);
    } else {
      addTestimonial(form);
      showToast('Added!');
    }
    setForm(EMPTY);
  };

  const startEdit = (t: Testimonial) => {
    setEditId(t.id);
    setForm({ name: t.name, role: t.role, avatar: t.avatar, quote: t.quote, rating: t.rating, approved: t.approved });
  };

  const toggle = (id: string) => {
    updateTestimonials(data.testimonials.map(t => t.id === id ? { ...t, approved: !t.approved } : t));
  };

  return (
    <div className="max-w-2xl space-y-6">
      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="glass p-6 space-y-4">
        <h3 className="font-semibold text-sm">{editId ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Name</label>
            <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Role / Company</label>
            <input className="input-field" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Testimonial</label>
          <textarea className="input-field" rows={3} value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Rating: <strong style={{ color: '#fbbf24' }}>{form.rating} / 5</strong>
          </label>
          <input type="range" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: +e.target.value }))} className="w-full" style={{ accentColor: '#fbbf24' }} />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className="w-10 h-6 rounded-full relative transition-colors"
            style={{ background: form.approved ? '#4ade80' : 'rgba(255,255,255,0.1)' }}
            onClick={() => setForm(f => ({ ...f, approved: !f.approved }))}
          >
            <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: form.approved ? 22 : 4 }} />
          </div>
          <span className="text-sm">Approved / visible</span>
        </label>
        <div className="flex gap-3">
          <button onClick={save} className="btn-primary text-sm">{editId ? 'Update' : 'Add'}</button>
          {editId && <button onClick={() => { setEditId(null); setForm(EMPTY); }} className="btn-secondary text-sm">Cancel</button>}
        </div>
      </div>

      <div className="space-y-3">
        {data.testimonials.map(t => (
          <div key={t.id} className="glass p-4 flex items-start gap-4" style={{ opacity: t.approved ? 1 : 0.5 }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--violet), var(--cyan))', color: '#fff' }}>
              {t.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs" style={{ color: 'var(--cyan)' }}>{t.role}</p>
              <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>{t.quote}</p>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < t.rating ? 'star-filled' : 'star-empty'} style={{ fontSize: 11 }}>★</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => toggle(t.id)} className="text-xs px-2 py-1 rounded" style={{ background: t.approved ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)', color: t.approved ? '#4ade80' : 'var(--muted-foreground)' }}>
                {t.approved ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => startEdit(t)} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(124,92,255,0.1)', color: 'var(--violet)' }}>Edit</button>
              <button onClick={() => { deleteTestimonial(t.id); showToast('Deleted.'); }} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

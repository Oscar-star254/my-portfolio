import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import type { Education } from '../../data/seed';

const EMPTY: Omit<Education, 'id'> = { type: 'cert', institution: '', degree: '', field: '', start: '', end: '', gpa: '', description: '', certUrl: '' };

export default function EducationEditor() {
  const { data, addEducation, updateEducation, deleteEducation } = useData();
  const [form, setForm] = useState<Omit<Education, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const save = () => {
    if (!form.institution.trim()) return;
    if (editId) {
      updateEducation(data.education.map(e => e.id === editId ? { ...form, id: editId } : e));
      showToast('Updated!');
      setEditId(null);
    } else {
      addEducation(form);
      showToast('Added!');
    }
    setForm(EMPTY);
  };

  const startEdit = (e: Education) => {
    setEditId(e.id);
    setForm({ type: e.type, institution: e.institution, degree: e.degree, field: e.field, start: e.start, end: e.end, gpa: e.gpa, description: e.description, certUrl: e.certUrl });
  };

  return (
    <div className="max-w-2xl space-y-6">
      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="glass p-6 space-y-4">
        <h3 className="font-semibold text-sm">{editId ? 'Edit Entry' : 'Add Entry'}</h3>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Type</label>
          <select className="input-field" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}>
            <option value="degree">Degree</option>
            <option value="cert">Certification</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: 'institution', label: 'Institution' },
            { key: 'degree', label: 'Degree / Certificate Name' },
            { key: 'field', label: 'Field' },
            { key: 'gpa', label: 'GPA (optional)' },
            { key: 'start', label: 'Start Year' },
            { key: 'end', label: 'End Year' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{f.label}</label>
              <input className="input-field" value={(form as any)[f.key]} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))} />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Description</label>
          <textarea className="input-field" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Certificate URL</label>
          <input className="input-field" value={form.certUrl} onChange={e => setForm(f => ({ ...f, certUrl: e.target.value }))} />
        </div>
        <div className="flex gap-3">
          <button onClick={save} className="btn-primary text-sm">{editId ? 'Update' : 'Add'}</button>
          {editId && <button onClick={() => { setEditId(null); setForm(EMPTY); }} className="btn-secondary text-sm">Cancel</button>}
        </div>
      </div>

      <div className="space-y-3">
        {data.education.map(edu => (
          <div key={edu.id} className="glass p-4 flex items-start gap-4">
            <span className="text-2xl">{edu.type === 'degree' ? '🎓' : '📜'}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{edu.degree}</p>
              <p className="text-xs" style={{ color: 'var(--cyan)' }}>{edu.institution}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{edu.start}{edu.end ? `–${edu.end}` : ''} · {edu.field}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(edu)} className="text-xs px-2.5 py-1 rounded-md" style={{ background: 'rgba(124,92,255,0.1)', color: 'var(--violet)' }}>Edit</button>
              <button onClick={() => { deleteEducation(edu.id); showToast('Deleted.'); }} className="text-xs px-2.5 py-1 rounded-md" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

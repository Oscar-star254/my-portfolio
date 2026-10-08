import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import type { Project } from '../../data/seed';

const EMPTY: Omit<Project, 'id'> = { title: '', category: 'Web', featured: false, status: 'draft', description: '', tech: [], liveUrl: '', sourceUrl: '', image: '', order: 0 };

export default function ProjectsEditor() {
  const { data, addProject, updateProjects, deleteProject } = useData();
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Omit<Project, 'id'>>(EMPTY);
  const [techText, setTechText] = useState('');
  const [toast, setToast] = useState('');
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openEdit = (p: Project) => {
    setEditing(p); setIsNew(false);
    setForm({ title: p.title, category: p.category, featured: p.featured, status: p.status, description: p.description, tech: p.tech, liveUrl: p.liveUrl, sourceUrl: p.sourceUrl, image: p.image, order: p.order });
    setTechText(p.tech.join(', '));
  };

  const openNew = () => {
    setEditing(null); setIsNew(true);
    setForm({ ...EMPTY, order: data.projects.length });
    setTechText('');
  };

  const save = () => {
    const tech = techText.split(',').map(t => t.trim()).filter(Boolean);
    const project = { ...form, tech };
    if (isNew) {
      addProject(project);
      showToast('Project added!');
    } else if (editing) {
      updateProjects(data.projects.map(p => p.id === editing.id ? { ...project, id: editing.id } : p));
      showToast('Project updated!');
    }
    setEditing(null); setIsNew(false);
  };

  const del = (id: string) => {
    deleteProject(id);
    setConfirmDel(null);
    showToast('Project deleted.');
  };

  const toggle = (id: string, field: 'featured' | 'status') => {
    updateProjects(data.projects.map(p => p.id === id
      ? { ...p, [field]: field === 'status' ? (p.status === 'published' ? 'draft' : 'published') : !p.featured }
      : p
    ));
  };

  if (editing !== null || isNew) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => { setEditing(null); setIsNew(false); }} className="btn-secondary text-xs py-2">← Back</button>
          <h3 className="font-semibold">{isNew ? 'Add New Project' : 'Edit Project'}</h3>
        </div>

        <div className="glass p-6 space-y-4">
          {[
            { key: 'title', label: 'Title' },
            { key: 'image', label: 'Image URL' },
            { key: 'liveUrl', label: 'Live Demo URL' },
            { key: 'sourceUrl', label: 'Source Code URL' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{f.label}</label>
              <input className="input-field" value={(form as any)[f.key]} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))} />
            </div>
          ))}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Description</label>
            <textarea className="input-field" rows={4} value={form.description} onChange={e => setForm(x => ({ ...x, description: e.target.value }))} />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Tech Stack (comma-separated)</label>
            <input className="input-field" value={techText} onChange={e => setTechText(e.target.value)} placeholder="React, TypeScript, Node.js" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm(x => ({ ...x, category: e.target.value }))}>
                {['Web', 'Mobile', 'Design', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm(x => ({ ...x, status: e.target.value as any }))}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className="w-10 h-6 rounded-full relative transition-colors"
              style={{ background: form.featured ? 'var(--violet)' : 'rgba(255,255,255,0.1)' }}
              onClick={() => setForm(x => ({ ...x, featured: !x.featured }))}
            >
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: form.featured ? 22 : 4 }} />
            </div>
            <span className="text-sm">Featured project</span>
          </label>

          {form.image && (
            <img src={form.image} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={save} className="btn-primary">Save Project</button>
          <button onClick={() => { setEditing(null); setIsNew(false); }} className="btn-secondary">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && <div className="toast toast-success">{toast}</div>}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="glass-strong p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold mb-2">Delete project?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => del(confirmDel)} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: '#ef4444', color: '#fff' }}>Delete</button>
              <button onClick={() => setConfirmDel(null)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{data.projects.length} projects total</p>
        <button onClick={openNew} className="btn-primary text-sm">+ Add Project</button>
      </div>

      <div className="space-y-3">
        {data.projects.map(project => (
          <div key={project.id} className="glass p-4 flex items-center gap-4">
            <div className="w-14 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--muted)' }}>
              {project.image && <img src={project.image} alt={project.title} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{project.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="tag tag-violet">{project.category}</span>
                <span className="tag" style={{ background: project.status === 'published' ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)', color: project.status === 'published' ? '#4ade80' : 'var(--muted-foreground)', border: '1px solid', borderColor: project.status === 'published' ? 'rgba(74,222,128,0.2)' : 'var(--border)' }}>
                  {project.status}
                </span>
                {project.featured && <span className="tag tag-cyan">⭐ Featured</span>}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => toggle(project.id, 'status')} className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted-foreground)' }}>
                {project.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => openEdit(project)} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: 'rgba(124,92,255,0.1)', color: 'var(--violet)' }}>Edit</button>
              <button onClick={() => setConfirmDel(project.id)} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

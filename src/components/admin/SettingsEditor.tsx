import { useState } from 'react';
import { useData } from '../../contexts/DataContext';

export default function SettingsEditor() {
  const { data, updateSEO, updateSections, resetToSeed } = useData();
  const [seo, setSeo] = useState({ ...data.seo });
  const [sections, setSections] = useState([...data.sections]);
  const [toast, setToast] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const saveSEO = () => { updateSEO(seo); showToast('SEO settings saved!'); };
  const saveSections = () => { updateSections(sections); showToast('Section settings saved!'); };

  const toggleSection = (id: string) => {
    setSections(ss => ss.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  return (
    <div className="max-w-2xl space-y-8">
      {toast && <div className="toast toast-success">{toast}</div>}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="glass-strong p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold mb-2">Reset all data?</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>This will restore the seed data and erase all changes. Cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => { resetToSeed(); setConfirmReset(false); showToast('Data reset to defaults.'); }} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: '#ef4444', color: '#fff' }}>Reset</button>
              <button onClick={() => setConfirmReset(false)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* SEO */}
      <div className="glass p-6">
        <h3 className="font-semibold text-sm mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>SEO & Meta Tags</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Page Title</label>
            <input className="input-field" value={seo.title} onChange={e => setSeo(s => ({ ...s, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Meta Description</label>
            <textarea className="input-field" rows={3} value={seo.description} onChange={e => setSeo(s => ({ ...s, description: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>OG Image URL</label>
            <input className="input-field" value={seo.ogImage} onChange={e => setSeo(s => ({ ...s, ogImage: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Google Analytics ID</label>
            <input className="input-field" value={seo.analyticsId} onChange={e => setSeo(s => ({ ...s, analyticsId: e.target.value }))} placeholder="G-XXXXXXXXXX" />
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium">Maintenance Mode</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Shows a "Coming Soon" page to visitors</p>
            </div>
            <div
              className="w-12 h-6 rounded-full relative transition-colors"
              style={{ background: seo.maintenanceMode ? '#ef4444' : 'rgba(255,255,255,0.1)' }}
              onClick={() => setSeo(s => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
            >
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: seo.maintenanceMode ? 26 : 4 }} />
            </div>
          </label>
          <button onClick={saveSEO} className="btn-primary text-sm">Save SEO Settings</button>
        </div>
      </div>

      {/* Sections */}
      <div className="glass p-6">
        <h3 className="font-semibold text-sm mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>Section Visibility</h3>
        <div className="space-y-3">
          {sections.map(section => (
            <div key={section.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <span className="text-sm font-medium capitalize">{section.label}</span>
              <div
                className="w-10 h-6 rounded-full relative transition-colors cursor-pointer"
                style={{ background: section.visible ? 'var(--violet)' : 'rgba(255,255,255,0.1)' }}
                onClick={() => toggleSection(section.id)}
              >
                <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: section.visible ? 22 : 4 }} />
              </div>
            </div>
          ))}
        </div>
        <button onClick={saveSections} className="btn-primary text-sm mt-4">Save Sections</button>
      </div>

      {/* Danger zone */}
      <div className="glass p-6" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <h3 className="font-semibold text-sm mb-3" style={{ color: '#f87171' }}>Danger Zone</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Reset all portfolio content to the original seed data. This cannot be undone.</p>
        <button
          onClick={() => setConfirmReset(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

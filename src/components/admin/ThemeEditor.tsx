import { useState } from 'react';
import { useData } from '../../contexts/DataContext';

export default function ThemeEditor() {
  const { data, updateTheme } = useData();
  const [form, setForm] = useState({ ...data.theme });
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    updateTheme(form);
    showToast('Theme saved! Reload the portfolio to see changes.');
  };

  return (
    <div className="max-w-xl space-y-6">
      {toast && <div className="toast toast-success">{toast}</div>}

      {/* Colors */}
      <div className="glass p-6">
        <h3 className="font-semibold text-sm mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>Colors</h3>
        <div className="space-y-4">
          {[
            { key: 'primaryColor', label: 'Primary / Violet', hint: 'Used for buttons, accents, and highlights' },
            { key: 'accentColor', label: 'Secondary / Cyan', hint: 'Used for tags, labels, and secondary elements' },
            { key: 'particleColor', label: 'Particle Color', hint: 'Color of the canvas particles' },
          ].map(({ key, label, hint }) => (
            <div key={key}>
              <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
              <div className="flex items-center gap-3">
                <input type="color" value={(form as any)[key]} onChange={e => set(key, e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                <input className="input-field flex-1 font-mono text-sm" value={(form as any)[key]} onChange={e => set(key, e.target.value)} />
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{hint}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Particles */}
      <div className="glass p-6">
        <h3 className="font-semibold text-sm mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>Canvas Particles</h3>
        <div className="space-y-5">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium">Enable Particles</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Animated particle network on the hero</p>
            </div>
            <div
              className="w-12 h-6 rounded-full relative transition-colors"
              style={{ background: form.particlesEnabled ? 'var(--violet)' : 'rgba(255,255,255,0.1)' }}
              onClick={() => set('particlesEnabled', !form.particlesEnabled)}
            >
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: form.particlesEnabled ? 26 : 4 }} />
            </div>
          </label>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
              Particle Count: <strong style={{ color: 'var(--violet)' }}>{form.particleCount}</strong>
            </label>
            <input type="range" min={20} max={200} step={10} value={form.particleCount} onChange={e => set('particleCount', +e.target.value)} className="w-full accent-violet-500" disabled={!form.particlesEnabled} />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
              Particle Speed: <strong style={{ color: 'var(--violet)' }}>{form.particleSpeed}</strong>
            </label>
            <input type="range" min={0.1} max={2} step={0.1} value={form.particleSpeed} onChange={e => set('particleSpeed', +e.target.value)} className="w-full accent-violet-500" disabled={!form.particlesEnabled} />
          </div>
        </div>
      </div>

      {/* Animations */}
      <div className="glass p-6">
        <h3 className="font-semibold text-sm mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>Animations</h3>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium">Enable Scroll Animations</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Fade/slide-up reveals as sections come into view</p>
          </div>
          <div
            className="w-12 h-6 rounded-full relative transition-colors"
            style={{ background: form.animationsEnabled ? 'var(--violet)' : 'rgba(255,255,255,0.1)' }}
            onClick={() => set('animationsEnabled', !form.animationsEnabled)}
          >
            <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: form.animationsEnabled ? 26 : 4 }} />
          </div>
        </label>
      </div>

      {/* Preview swatch */}
      <div className="glass p-5">
        <h3 className="font-semibold text-sm mb-4">Color Preview</h3>
        <div className="flex gap-3">
          <div className="flex-1 h-12 rounded-lg flex items-center justify-center text-white text-xs font-semibold" style={{ background: `linear-gradient(135deg, ${form.primaryColor}, ${form.accentColor})` }}>
            Gradient
          </div>
          <div className="flex-1 h-12 rounded-lg" style={{ background: form.primaryColor, opacity: 0.8 }} />
          <div className="flex-1 h-12 rounded-lg" style={{ background: form.accentColor, opacity: 0.8 }} />
        </div>
      </div>

      <button onClick={save} className="btn-primary">Save Theme</button>
    </div>
  );
}

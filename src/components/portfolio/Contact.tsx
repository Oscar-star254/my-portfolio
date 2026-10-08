import { useState } from 'react';
import { useData } from '../../contexts/DataContext';

export default function Contact() {
  const { data, addMessage, recordResumeDownload } = useData();
  const { profile } = data;
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.message.trim()) e.message = 'Message is required.';
    else if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters.';
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('sending');
    await new Promise(r => setTimeout(r, 800));
    addMessage({ name: form.name, email: form.email, message: form.message });
    setStatus('sent');
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="contact" className="py-24 relative" style={{ zIndex: 1 }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <div className="section-label justify-center">Get in Touch</div>
          <h2 className="section-heading">
            Let's <em className="gradient-text not-italic">work together</em>
          </h2>
          <p className="max-w-lg mx-auto text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Open to Senior and Staff-level roles, contract work, and interesting collaborations.
            Response time: usually within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 reveal">
          {/* Contact info */}
          <div>
            <div className="space-y-6 mb-8">
              {[
                { icon: '✉️', label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
                { icon: '📍', label: 'Location', value: profile.location, href: null },
                { icon: '📞', label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(124,92,255,0.1)', border: '1px solid rgba(124,92,255,0.2)' }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-medium transition-colors hover:text-violet-400">{item.value}</a>
                    ) : (
                      <p className="text-sm font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Resume CTA */}
            <div className="glass p-5 relative overflow-hidden">
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--violet), var(--cyan))' }} />
              <p className="text-sm font-medium mb-1">Want to review my full experience?</p>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Download the PDF resume for a complete overview.</p>
              <a
                href={profile.resumeUrl}
                download
                onClick={recordResumeDownload}
                className="btn-primary text-sm py-2.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {profile.resumeLabel}
                <span className="font-mono text-xs opacity-70 ml-1">{profile.resumeInfo}</span>
              </a>
            </div>
          </div>

          {/* Form */}
          <div>
            {status === 'sent' ? (
              <div className="glass-strong p-10 text-center h-full flex flex-col items-center justify-center gap-4">
                <div className="text-5xl">🎉</div>
                <h3 className="font-serif text-xl font-semibold">Message received!</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Thanks for reaching out, {form.name || 'friend'}. I'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input-field"
                    placeholder="Your name"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="input-field"
                    placeholder="your@email.com"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 font-mono uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="input-field"
                    placeholder="Tell me about your project or opportunity..."
                    rows={5}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary w-full justify-center"
                  style={{ opacity: status === 'sending' ? 0.7 : 1 }}
                >
                  {status === 'sending' ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

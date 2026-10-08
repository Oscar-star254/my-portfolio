import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';

const NAV_LINKS = ['About', 'Skills', 'Experience', 'Projects', 'Education', 'Testimonials', 'Contact'];

export default function Navbar() {
  const { data, recordResumeDownload } = useData();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);

      const sections = NAV_LINKS.map(l => document.getElementById(l.toLowerCase()));
      let current = '';
      sections.forEach(sec => {
        if (sec && window.scrollY >= sec.offsetTop - 100) current = sec.id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  const visibleSections = data.sections
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order)
    .map(s => s.label);

  return (
    <>
      <div id="scroll-progress" style={{ width: `${progress}%` }} />

      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,15,31,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="font-serif text-xl font-semibold gradient-text">
            {data.profile.name.split(' ').map(w => w[0]).join('')}
            <span className="font-sans text-muted-foreground ml-1 text-sm font-normal hidden sm:inline">
              / {data.profile.name}
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {visibleSections.map(label => (
              <button
                key={label}
                onClick={() => scrollTo(label)}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                style={{
                  color: active === label.toLowerCase() ? 'var(--violet)' : 'var(--muted-foreground)',
                  background: active === label.toLowerCase() ? 'rgba(124,92,255,0.1)' : 'transparent',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={data.profile.resumeUrl}
              download
              onClick={recordResumeDownload}
              className="btn-secondary text-xs py-2 px-4"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Resume
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: 'var(--muted-foreground)' }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: open ? '400px' : '0',
            background: 'rgba(10,15,31,0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: open ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}
        >
          <div className="px-6 py-4 flex flex-col gap-2">
            {visibleSections.map(label => (
              <button
                key={label}
                onClick={() => scrollTo(label)}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium"
                style={{ color: active === label.toLowerCase() ? 'var(--violet)' : 'var(--foreground)' }}
              >
                {label}
              </button>
            ))}
            <a
              href={data.profile.resumeUrl}
              download
              onClick={() => { recordResumeDownload(); setOpen(false); }}
              className="btn-primary justify-center mt-2"
            >
              Download Resume
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

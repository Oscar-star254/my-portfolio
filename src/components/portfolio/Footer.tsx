import { useData } from '../../contexts/DataContext';

export default function Footer() {
  const { data } = useData();
  const { profile } = data;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const links = [
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <footer className="relative py-12 border-t" style={{ borderColor: 'var(--border)', zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <div className="font-serif text-lg font-semibold gradient-text mb-1">{profile.name}</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              &copy; {new Date().getFullYear()} · Built with React + Tailwind
            </p>
          </div>

          {/* Quick links */}
          <div className="flex gap-6">
            {links.map(l => (
              <button
                key={l.id}
                onClick={() => document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs font-medium transition-colors"
                style={{ color: 'var(--muted-foreground)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--violet)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-foreground)')}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollTop}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(124,92,255,0.1)', border: '1px solid rgba(124,92,255,0.2)', color: 'var(--violet)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,92,255,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,92,255,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
            aria-label="Back to top"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

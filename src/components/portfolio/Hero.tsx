import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';

function TypingText({ roles }: { roles: string[] }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!roles.length) return;
    const current = roles[idx % roles.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (text.length < current.length) {
          setText(current.slice(0, text.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 2000);
        }
      } else {
        if (text.length > 0) {
          setText(text.slice(0, -1));
        } else {
          setDeleting(false);
          setIdx(i => i + 1);
        }
      }
    }, deleting ? 50 : 80);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, roles]);

  return (
    <span className="gradient-text">
      {text}
      <span className="typing-cursor" />
    </span>
  );
}

const SOCIAL_ICONS = {
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  email: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    </svg>
  ),
};

export default function Hero() {
  const { data, recordResumeDownload } = useData();
  const { profile } = data;

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Ambient gradients */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%', width: '50%', height: '60%',
          background: 'radial-gradient(ellipse, rgba(124,92,255,0.12) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '0', right: '-5%', width: '45%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 65%)',
        }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative float">
            <div className="avatar-ring p-0.5 rounded-full" style={{ width: 140, height: 140 }}>
              <div className="w-full h-full rounded-full overflow-hidden bg-navy-3" style={{ background: 'var(--navy-3)' }}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(124,92,255,0.3), rgba(34,211,238,0.2))' }}>
                    <span className="font-serif text-4xl font-semibold gradient-text">
                      {profile.name.split(' ').map(w => w[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Status indicator */}
            <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-400 border-2" style={{ borderColor: 'var(--background)' }}>
              <div className="w-full h-full rounded-full bg-green-400 animate-ping opacity-75" />
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <span className="section-label justify-center">Available for hire</span>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-semibold leading-none tracking-tight mb-4">
            {profile.name}
          </h1>
        </div>

        {/* Typing roles */}
        <div className="h-10 flex items-center justify-center mb-4">
          <p className="text-xl sm:text-2xl font-medium" style={{ color: 'var(--muted-foreground)' }}>
            <TypingText roles={profile.roles} />
          </p>
        </div>

        {/* Tagline */}
        <p className="text-base sm:text-lg max-w-2xl mx-auto mb-10" style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>
          {profile.tagline}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a
            href={profile.resumeUrl}
            download
            onClick={recordResumeDownload}
            className="btn-primary pulse-glow relative group"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {profile.resumeLabel}
            <span
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
            >
              {profile.resumeInfo}
            </span>
          </a>
          <button onClick={scrollToContact} className="btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Contact Me
          </button>
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-4">
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              className="p-2.5 rounded-lg transition-all duration-200 hover:scale-110"
              style={{ color: 'var(--muted-foreground)', background: 'rgba(255,255,255,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(124,92,255,0.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
            >
              {SOCIAL_ICONS.github}
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="p-2.5 rounded-lg transition-all duration-200 hover:scale-110"
              style={{ color: 'var(--muted-foreground)', background: 'rgba(255,255,255,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0a66c2'; (e.currentTarget as HTMLElement).style.background = 'rgba(10,102,194,0.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
            >
              {SOCIAL_ICONS.linkedin}
            </a>
          )}
          {profile.twitter && (
            <a href={profile.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X"
              className="p-2.5 rounded-lg transition-all duration-200 hover:scale-110"
              style={{ color: 'var(--muted-foreground)', background: 'rgba(255,255,255,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
            >
              {SOCIAL_ICONS.twitter}
            </a>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} aria-label="Email"
              className="p-2.5 rounded-lg transition-all duration-200 hover:scale-110"
              style={{ color: 'var(--muted-foreground)', background: 'rgba(255,255,255,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--cyan)'; (e.currentTarget as HTMLElement).style.background = 'rgba(34,211,238,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
            >
              {SOCIAL_ICONS.email}
            </a>
          )}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}>SCROLL</span>
          <div className="w-px h-8" style={{ background: 'linear-gradient(180deg, var(--violet), transparent)' }} />
        </div>
      </div>
    </section>
  );
}

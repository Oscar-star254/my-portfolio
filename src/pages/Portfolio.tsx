import { useEffect, useRef, useState } from 'react';
import React from 'react';
import Canvas from '../components/portfolio/Canvas';
import Navbar from '../components/portfolio/Navbar';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Skills from '../components/portfolio/Skills';
import Experience from '../components/portfolio/Experience';
import Projects from '../components/portfolio/Projects';
import Education from '../components/portfolio/Education';
import Testimonials from '../components/portfolio/Testimonials';
import Contact from '../components/portfolio/Contact';
import Footer from '../components/portfolio/Footer';
import { useData } from '../contexts/DataContext';

function LoadingScreen() {
  return (
    <div
      id="loading-screen"
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{ background: 'var(--background)' }}
    >
      <div className="text-center">
        <div className="avatar-ring inline-block p-0.5 rounded-full mb-4" style={{ width: 56, height: 56 }}>
          <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: 'var(--background)' }}>
            <span className="gradient-text font-serif font-bold text-xl">AR</span>
          </div>
        </div>
        <div className="flex gap-1.5 justify-center">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--violet)',
                animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes bounce { to { transform: translateY(-8px); opacity: 0.3; } }
      `}</style>
    </div>
  );
}

function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + 'px';
        glowRef.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return <div id="cursor-glow" ref={glowRef} aria-hidden="true" />;
}

function ScrollRevealInit() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    const run = () => document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    run();
    const mo = new MutationObserver(run);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}

export default function Portfolio() {
  const { data } = useData();
  const [loaded, setLoaded] = useState(false);
  const visibleSections = data.sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 2000);
    // SEO
    document.title = data.seo.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', data.seo.description);
    else {
      const m = document.createElement('meta');
      m.name = 'description'; m.content = data.seo.description;
      document.head.appendChild(m);
    }
  }, [data.seo]);

  if (data.seo.maintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8" style={{ background: 'var(--background)' }}>
        <div>
          <div className="text-6xl mb-6">🔧</div>
          <h1 className="font-serif text-4xl font-semibold mb-4">Under Maintenance</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>We'll be back soon. Follow along on social media for updates.</p>
        </div>
      </div>
    );
  }

  const SECTION_MAP: Record<string, React.ReactElement> = {
    about: <About key="about" />,
    skills: <Skills key="skills" />,
    experience: <Experience key="experience" />,
    projects: <Projects key="projects" />,
    education: <Education key="education" />,
    testimonials: <Testimonials key="testimonials" />,
    contact: <Contact key="contact" />,
  };

  return (
    <>
      {!loaded && <LoadingScreen />}
      <CursorGlow />
      <ScrollRevealInit />
      <Canvas />
      <Navbar />
      <main>
        <Hero />
        {visibleSections.map(section => SECTION_MAP[section.id]).filter(Boolean)}
      </main>
      <Footer />
    </>
  );
}

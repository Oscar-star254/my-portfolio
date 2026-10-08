import { useState, useEffect, useRef } from 'react';
import { useData } from '../../contexts/DataContext';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Tools', 'Soft Skills'];

export default function Skills() {
  const { data } = useData();
  const [cat, setCat] = useState('All');
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setAnimated(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const filtered = cat === 'All' ? data.skills : data.skills.filter(s => s.category === cat);
  const categories = ['All', ...Array.from(new Set(data.skills.map(s => s.category)))];

  return (
    <section id="skills" ref={ref} className="py-24 relative" style={{ zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 reveal">
          <div className="section-label justify-center">Expertise</div>
          <h2 className="section-heading">
            Tools of the <em className="gradient-text not-italic">trade</em>
          </h2>
          <p className="max-w-lg mx-auto text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            A curated set of technologies I reach for when building production systems.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 reveal">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="px-4 py-1.5 rounded-full text-xs font-medium font-mono transition-all duration-200"
              style={{
                background: cat === c ? 'linear-gradient(135deg, var(--violet), #5b3fd4)' : 'rgba(255,255,255,0.05)',
                color: cat === c ? '#fff' : 'var(--muted-foreground)',
                border: '1px solid',
                borderColor: cat === c ? 'transparent' : 'var(--border)',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 reveal">
          {filtered.map((skill, i) => (
            <div
              key={skill.id}
              className="glass p-5 group hover:border-violet-500/30 transition-all duration-300"
              style={{ transitionDelay: `${(i % 6) * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{skill.icon}</span>
                  <span className="font-medium text-sm">{skill.name}</span>
                </div>
                <span
                  className="font-mono text-xs font-semibold"
                  style={{ color: skill.level >= 85 ? 'var(--cyan)' : 'var(--violet)' }}
                >
                  {skill.level}%
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="progress-bar"
                  style={{ width: animated ? `${skill.level}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

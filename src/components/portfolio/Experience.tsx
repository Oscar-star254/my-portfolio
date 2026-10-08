import { useData } from '../../contexts/DataContext';

export default function Experience() {
  const { data } = useData();

  return (
    <section id="experience" className="py-24 relative" style={{ zIndex: 1 }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <div className="section-label justify-center">Work History</div>
          <h2 className="section-heading">
            Where I've <em className="gradient-text not-italic">shipped</em>
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, var(--violet) 0%, var(--cyan) 70%, transparent 100%)', transform: 'translateX(-50%)' }} />

          <div className="space-y-12">
            {data.experience.map((exp, i) => (
              <div
                key={exp.id}
                className={`reveal relative flex flex-col md:flex-row gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {/* Content */}
                <div className={`md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-8 md:pl-0`}>
                  <div className="glass p-6 hover:border-violet-500/20 transition-all duration-300 group">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4 flex-row">
                      <div
                        className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-sm"
                        style={{ background: 'linear-gradient(135deg, var(--violet), #5b3fd4)', color: '#fff' }}
                      >
                        {exp.logo}
                      </div>
                      <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                        <h3 className="font-semibold text-base">{exp.role}</h3>
                        <p className="text-sm font-medium" style={{ color: 'var(--cyan)' }}>{exp.company}</p>
                        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                          {exp.start} — {exp.current ? <span style={{ color: '#4ade80' }}>Present</span> : exp.end}
                        </p>
                      </div>
                    </div>

                    {/* Achievements */}
                    <ul className="space-y-2 text-left">
                      {exp.achievements.map((a, j) => (
                        <li key={j} className="flex gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          <span style={{ color: 'var(--violet)', flexShrink: 0, marginTop: '3px' }}>▸</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 top-6 w-4 h-4 rounded-full border-2 -translate-x-1/2"
                  style={{ background: exp.current ? 'var(--cyan)' : 'var(--violet)', borderColor: 'var(--background)', boxShadow: `0 0 12px ${exp.current ? 'rgba(34,211,238,0.6)' : 'rgba(124,92,255,0.5)'}` }}
                />

                {/* Year badge (desktop) */}
                <div className="hidden md:flex md:w-[calc(50%-2rem)] items-center justify-center">
                  <span
                    className="tag font-mono"
                    style={{
                      background: 'rgba(124,92,255,0.1)',
                      color: 'var(--violet)',
                      border: '1px solid rgba(124,92,255,0.2)',
                      fontSize: '11px',
                    }}
                  >
                    {exp.start.split(' ')[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

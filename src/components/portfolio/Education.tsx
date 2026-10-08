import { useData } from '../../contexts/DataContext';

export default function Education() {
  const { data } = useData();
  const degrees = data.education.filter(e => e.type === 'degree');
  const certs = data.education.filter(e => e.type === 'cert');

  return (
    <section id="education" className="py-24 relative" style={{ zIndex: 1 }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <div className="section-label justify-center">Background</div>
          <h2 className="section-heading">
            Education &amp; <em className="gradient-text not-italic">Certifications</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Degrees */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest mb-6 reveal" style={{ color: 'var(--violet)' }}>
              — Academic
            </h3>
            <div className="space-y-4">
              {degrees.map((edu, i) => (
                <div
                  key={edu.id}
                  className="glass p-5 reveal hover:border-violet-500/20 transition-colors"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                      style={{ background: 'rgba(124,92,255,0.1)', border: '1px solid rgba(124,92,255,0.2)' }}
                    >
                      🎓
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{edu.degree}</h4>
                      <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--cyan)' }}>{edu.institution}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                        {edu.start}–{edu.end}
                        {edu.gpa && <span className="ml-2 tag tag-violet">GPA {edu.gpa}</span>}
                      </p>
                      {edu.description && (
                        <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest mb-6 reveal" style={{ color: 'var(--cyan)' }}>
              — Certifications
            </h3>
            <div className="space-y-4">
              {certs.map((cert, i) => (
                <div
                  key={cert.id}
                  className="glass p-5 reveal hover:border-cyan-500/20 transition-colors"
                  style={{ transitionDelay: `${i * 0.1 + 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                      style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.15)' }}
                    >
                      📜
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{cert.degree}</h4>
                      <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--cyan)' }}>
                        {cert.institution}
                        <span className="ml-2 tag tag-cyan">{cert.field}</span>
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                        {cert.start}{cert.end ? `–${cert.end}` : ''}
                      </p>
                      {cert.description && (
                        <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                          {cert.description}
                        </p>
                      )}
                      {cert.certUrl && (
                        <a href={cert.certUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs mt-2 inline-flex items-center gap-1"
                          style={{ color: 'var(--violet)' }}
                        >
                          View Certificate →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

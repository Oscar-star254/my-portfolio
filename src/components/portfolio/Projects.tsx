import { useState } from 'react';
import { useData } from '../../contexts/DataContext';

const FILTER_TABS = ['All', 'Web', 'Mobile', 'Design'];

export default function Projects() {
  const { data } = useData();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? data.projects.filter(p => p.status === 'published')
    : data.projects.filter(p => p.status === 'published' && p.category === filter);

  return (
    <section id="projects" className="py-24 relative" style={{ zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 reveal">
          <div className="section-label justify-center">Portfolio</div>
          <h2 className="section-heading">
            Selected <em className="gradient-text not-italic">work</em>
          </h2>
          <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Production projects I'm proud of — each one solving a real problem at scale.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-10 reveal">
          {FILTER_TABS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-5 py-2 rounded-full text-xs font-semibold font-mono transition-all duration-200"
              style={{
                background: filter === f ? 'linear-gradient(135deg, var(--violet), #5b3fd4)' : 'rgba(255,255,255,0.05)',
                color: filter === f ? '#fff' : 'var(--muted-foreground)',
                border: '1px solid',
                borderColor: filter === f ? 'transparent' : 'var(--border)',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} delay={i * 0.07} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, delay }: { project: any; delay: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x, y });
  };

  return (
    <div
      className="glass group cursor-default overflow-hidden reveal"
      style={{
        transitionDelay: `${delay}s`,
        transform: hovered ? `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateY(-4px)` : 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: hovered ? '0 20px 60px rgba(124,92,255,0.2)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      onMouseMove={handleMouse}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 180, background: 'var(--muted)' }}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(10,15,31,0.8))' }} />
        {project.featured && (
          <span className="absolute top-3 right-3 tag tag-cyan">Featured</span>
        )}
        <span className="absolute top-3 left-3 tag tag-violet">{project.category}</span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-base mb-2">{project.title}</h3>
        <p className="text-xs leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--muted-foreground)' }}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.slice(0, 4).map((t: string) => (
            <span key={t} className="tag tag-violet">{t}</span>
          ))}
          {project.tech.length > 4 && (
            <span className="tag" style={{ color: 'var(--muted-foreground)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center py-2 rounded-lg text-xs font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg, var(--violet), #5b3fd4)', color: '#fff' }}
            >
              Live Demo →
            </a>
          )}
          {project.sourceUrl && (
            <a
              href={project.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center py-2 rounded-lg text-xs font-semibold transition-all"
              style={{ border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--violet)'; (e.currentTarget as HTMLElement).style.color = 'var(--violet)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)'; }}
            >
              Source Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

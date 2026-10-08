import { useState, useEffect, useCallback } from 'react';
import { useData } from '../../contexts/DataContext';

export default function Testimonials() {
  const { data } = useData();
  const approved = data.testimonials.filter(t => t.approved);
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState<{ start: number | null }>({ start: null });

  const next = useCallback(() => setIdx(i => (i + 1) % approved.length), [approved.length]);
  const prev = useCallback(() => setIdx(i => (i - 1 + approved.length) % approved.length), [approved.length]);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  if (!approved.length) return null;

  const t = approved[idx];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden" style={{ zIndex: 1 }}>
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(124,92,255,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <div className="section-label justify-center">Social Proof</div>
          <h2 className="section-heading">
            What people <em className="gradient-text not-italic">say</em>
          </h2>
        </div>

        <div
          className="reveal"
          onMouseDown={e => setDrag({ start: e.clientX })}
          onMouseUp={e => {
            if (drag.start !== null) {
              const diff = e.clientX - drag.start;
              if (Math.abs(diff) > 50) diff < 0 ? next() : prev();
            }
            setDrag({ start: null });
          }}
        >
          <div
            className="glass-strong p-8 md:p-12 relative"
            style={{ cursor: 'grab', userSelect: 'none' }}
          >
            {/* Quote mark */}
            <div
              className="font-serif text-7xl font-bold leading-none mb-4"
              style={{ color: 'rgba(124,92,255,0.2)', lineHeight: 0.8 }}
            >
              "
            </div>

            {/* Quote */}
            <blockquote className="text-base md:text-lg leading-relaxed mb-8 font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
              {t.quote}
            </blockquote>

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < t.rating ? 'star-filled' : 'star-empty'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--violet), var(--cyan))', color: '#fff' }}
              >
                {t.name.split(' ').map(w => w[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs" style={{ color: 'var(--cyan)' }}>{t.role}</p>
              </div>
            </div>

            {/* Top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--violet), var(--cyan))' }} />
          </div>
        </div>

        {/* Dots + arrows */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button onClick={prev} className="p-2 rounded-full transition-all" style={{ color: 'var(--muted-foreground)', background: 'rgba(255,255,255,0.05)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--violet)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-foreground)')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-2">
            {approved.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="transition-all duration-300"
                style={{
                  width: i === idx ? 24 : 8,
                  height: 8,
                  borderRadius: 99,
                  background: i === idx ? 'var(--violet)' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>

          <button onClick={next} className="p-2 rounded-full transition-all" style={{ color: 'var(--muted-foreground)', background: 'rgba(255,255,255,0.05)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--violet)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-foreground)')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

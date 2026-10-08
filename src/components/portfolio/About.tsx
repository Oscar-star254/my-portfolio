import { useState, useEffect, useRef } from 'react';
import { useData } from '../../contexts/DataContext';

function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const duration = 1800;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, active]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function About() {
  const { data } = useData();
  const { profile } = data;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="py-24 relative" style={{ zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="reveal grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div className="section-label">About Me</div>
            <h2 className="section-heading">
              Turning ideas into<br />
              <em className="gradient-text not-italic">reliable systems</em>
            </h2>
            <div className="space-y-4">
              {profile.bio.split('\n').filter(Boolean).map((para, i) => (
                <p key={i} className="leading-relaxed" style={{ color: 'var(--muted-foreground)', fontSize: '15px' }}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {profile.stats.map((stat, i) => (
              <div
                key={i}
                className="glass reveal"
                style={{
                  padding: '28px 24px',
                  transitionDelay: `${i * 0.1}s`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: i % 2 === 0
                      ? 'linear-gradient(90deg, var(--violet), transparent)'
                      : 'linear-gradient(90deg, var(--cyan), transparent)',
                  }}
                />
                <div
                  className="font-serif font-semibold mb-1"
                  style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1, color: i % 2 === 0 ? 'var(--violet)' : 'var(--cyan)' }}
                >
                  <CountUp target={stat.value} suffix={stat.suffix} active={active} />
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import { animate, createScope } from 'animejs';
import { useReducedMotion } from '../hooks/useMotionPreferences';
import { useIntroReady } from '../motion/MotionContext';
import { stats } from '../data/stats';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function StatValue({ stat }) {
  const el = useRef(null);
  const reduced = useReducedMotion();
  const ready = useIntroReady();
  const played = useRef(false);

  useEffect(() => {
    const node = el.current;
    if (!node || stat.number === null || reduced || !ready || played.current) return;
    const scope = createScope({ root: node });
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      scope.add(() => {
        const obj = { value: 0 };
        animate(obj, {
          value: stat.number, duration: 1100, ease: 'out(3)',
          onUpdate: () => { node.textContent = `${Math.round(obj.value)}${stat.suffix}`; },
          onComplete: () => { played.current = true; },
        });
      });
    }, { threshold: 0.5 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      scope.revert();
      node.textContent = stat.value;
    };
  }, [stat, reduced, ready]);

  if (stat.number === null) {
    return <span>{stat.value}</span>;
  }

  return <><span className="sr-only">{stat.value}</span><span ref={el} aria-hidden="true">{stat.value}</span></>;
}

export default function Stats() {
  const ref = useScrollAnimation();

  return (
    <section className="border-y border-neon/10 bg-ink py-14">
      <div ref={ref} className="container-x scroll-reveal grid gap-0 overflow-hidden border border-neon/15 bg-panel/45 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div data-reveal data-delay={index * 60} key={stat.label} className="border-neon/10 px-6 py-8 text-center lg:border-r last:border-r-0">
            <p className="tabular-nums font-orbitron text-4xl font-black text-neon circuit-title md:text-5xl">
              <StatValue stat={stat} />
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-white/72">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { stats } from '../data/stats';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function StatValue({ stat }) {
  const el = useRef(null);

  useEffect(() => {
    if (!el.current || stat.number === null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.current.textContent = stat.value;
      return;
    }
    const obj = { value: 0 };
    gsap.to(obj, {
      value: stat.number,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: undefined,
      onUpdate: () => {
        el.current.textContent = `${Math.round(obj.value)}${stat.suffix}`;
      },
    });
  }, [stat]);

  if (stat.number === null) {
    return <span>{stat.value}</span>;
  }

  return <span ref={el}>0{stat.suffix}</span>;
}

export default function Stats() {
  const ref = useScrollAnimation();

  return (
    <section className="border-y border-neon/10 bg-ink py-14">
      <div ref={ref} className="container-x scroll-reveal grid gap-0 overflow-hidden border border-neon/15 bg-panel/45 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border-neon/10 px-6 py-8 text-center lg:border-r last:border-r-0">
            <p className="font-orbitron text-4xl font-black text-neon circuit-title md:text-5xl">
              <StatValue stat={stat} />
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-white/72">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


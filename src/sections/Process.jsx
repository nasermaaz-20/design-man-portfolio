import { processSteps } from '../data/process';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import GlowCard from '../components/ui/GlowCard';
import SectionLabel from '../components/ui/SectionLabel';
import { useEffect, useRef } from 'react';
import { animate, createScope, onScroll } from 'animejs';
import { useReducedMotion } from '../hooks/useMotionPreferences';
import { useIntroReady } from '../motion/MotionContext';

export default function Process() {
  const ref = useScrollAnimation();
  const grid = useRef(null);
  const reduced = useReducedMotion();
  const ready = useIntroReady();
  useEffect(() => {
    if (reduced || !ready) return;
    const root = grid.current;
    const stations = [...root.querySelectorAll('.process-station')];
    const scope = createScope({ root });
    scope.add(() => {
      const progress = { value: 0 };
      animate(progress, {
        value: [0, 1], ease: 'linear',
        autoplay: onScroll({ target: root, enter: { container: '80%', target: 'top' }, leave: { container: '50%', target: 'bottom' }, sync: true }),
        onUpdate: () => {
          root.style.setProperty('--process-progress', progress.value);
          stations.forEach((station, index) => station.classList.toggle('is-active', progress.value >= index / (stations.length - 1)));
        },
      });
    });
    return () => {
      scope.revert();
      root.style.removeProperty('--process-progress');
      stations.forEach((station) => station.classList.remove('is-active'));
    };
  }, [ready, reduced]);

  return (
    <section id="process" className="relative bg-[#06090d] py-24">
      <div ref={ref} className="container-x scroll-reveal">
        <div data-reveal><SectionLabel>My Process</SectionLabel></div>
        <div ref={grid} className="process-grid">
          <div className="process-rail" aria-hidden="true"><div className="process-progress" /></div>
          {processSteps.map(({ step, title, description, Icon }) => (
            <div key={step} data-reveal className="process-step">
            <div className="process-station"><span>{step}</span></div>
            <GlowCard className="relative h-full min-h-[210px]">
              <div className="mb-7 flex items-center justify-between">
                <Icon className="text-neon" size={38} />
                <span className="font-orbitron text-xl font-black text-white/80">{step}</span>
              </div>
              <h3 className="font-orbitron text-lg font-bold uppercase text-white">{title}</h3>
              <p className="mt-3 leading-7 text-steel">{description}</p>
            </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


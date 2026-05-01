import { processSteps } from '../data/process';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import GlowCard from '../components/ui/GlowCard';
import SectionLabel from '../components/ui/SectionLabel';

export default function Process() {
  const ref = useScrollAnimation();

  return (
    <section id="process" className="relative bg-[#06090d] py-24">
      <div ref={ref} className="container-x scroll-reveal">
        <SectionLabel>My Process</SectionLabel>
        <div className="grid gap-5 lg:grid-cols-4">
          {processSteps.map(({ step, title, description, Icon }) => (
            <GlowCard key={step} className="relative min-h-[210px]">
              <div className="mb-7 flex items-center justify-between">
                <Icon className="text-neon" size={38} />
                <span className="font-orbitron text-xl font-black text-white/80">{step}</span>
              </div>
              <h3 className="font-orbitron text-lg font-bold uppercase text-white">{title}</h3>
              <p className="mt-3 leading-7 text-steel">{description}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}


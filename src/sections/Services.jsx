import { services } from '../data/services';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import CircuitLines from '../components/background/CircuitLines';
import GlowCard from '../components/ui/GlowCard';
import SectionLabel from '../components/ui/SectionLabel';

export default function Services() {
  const ref = useScrollAnimation();

  return (
    <section id="services" className="relative overflow-hidden bg-[#06090d] py-24">
      <CircuitLines opacity={0.045} />
      <div ref={ref} className="container-x scroll-reveal">
        <SectionLabel>What I Do</SectionLabel>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <h2 className="max-w-3xl font-orbitron text-3xl font-black uppercase text-white md:text-5xl">
            Visual systems for brands that refuse to look average.
          </h2>
          <p className="max-w-md text-steel">Each service is built around clarity, memorability, and execution that survives real-world use.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map(({ title, description, Icon }) => (
            <GlowCard key={title} className="min-h-[250px]">
              <Icon className="mb-8 text-neon" size={46} />
              <h3 className="font-orbitron text-xl font-bold uppercase text-white">{title}</h3>
              <p className="mt-4 leading-7 text-steel">{description}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}


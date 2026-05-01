import { testimonials } from '../data/testimonials';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SectionLabel from '../components/ui/SectionLabel';
import { FaStar } from 'react-icons/fa';

export default function Testimonials() {
  const ref = useScrollAnimation();

  return (
    <section className="bg-[#06090d] py-24">
      <div ref={ref} className="container-x scroll-reveal">
        <SectionLabel>What Clients Say</SectionLabel>
        <div className="grid gap-5 lg:grid-cols-2">
          {testimonials.map((item) => (
            <figure key={item.name} className="hud-corners relative border border-neon/15 bg-panel/70 p-7">
              <div className="mb-5 flex items-start justify-between">
                <div className="font-orbitron text-5xl font-black text-neon leading-none">"</div>
                {item.rating && (
                  <div className="flex gap-1 text-neon">
                    {[...Array(item.rating)].map((_, i) => (
                      <FaStar key={i} size={14} />
                    ))}
                  </div>
                )}
              </div>
              <blockquote className="text-lg leading-8 text-white/82">{item.quote}</blockquote>
              <figcaption className="mt-7">
                <p className="font-orbitron text-lg font-bold uppercase text-white">{item.name}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-steel">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}


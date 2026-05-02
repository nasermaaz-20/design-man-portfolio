import Button from '../components/ui/Button';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import mascot from '../assets/images/mascot-thumb.png';

export default function FinalCTA() {
  const ref = useScrollAnimation();

  return (
    <section className="relative overflow-hidden bg-ink py-20">
      <div ref={ref} className="container-x scroll-reveal hud-corners relative grid items-center gap-8 border border-neon/15 bg-panel/60 p-8 md:grid-cols-[auto_1fr_auto] md:p-10">
        <img
          src={mascot}
          alt=""
          width="230"
          height="230"
          loading="lazy"
          decoding="async"
          className="h-24 w-24 rounded-[6px] border border-neon/20 object-cover shadow-cyanSm"
        />
        <h2 className="font-orbitron text-3xl font-black uppercase leading-tight text-white md:text-5xl">
          Let's build something <span className="text-neon">impactful</span> together.
        </h2>
        <Button as="a" href="https://wa.me/963940808403" target="_blank" rel="noreferrer">
          Start a project
        </Button>
      </div>
    </section>
  );
}

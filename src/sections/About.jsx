import { FiAward, FiClock, FiLayers, FiZap } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Button from '../components/ui/Button';
import SectionLabel from '../components/ui/SectionLabel';
import portrait from '../assets/images/yaman-portrait.png';

const badges = [
  ['5+', 'Years of Experience', FiAward],
  ['50+', 'Projects Completed', FiLayers],
  ['10+', 'Brands Worked With', FiZap],
  ['Fast', 'Turnaround Time', FiClock],
];

export default function About() {
  const ref = useScrollAnimation();

  return (
    <section id="about" className="relative bg-ink py-24">
      <div ref={ref} className="container-x scroll-reveal grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <SectionLabel>About Me</SectionLabel>
          <h2 className="font-orbitron text-4xl font-black uppercase leading-tight text-white md:text-5xl">
            Design with <span className="text-neon">purpose.</span>
            <br />
            Create with <span className="text-neon">passion.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-steel">
            I am Yaman Balkesh, a graphic designer with over 5 years of experience in branding, social media, packaging, and advertising. I turn ideas into powerful visuals that help brands stand out and grow.
          </p>
          <div className="mt-9 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {badges.map(([value, label, Icon]) => (
              <div key={label}>
                <Icon className="mb-3 text-neon" size={25} />
                <p className="font-orbitron text-2xl font-black text-neon">{value}</p>
                <p className="mt-1 text-sm leading-5 text-steel">{label}</p>
              </div>
            ))}
          </div>
          <Button as="a" href="https://www.linkedin.com/in/yaman-balkesh" className="mt-9">More about me</Button>
        </div>
        <div className="hud-corners relative overflow-hidden border border-neon/20 bg-panel/70 p-3 shadow-cyanSm">
          <img src={portrait} alt="Yaman Balkesh portrait" className="aspect-[1.18/1] w-full object-cover object-center" />
          <div className="absolute inset-3 border border-neon/10" />
        </div>
      </div>
    </section>
  );
}


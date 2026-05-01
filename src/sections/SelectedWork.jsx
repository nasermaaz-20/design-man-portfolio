import { projects } from '../data/projects';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import GlowCard from '../components/ui/GlowCard';
import ProjectArt from '../components/ui/ProjectArt';
import SectionLabel from '../components/ui/SectionLabel';

export default function SelectedWork({ onSelectProject }) {
  const ref = useScrollAnimation();

  return (
    <section id="work" className="relative border-y border-neon/10 bg-ink py-24">
      <div ref={ref} className="container-x scroll-reveal">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionLabel>Selected Work</SectionLabel>
            <h2 className="font-orbitron text-3xl font-black uppercase text-white md:text-5xl">Projects built to be remembered.</h2>
          </div>
          <p className="max-w-md text-steel">Five visual systems that show range: tech, food, gaming, editorial, and premium product campaigns.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {projects.map((project) => (
            <button key={project.id} type="button" onClick={() => onSelectProject(project)} className="group text-left">
              <GlowCard className="h-full p-0">
                <ProjectArt project={project} />
                <div className="p-4">
                  <h3 className="font-orbitron text-lg font-bold uppercase text-white transition group-hover:text-neon">{project.title}</h3>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-steel">{project.category}</p>
                </div>
              </GlowCard>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}


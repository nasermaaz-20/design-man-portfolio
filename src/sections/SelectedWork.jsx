import { projects } from '../data/projects';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import GlowCard from '../components/ui/GlowCard';
import ProjectArt from '../components/ui/ProjectArt';
import SectionLabel from '../components/ui/SectionLabel';
import { FiArrowUpRight } from 'react-icons/fi';

export default function SelectedWork({ onSelectProject }) {
  const ref = useScrollAnimation();

  return (
    <section id="work" className="relative border-y border-neon/10 bg-ink py-24">
      <div ref={ref} className="container-x scroll-reveal">
        <div data-reveal className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionLabel>Selected Work</SectionLabel>
            <h2 className="font-orbitron text-3xl font-black uppercase text-white md:text-5xl">Projects built to be remembered.</h2>
          </div>
          <p className="max-w-md text-steel">Five visual systems that show range: tech, food, gaming, editorial, and premium product campaigns.</p>
        </div>

        <div className="work-grid">
          {projects.map((project, index) => (
            <div key={project.id} className={index === 0 ? 'work-featured' : ''}>
              <button type="button" onClick={(event) => onSelectProject(project, event.currentTarget)} className="project-trigger group block w-full text-left" aria-label={`View ${project.title.trim()} project`}>
                <GlowCard className="project-card h-full p-1">
                  <div data-reveal="image" className="project-image-shell"><ProjectArt project={project} /></div>
                  <div data-reveal className="flex items-center justify-between gap-5 p-5 md:p-7">
                    <div>
                      <h3 className="font-orbitron text-xl font-bold uppercase text-white transition-colors group-hover:text-neon md:text-3xl">{project.title}</h3>
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-steel">{project.category}</p>
                    </div>
                    <FiArrowUpRight className="project-arrow shrink-0 text-neon" size={27} aria-hidden="true" />
                  </div>
                </GlowCard>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


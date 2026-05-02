import { FiX } from 'react-icons/fi';
import Button from './Button';
import ProjectArt from './ProjectArt';

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="hud-corners relative max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-neon/25 bg-[#06090d] shadow-cyanLg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center border border-neon/30 bg-black/60 text-neon transition hover:border-neon hover:shadow-cyanSm"
          aria-label="Close project details"
        >
          <FiX />
        </button>
        <div className="grid gap-0 md:grid-cols-[1.1fr_.9fr]">
          <ProjectArt project={project} loading="eager" fetchPriority="high" />
          <div className="p-7 md:p-9">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-neon">{project.category}</p>
            <h3 className="mt-4 font-orbitron text-3xl font-black uppercase text-white md:text-4xl">{project.title}</h3>
            <p className="mt-4 text-lg leading-8 text-steel">{project.summary}</p>
            <div className="mt-7 space-y-5">
              <div>
                <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-neon">Challenge</h4>
                <p className="mt-2 leading-7 text-white/78">{project.challenge}</p>
              </div>
              <div>
                <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-neon">Solution</h4>
                <p className="mt-2 leading-7 text-white/78">{project.solution}</p>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {project.deliverables.map((item) => (
                <span key={item} className="border border-neon/20 bg-neon/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-softCyan">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {project.link && (
                <Button as="a" href={project.link} target="_blank" rel="noopener noreferrer">
                  View Project
                </Button>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

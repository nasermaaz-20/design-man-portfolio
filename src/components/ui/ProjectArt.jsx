import { FiBox, FiCpu, FiShield, FiSmartphone } from 'react-icons/fi';
import { HiOutlineNewspaper } from 'react-icons/hi2';

const iconMap = {
  trapnet: FiShield,
  'happy-bun': FiBox,
  'damascus-secrets': FiCpu,
  'traitor-magazine': HiOutlineNewspaper,
  'iphone-campaign': FiSmartphone,
};

export default function ProjectArt({ project }) {
  if (project.image) {
    return (
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#05080f]">
        <img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#05080f] to-transparent" />
        <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/90 drop-shadow-md">
          {project.category.split('/')[0].trim()}
        </div>
      </div>
    );
  }

  const Icon = iconMap[project.id] || FiCpu;

  return (
    <div
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#05080f]"
      style={{
        background:
          project.id === 'happy-bun'
            ? 'radial-gradient(circle at 55% 45%, rgba(244,182,59,.28), transparent 34%), linear-gradient(135deg, #150d05, #05080f 72%)'
            : project.id === 'traitor-magazine'
              ? 'radial-gradient(circle at 50% 44%, rgba(226,61,61,.32), transparent 36%), linear-gradient(135deg, #160506, #05080f 72%)'
              : project.id === 'damascus-secrets'
                ? 'radial-gradient(circle at 50% 40%, rgba(217,168,74,.22), transparent 34%), linear-gradient(135deg, #071017, #05080f 72%)'
                : 'radial-gradient(circle at 50% 44%, rgba(0,245,212,.24), transparent 34%), linear-gradient(135deg, #071019, #05080f 72%)',
      }}
    >
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
        {project.category.split('/')[0].trim()}
      </div>
      <div
        className="relative grid h-24 w-24 place-items-center rounded-[6px] border bg-black/30"
        style={{
          borderColor: project.accent,
          boxShadow: `0 0 32px ${project.accent}55`,
          color: project.accent,
        }}
      >
        <Icon size={42} />
      </div>
      <div className="absolute bottom-5 left-5 right-5">
        <p className="font-orbitron text-xl font-black uppercase tracking-wide text-white">{project.title}</p>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-white/40 via-white/10 to-transparent" />
      </div>
    </div>
  );
}


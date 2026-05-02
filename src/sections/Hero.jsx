import { motion } from 'framer-motion';
import { FaBehance, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FiArrowDown, FiBox, FiGrid, FiPenTool } from 'react-icons/fi';
import { HiOutlineMegaphone } from 'react-icons/hi2';
import Button from '../components/ui/Button';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import heroBg from '../assets/images/optimized/hero-bg.jpg';
import heroBgMo from '../assets/images/optimized/hero-bg-mo.jpg';

const services = [
  ['Brand Identity', FiPenTool],
  ['Social Media Design', FiGrid],
  ['Packaging Design', FiBox],
  ['Advertising Campaigns', HiOutlineMegaphone],
];

export default function Hero() {
  const ref = useScrollAnimation(0.08);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-ink pt-24">
      <div className="absolute inset-0">
        <picture>
          <source media="(min-width: 768px)" srcSet={heroBg} width="1600" height="901" />
          <img
            src={heroBgMo}
            alt=""
            width="853"
            height="1844"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-center opacity-90"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/72 to-ink/8" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/20" />
      </div>

      <div ref={ref} className="container-x scroll-reveal relative z-10 grid min-h-[calc(100vh-6rem)] items-center gap-10 py-14 lg:grid-cols-[.92fr_1.08fr]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="max-w-3xl">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-neon">/// Graphic Designer</p>
          <h1 className="mt-8 font-orbitron text-5xl font-black uppercase leading-[1.04] tracking-normal text-white md:text-7xl">
            I design brands <br />
            that <span className="circuit-title text-neon">stand out.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-steel">
            I help brands stand out through bold design, smart strategy, and powerful visual systems.
          </p>
          <div className="mt-5 flex max-w-2xl flex-wrap gap-x-4 gap-y-2 font-mono text-sm text-white/78">
            {['Brand Identity', 'Social Media', 'Packaging', 'UI/UX Design', 'Advertising Campaigns'].map((tag) => (
              <span key={tag} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-cyanSm" />
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button as="a" href="#contact">Start a project</Button>
            <Button as="a" href="#work" variant="secondary">View my work</Button>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-5">
            <a href="#work" className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-steel transition hover:text-neon">
              <FiArrowDown className="text-neon" /> Scroll down
            </a>
            <div className="h-px w-28 bg-gradient-to-r from-neon to-transparent" />
            <div className="flex gap-3">
              {[
                { Icon: FaBehance, href: 'https://www.behance.net/jeffpunky5j' },
                { Icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/yaman-balkesh' },
                { Icon: FaInstagram, href: 'https://www.instagram.com/designman7580' }
              ].map(({ Icon, href }, index) => (
                <a key={index} href={href} target="_blank" rel="noreferrer" className="grid h-12 w-12 place-items-center border border-neon/20 bg-black/20 text-steel transition hover:border-neon hover:text-neon hover:shadow-cyanSm" aria-label="Social profile">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15 }} className="relative hidden min-h-[620px] lg:block">
          <div className="absolute right-0 top-10 max-w-[230px] border border-neon/20 bg-black/25 p-5 font-mono text-sm uppercase tracking-[0.14em] text-steel backdrop-blur">
            Design is intelligence made visible.
          </div>
          <motion.div className="absolute bottom-7 right-0 w-[330px] border border-neon/25 bg-black/35 p-5 shadow-cyanSm backdrop-blur-md" animate={{ y: [0, -8, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-neon">Services :</p>
            <div className="grid gap-3">
              {services.map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.08em] text-white/80">
                  <Icon className="text-neon" size={21} />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

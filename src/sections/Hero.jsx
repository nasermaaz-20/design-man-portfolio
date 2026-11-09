import { useEffect, useRef } from 'react';
import { animate, createScope, createTimeline, onScroll, stagger } from 'animejs';
import { FaBehance, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FiArrowDown, FiBox, FiGrid, FiPenTool } from 'react-icons/fi';
import { HiOutlineMegaphone } from 'react-icons/hi2';
import Button from '../components/ui/Button';
import { useReducedMotion } from '../hooks/useMotionPreferences';
import { useIntroReady } from '../motion/MotionContext';
import heroBg from '../assets/images/optimized/hero-bg.jpg';
import heroBgMo from '../assets/images/optimized/hero-bg-mo.jpg';

const services = [
  ['Brand Identity', FiPenTool],
  ['Social Media Design', FiGrid],
  ['Packaging Design', FiBox],
  ['Advertising Campaigns', HiOutlineMegaphone],
];

export default function Hero() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const ready = useIntroReady();
  const played = useRef(false);
  useEffect(() => {
    if (!ready || reduced || played.current || window.scrollY > window.innerHeight) return;
    const scope = createScope({ root: ref });
    scope.add(() => {
      createTimeline({ defaults: { ease: 'out(3)' }, onComplete: () => { played.current = true; } })
        .add('.hero-line', { y: ['110%', '0%'], duration: 700, delay: stagger(90) }, 0)
        .add('.hero-enter', { opacity: [0, 1], y: [16, 0], duration: 460, delay: stagger(55) }, 100)
        .add('.hero-rule', { scaleX: [0, 1], duration: 650 }, 100)
        .add('.hero-panel', { opacity: [0, 1], x: [20, 0], duration: 600, delay: stagger(90) }, 140);
    });
    return () => scope.revert();
  }, [ready, reduced]);

  useEffect(() => {
    if (!ready || reduced) return;
    const scope = createScope({ root: ref, mediaQueries: { wide: '(min-width: 1024px)' } });
    scope.add((self) => {
      if (!self.matches.wide) return;
      animate('.hero-scene', {
        y: [0, 24], ease: 'linear',
        autoplay: onScroll({ target: ref.current, enter: 'top top', leave: 'top bottom', sync: true }),
      });
    });
    return () => scope.revert();
  }, [ready, reduced]);

  return (
    <section ref={ref} id="home" className="relative min-h-screen overflow-hidden bg-ink pt-24">
      <div className="hero-scene absolute -inset-y-7 inset-x-0">
        <picture>
          <source media="(min-width: 768px)" srcSet={heroBg} width="1600" height="901" />
          <img
            data-hero-image
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

      <div className="container-x relative z-10 grid min-h-[calc(100svh-6rem)] items-center gap-10 py-14 lg:grid-cols-[1.1fr_.9fr]">
        <div className="max-w-3xl">
          <p className="hero-enter font-mono text-sm font-bold uppercase tracking-[0.18em] text-neon">/// Graphic Designer</p>
          <h1 className="hero-title mt-8 font-orbitron font-black uppercase leading-[1.1] tracking-normal text-white">
            <span className="hero-line-mask"><span className="hero-line">I design brands</span></span>
            <span className="hero-line-mask"><span className="hero-line">that <span className="circuit-title text-neon">stand out.</span></span></span>
          </h1>
          <div className="hero-rule mt-7 h-px w-28 origin-left bg-neon/60" aria-hidden="true" />
          <p className="hero-enter mt-6 max-w-2xl text-xl leading-8 text-steel">
            I help brands stand out through bold design, smart strategy, and powerful visual systems.
          </p>
          <div className="hero-enter mt-5 flex max-w-2xl flex-wrap gap-x-4 gap-y-2 font-mono text-sm text-white/78">
            {['Brand Identity', 'Social Media', 'Packaging', 'UI/UX Design', 'Advertising Campaigns'].map((tag) => (
              <span key={tag} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-cyanSm" />
                {tag}
              </span>
            ))}
          </div>
          <div className="hero-enter mt-9 flex flex-wrap gap-4">
            <Button as="a" href="#contact">Start a project</Button>
            <Button as="a" href="#work" variant="secondary">View my work</Button>
          </div>
          <div className="hero-enter mt-12 flex flex-wrap items-center gap-5">
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
        </div>

        <div className="relative hidden min-h-[620px] lg:block">
          <div className="hero-panel absolute right-0 top-10 max-w-[230px] border border-neon/20 bg-black/25 p-5 font-mono text-sm uppercase tracking-[0.14em] text-steel backdrop-blur">
            Design is intelligence made visible.
          </div>
          <div className="hero-panel absolute bottom-7 right-0 w-[330px] border border-neon/25 bg-black/35 p-5 shadow-cyanSm backdrop-blur-md">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-neon">Services :</p>
            <div className="grid gap-3">
              {services.map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.08em] text-white/80">
                  <Icon className="text-neon" size={21} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import { animate, createScope } from 'animejs';
import { useReducedMotion } from '../../hooks/useMotionPreferences';
import { useIntroReady } from '../../motion/MotionContext';
import { FiArrowRight, FiMenu, FiX } from 'react-icons/fi';
import brandLogo from '../../assets/images/optimized/brand-logo-strip.png';

const links = [
  ['Work', 'work'],
  ['About', 'about'],
  ['Services', 'services'],
  ['Process', 'process'],
  ['Contact', 'contact'],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const root = useRef(null);
  const menu = useRef(null);
  const menuButton = useRef(null);
  const progress = useRef(null);
  const indicator = useRef(null);
  const navLinks = useRef(null);
  const reduced = useReducedMotion();
  const ready = useIntroReady();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
      const sections = links.map(([_, id]) => document.getElementById(id)).filter(Boolean);
      let current = '';
      for (const section of sections) {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          current = section.getAttribute('id');
        }
      }

      // If scrolled to the bottom of the page, activate the last link
      if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 150) {
        current = links[links.length - 1][1];
      }
      setActiveSection(current);
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    const resize = new ResizeObserver(onScroll);
    resize.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!ready || reduced) return;
    const scope = createScope({ root });
    scope.add(() => animate(root.current, { y: [-16, 0], opacity: [0, 1], duration: 500, ease: 'out(3)' }));
    return () => scope.revert();
  }, [ready, reduced]);

  useEffect(() => {
    const marker = indicator.current;
    const link = navLinks.current?.querySelector(`[href="#${activeSection}"]`);
    if (!marker) return;
    marker.style.opacity = link ? '1' : '0';
    if (!link) return;
    const scope = createScope({ root: navLinks });
    const update = () => {
      scope.add(() => animate(marker, { x: link.offsetLeft, scaleX: link.offsetWidth, duration: reduced ? 0 : 280, ease: 'out(3)' }));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(navLinks.current);
    return () => { observer.disconnect(); scope.revert(); };
  }, [activeSection, reduced]);

  useEffect(() => {
    if (!menuVisible || !menu.current) return;
    const scope = createScope({ root: menu });
    scope.add(() => animate(menu.current, {
      opacity: open ? [0, 1] : [1, 0], y: open ? [-10, 0] : [0, -8],
      duration: reduced ? 0 : open ? 220 : 150, ease: 'out(3)',
      onComplete: () => { if (!open) setMenuVisible(false); },
    }));
    return () => scope.revert();
  }, [open, menuVisible, reduced]);

  useEffect(() => {
    if (!open) return;
    const key = (event) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); }
    };
    const wide = matchMedia('(min-width: 1024px)');
    const resize = () => { if (wide.matches) setOpen(false); };
    document.addEventListener('keydown', key);
    wide.addEventListener('change', resize);
    return () => { document.removeEventListener('keydown', key); wide.removeEventListener('change', resize); };
  }, [open]);

  return (
    <header ref={root} className={`site-nav fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? 'border-b border-neon/10 bg-ink/95 backdrop-blur-xl' : 'bg-transparent'}`}>
      <nav className="container-x flex min-h-[74px] items-center justify-between gap-5">
        <a href="#home" className="flex items-center gap-3" aria-label="DESIGN-MAN home">
          <img
            src={brandLogo}
            alt=""
            width="768"
            height="120"
            fetchPriority="high"
            decoding="async"
            className="h-10 w-52 object-contain object-left sm:w-64 lg:w-64 xl:w-72"
          />
        </a>

        <div ref={navLinks} className="nav-links relative hidden items-center gap-5 lg:flex xl:gap-8">
          <span ref={indicator} className="nav-indicator" aria-hidden="true" />
          {links.map(([label, id]) => (
            <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined} className={`py-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors hover:text-neon ${activeSection === id ? 'text-neon' : 'text-white/80'}`}>
              {label}
            </a>
          ))}
        </div>

        <a
          href="https://wa.me/963940808403"
          className="hidden min-h-11 items-center gap-3 rounded-[5px] border border-neon/55 px-5 font-orbitron text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-neon hover:text-neon lg:inline-flex"
        >
          Start a project <FiArrowRight />
        </a>

        <button
          type="button"
          ref={menuButton}
          onClick={() => { if (!open) setMenuVisible(true); setOpen((value) => !value); }}
          className="grid h-11 w-11 shrink-0 place-items-center border border-neon/25 text-neon lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {menuVisible && (
        <div ref={menu} id="mobile-navigation" inert={!open} className="max-h-[calc(100svh-74px)] overflow-y-auto border-t border-neon/10 bg-ink/95 px-4 py-5 lg:hidden" data-lenis-prevent>
          <div className="grid gap-3">
            {links.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={`border px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] ${activeSection === id ? 'border-neon/50 text-neon' : 'border-neon/10 text-steel'}`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
      <div ref={progress} className="page-progress" aria-hidden="true" />
    </header>
  );
}

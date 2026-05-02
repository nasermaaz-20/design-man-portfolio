import { useEffect, useState } from 'react';
import { FiArrowRight, FiMenu, FiX } from 'react-icons/fi';
import brandLogo from '../../assets/images/optimized/brand-logo-strip.png';

const links = [
  ['Work', 'work'],
  ['Services', 'services'],
  ['About', 'about'],
  ['Process', 'process'],
  ['Contact', 'contact'],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => {
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
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${scrolled || open ? 'border-b border-neon/10 bg-ink/88 backdrop-blur-xl' : 'bg-transparent'}`}>
      <nav className="container-x flex min-h-[74px] items-center justify-between gap-5">
        <a href="#home" className="flex items-center gap-3" aria-label="DESIGN-MAN home">
          <img
            src={brandLogo}
            alt=""
            width="768"
            height="120"
            fetchPriority="high"
            decoding="async"
            className="h-10 w-64 object-cover object-center md:w-72"
          />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map(([label, id]) => (
            <a key={id} href={`#${id}`} className={`font-mono text-xs font-bold uppercase tracking-[0.14em] transition hover:text-neon ${activeSection === id ? 'text-neon' : 'text-white/74'}`}>
              {label}
            </a>
          ))}
        </div>

        <a
          href="https://wa.me/963940808403"
          className="hidden min-h-11 items-center gap-3 rounded-[5px] border border-neon/55 px-5 font-orbitron text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:border-neon hover:text-neon hover:shadow-cyanSm md:inline-flex"
        >
          Start a project <FiArrowRight />
        </a>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center border border-neon/25 text-neon md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-neon/10 bg-ink/96 px-4 py-5 md:hidden">
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
    </header>
  );
}

import { FaBehance, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import brandLogo from '../../assets/images/brand-logo-wide.png';

export default function Footer() {
  return (
    <footer className="border-t border-neon/10 bg-[#050609] py-14">
      <div className="container-x grid gap-10 md:grid-cols-[1.2fr_.8fr_1fr]">
        <div>
          <img src={brandLogo} alt="DESIGN-MAN" className="h-12 w-72 object-cover object-center" />
          <p className="mt-4 max-w-sm font-mono text-xs uppercase tracking-[0.16em] text-steel/70">
            Visual identities that empower brands.
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-neon">Navigation</p>
          <div className="mt-4 grid gap-2 font-mono text-xs uppercase tracking-[0.14em] text-steel">
            {['Work', 'Services', 'About', 'Process', 'Contact'].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="transition hover:text-neon">
                {link}
              </a>
            ))}
          </div>
        </div>
        <div id="contact">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-neon">Contact</p>
          <div className="mt-4 space-y-3 font-mono text-sm text-steel">
            <p>
              <a href="mailto:yamanbalkesh7580@gmail.com" className="transition hover:text-neon">yamanbalkesh7580@gmail.com</a>
            </p>
            <p>
              <a href="https://wa.me/963940808403" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-neon">
                
                +963 940 808 403
              </a>
            </p>
          </div>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: FaBehance, href: 'https://www.behance.net/jeffpunky5j' },
              { Icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/yaman-balkesh' },
              { Icon: FaInstagram, href: 'https://www.instagram.com/designman7580' }
            ].map(({ Icon, href }, index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label="Social profile"
                className="grid h-10 w-10 place-items-center border border-neon/20 text-steel transition hover:border-neon hover:text-neon hover:shadow-cyanSm"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container-x mt-10 border-t border-neon/10 pt-6 font-mono text-xs uppercase tracking-[0.14em] text-steel/45">
        (c) 2026 DESIGN-MAN. Crafted with precision.
      </div>
    </footer>
  );
}


import { FiArrowUpRight, FiFileText } from 'react-icons/fi';
import Button from '../components/ui/Button';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { portfolio } from '../data/portfolio';
import '../styles/portfolio-feature.css';

export default function Portfolio() {
  const ref = useScrollAnimation();
  return (
    <section id="portfolio" ref={ref} className="bg-ink py-16 md:py-24" aria-labelledby="portfolio-heading">
      <div className="container-x portfolio-feature">
        <a href={portfolio.href} className="portfolio-cover" aria-label="View the full portfolio">
          <div data-reveal="image">
            <img src={portfolio.cover} width="1440" height="810" loading="lazy" decoding="async" alt="Yaman Balkesh, graphic designer. Portfolio 2026 cover." />
          </div>
          <span className="portfolio-cover-arrow" aria-hidden="true"><FiArrowUpRight size={24} /></span>
        </a>
        <div data-reveal className="portfolio-feature-copy">
          <h2 id="portfolio-heading" className="font-orbitron text-3xl font-black uppercase leading-tight md:text-4xl">The full<br /><span className="text-neon">picture.</span></h2>
          <p className="mt-5 max-w-md text-lg leading-7 text-steel">A closer look at the identities, campaigns and visual systems behind the work.</p>
          <p className="portfolio-file-meta"><FiFileText aria-hidden="true" /><span>Portfolio 2026</span><span>{portfolio.pages} pages</span><span>{portfolio.size}</span></p>
          <Button as="a" href={portfolio.href}>View Portfolio</Button>
        </div>
      </div>
    </section>
  );
}

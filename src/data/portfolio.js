import pdfUrl from '../../output/pdf/yaman-balkesh-portfolio-2026.pdf?url';
import { outputBytes, pages } from '../../output/pdf/optimization-report.json';
import cover from '../assets/images/optimized/portfolio-cover.webp';

export const portfolio = {
  url: pdfUrl,
  href: `${import.meta.env.BASE_URL}portfolio/`,
  home: `${import.meta.env.BASE_URL}#portfolio`,
  title: 'Yaman Balkesh — Portfolio 2026',
  pages,
  size: `${(outputBytes / 1000000).toFixed(1)} MB`,
  cover,
  width: 1440,
  height: 810,
};

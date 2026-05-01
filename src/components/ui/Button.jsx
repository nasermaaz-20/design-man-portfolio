import { FiArrowRight } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export default function Button({ children, variant = 'primary', className = '', as = 'button', href, onClick }) {
  const Component = as === 'a' ? 'a' : 'button';
  const base =
    'group inline-flex min-h-12 items-center justify-center gap-3 rounded-[5px] px-6 py-3 font-orbitron text-xs font-bold uppercase tracking-[0.14em] transition duration-300 focus:outline-none focus:ring-2 focus:ring-neon/60';
  const variants = {
    primary:
      'border border-neon bg-neon/8 text-neon shadow-cyanSm hover:bg-neon hover:text-ink hover:shadow-cyanMd',
    secondary:
      'border border-white/20 bg-white/[0.02] text-white hover:border-neon/70 hover:text-neon hover:shadow-cyanSm',
  };

  return (
    <Component href={href} onClick={onClick} className={cn(base, variants[variant], className)}>
      <span>{children}</span>
      {variant === 'primary' && <FiArrowRight className="transition group-hover:translate-x-1" aria-hidden="true" />}
    </Component>
  );
}


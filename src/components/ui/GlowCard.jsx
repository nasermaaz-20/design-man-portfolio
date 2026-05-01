import { cn } from '../../utils/cn';

export default function GlowCard({ children, className = '' }) {
  return (
    <div
      className={cn(
        'scan-sweep clip-corners relative overflow-hidden border border-neon/15 bg-panel/78 p-6 shadow-[inset_0_0_28px_rgba(0,245,212,0.025)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-neon/70 hover:shadow-cyanMd',
        className,
      )}
    >
      {children}
    </div>
  );
}


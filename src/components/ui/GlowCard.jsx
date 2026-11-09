import { cn } from '../../utils/cn';

export default function GlowCard({ children, className = '' }) {
  return (
    <div
      className={cn(
        'glow-card scan-sweep clip-corners relative overflow-hidden border border-neon/15 bg-panel/78 p-6 shadow-[inset_0_0_28px_rgba(0,245,212,0.025)] backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}


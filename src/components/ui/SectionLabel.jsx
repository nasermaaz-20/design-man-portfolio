export default function SectionLabel({ children }) {
  return (
    <p className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-neon">
      <span className="h-px w-7 bg-neon shadow-cyanSm" aria-hidden="true" />
      <span>/// {children}</span>
    </p>
  );
}


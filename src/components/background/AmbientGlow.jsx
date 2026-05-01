export default function AmbientGlow({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full bg-neon/12 blur-3xl animate-pulseGlow ${className}`}
      aria-hidden="true"
    />
  );
}


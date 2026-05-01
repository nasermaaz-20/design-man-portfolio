export default function CircuitLines({ opacity = 0.08 }) {
  return (
    <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ opacity }} aria-hidden="true">
      <defs>
        <pattern id="circuit-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M0 42h38l18 18h64M68 0v35l15 15v70M0 96h48l22-22h50" fill="none" stroke="#00F5D4" strokeWidth="0.8" />
          <circle cx="38" cy="42" r="2.5" fill="#00F5D4" />
          <circle cx="83" cy="50" r="2.5" fill="#00F5D4" />
          <circle cx="70" cy="74" r="2.5" fill="#00F5D4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
    </svg>
  );
}


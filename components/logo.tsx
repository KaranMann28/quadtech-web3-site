export function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.5">
        <line x1="50" y1="50" x2="50" y2="28" />
        <line x1="50" y1="50" x2="69" y2="39" />
        <line x1="50" y1="50" x2="69" y2="61" />
        <line x1="50" y1="50" x2="50" y2="72" />
        <line x1="50" y1="50" x2="31" y2="61" />
        <line x1="50" y1="50" x2="31" y2="39" />
        <line x1="50" y1="28" x2="69" y2="39" />
        <line x1="69" y1="39" x2="69" y2="61" />
        <line x1="69" y1="61" x2="50" y2="72" />
        <line x1="50" y1="72" x2="31" y2="61" />
        <line x1="31" y1="61" x2="31" y2="39" />
        <line x1="31" y1="39" x2="50" y2="28" />
      </g>
      <circle cx="50" cy="50" r="3.5" fill="currentColor" />
      <circle cx="50" cy="28" r="2.5" fill="currentColor" />
      <circle cx="69" cy="39" r="2.5" fill="currentColor" />
      <circle cx="69" cy="61" r="2.5" fill="currentColor" />
      <circle cx="50" cy="72" r="2.5" fill="currentColor" />
      <circle cx="31" cy="61" r="2.5" fill="currentColor" />
      <circle cx="31" cy="39" r="2.5" fill="currentColor" />
    </svg>
  );
}

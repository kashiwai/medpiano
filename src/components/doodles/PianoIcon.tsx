export function PianoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      role="img"
      aria-label="Grand piano illustration"
    >
      <rect x="5" y="10" width="90" height="45" rx="4" fill="currentColor" fillOpacity="0.1" />
      {[10, 22, 34, 46, 58, 70, 82].map((x) => (
        <line key={x} x1={x} y1="10" x2={x} y2="55" strokeWidth="2" />
      ))}
      {[15, 27, 51, 63, 75].map((x) => (
        <rect key={x} x={x - 4} y="10" width="8" height="28" fill="currentColor" />
      ))}
    </svg>
  );
}

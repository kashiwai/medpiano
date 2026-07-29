export function GrowthArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 120" className={className} fill="none" aria-hidden="true">
      <path
        d="M10 100 Q 100 100 150 70 T 390 15"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M390 15 L 365 12 M390 15 L 375 35" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

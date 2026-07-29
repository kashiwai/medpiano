export function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className} fill="none" aria-hidden="true">
      <path d="M5 20 Q 20 5, 35 20 T 65 20 T 95 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

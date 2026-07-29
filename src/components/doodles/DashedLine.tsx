export function DashedLine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 20" className={className} fill="none" aria-hidden="true">
      <path d="M0 10 L100 10" stroke="currentColor" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" />
    </svg>
  );
}

export function CurlyArrow({ className, rotation = 0 }: { className?: string; rotation?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M15 25 Q 35 5 55 25 T 85 55" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M85 55 L 75 48 M 85 55 L 78 65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

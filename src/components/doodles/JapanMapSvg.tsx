// 詳細な地図ではなく、主要4島+沖縄を単純化した抽象図形（デザインは抽象化重視の方針）
export function JapanMapSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 320" className={className} fill="none" role="img" aria-label="Simplified map of Japan">
      {/* 北海道 */}
      <ellipse cx="140" cy="35" rx="35" ry="28" fill="currentColor" transform="rotate(-15 140 35)" />
      {/* 本州 */}
      <path
        d="M40 90 Q 90 80 150 100 Q 170 130 140 170 Q 100 200 70 190 Q 30 170 20 130 Q 20 100 40 90 Z"
        fill="currentColor"
      />
      {/* 四国 */}
      <ellipse cx="60" cy="210" rx="22" ry="12" fill="currentColor" transform="rotate(10 60 210)" />
      {/* 九州 */}
      <ellipse cx="35" cy="240" rx="26" ry="30" fill="currentColor" transform="rotate(-10 35 240)" />
      {/* 沖縄 */}
      <circle cx="30" cy="300" r="8" fill="currentColor" />
    </svg>
  );
}

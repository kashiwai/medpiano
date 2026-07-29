import { bgColorMap, onColorTextMap, type BrandColor } from "@/lib/utils";

type PillBadgeProps = {
  children: React.ReactNode;
  color?: BrandColor;
  size?: "sm" | "md" | "lg";
  rotate?: number;
  className?: string;
};

const sizeMap: Record<NonNullable<PillBadgeProps["size"]>, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-5 py-2 text-sm",
  lg: "px-7 py-3 text-lg",
};

export function PillBadge({ children, color = "magenta", size = "md", rotate = 0, className = "" }: PillBadgeProps) {
  return (
    <span
      className={`inline-block font-anton uppercase border-[3px] border-black rounded-full shadow-sticker-sm ${bgColorMap[color]} ${onColorTextMap[color]} ${sizeMap[size]} ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

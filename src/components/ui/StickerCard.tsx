import { onColorTextMap, type BrandColor } from "@/lib/utils";

type StickerCardProps = {
  children: React.ReactNode;
  color?: BrandColor;
  rotate?: number;
  className?: string;
};

const bgMap: Record<BrandColor, string> = {
  cream: "bg-cream-light",
  magenta: "bg-magenta",
  teal: "bg-teal",
  sun: "bg-sun",
  black: "bg-black",
};

export function StickerCard({ children, color = "cream", rotate = 0, className = "" }: StickerCardProps) {
  return (
    <div
      className={`border-[3px] border-black rounded-3xl p-8 md:p-10 shadow-sticker ${bgMap[color]} ${onColorTextMap[color]} ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  );
}

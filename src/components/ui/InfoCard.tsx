import { bgColorMap, onColorTextMap, type BrandColor } from "@/lib/utils";

type InfoCardProps = {
  color: BrandColor;
  title: string;
  titleJa: string;
  children: React.ReactNode;
};

export function InfoCard({ color, title, titleJa, children }: InfoCardProps) {
  return (
    <div className={`border-[3px] border-black rounded-3xl p-6 shadow-sticker-sm ${bgColorMap[color]} ${onColorTextMap[color]}`}>
      <p className="font-anton uppercase text-sm opacity-70">{title}</p>
      <p className="font-zen font-black text-xs opacity-70">{titleJa}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

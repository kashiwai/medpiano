import { bgColorMap, onColorTextMap, type BrandColor } from "@/lib/utils";

type MysteryCardProps = {
  color: Extract<BrandColor, "magenta" | "teal" | "sun">;
  en: string;
  ja: string;
  desc?: string;
};

export function MysteryCard({ color, en, ja, desc }: MysteryCardProps) {
  return (
    <div
      className={`border-[4px] border-black rounded-3xl p-8 shadow-sticker ${bgColorMap[color]} ${onColorTextMap[color]}`}
    >
      <p className="font-anton text-3xl uppercase">{en}</p>
      <p className="mt-4 font-anton text-6xl">???</p>
      <p className="mt-4 font-zen font-black text-xl">{ja}</p>
      {desc && <p className="mt-2 font-dm text-sm opacity-70">{desc}</p>}
    </div>
  );
}

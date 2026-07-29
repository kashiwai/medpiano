import { bgColorMap, type BrandColor } from "@/lib/utils";

type TalentCategoryCardProps = {
  color: Extract<BrandColor, "magenta" | "teal" | "sun">;
  number: string;
  en: string;
  ja: string;
  desc: string;
  descJa: string;
};

export function TalentCategoryCard({ color, number, en, ja, desc, descJa }: TalentCategoryCardProps) {
  return (
    <div className={`border-[4px] border-black rounded-3xl p-8 shadow-sticker ${bgColorMap[color]}`}>
      <div className="flex items-baseline gap-4">
        <span className="font-anton text-8xl leading-none">{number}</span>
        <div>
          <p className="font-anton text-2xl uppercase">{en}</p>
          <p className="font-zen font-black text-lg">{ja}</p>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t-2 border-black/30">
        <p className="font-dm text-sm">{desc}</p>
        <p className="mt-2 font-zen font-bold text-sm">{descJa}</p>
      </div>
    </div>
  );
}

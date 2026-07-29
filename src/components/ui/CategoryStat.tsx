import { bgColorMap, onColorTextMap, type BrandColor } from "@/lib/utils";

type CategoryStatProps = {
  color: BrandColor;
  number: string;
  en: string;
  ja: string;
};

export function CategoryStat({ color, number, en, ja }: CategoryStatProps) {
  return (
    <div
      className={`border-[3px] border-black rounded-3xl p-6 text-center shadow-sticker-sm ${bgColorMap[color]} ${onColorTextMap[color]}`}
    >
      <p className="font-anton text-6xl leading-none">{number}</p>
      <p className="mt-3 font-anton text-lg uppercase">{en}</p>
      <p className="font-zen font-black text-sm">{ja}</p>
    </div>
  );
}

import { textColorMap, type BrandColor } from "@/lib/utils";
import { Sparkle } from "@/components/doodles/Sparkle";

type BigNumberBlockProps = {
  number: string;
  en: string;
  ja: string;
  color: Extract<BrandColor, "magenta" | "teal" | "sun">;
};

export function BigNumberBlock({ number, en, ja, color }: BigNumberBlockProps) {
  return (
    <div className="text-center relative">
      <Sparkle className={`absolute -top-4 -right-4 w-8 h-8 ${textColorMap[color]}`} />
      <p className={`font-anton text-number-lg leading-none ${textColorMap[color]}`}>{number}</p>
      <p className="mt-4 font-anton text-xl uppercase">{en}</p>
      <p className="mt-1 font-zen font-black text-sm">{ja}</p>
    </div>
  );
}

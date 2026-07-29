import { bgColorMap, type BrandColor } from "@/lib/utils";

type SpeedCardProps = {
  color: Extract<BrandColor, "magenta" | "teal">;
  number: string;
  unit: string;
  ja: string;
};

export function SpeedCard({ color, number, unit, ja }: SpeedCardProps) {
  return (
    <div className={`border-[4px] border-black rounded-3xl p-12 shadow-sticker text-center ${bgColorMap[color]}`}>
      <div className="flex items-baseline justify-center gap-4">
        <span className="font-anton text-[8rem] md:text-[12rem] leading-none">{number}</span>
        <span className="font-anton text-3xl uppercase">{unit}</span>
      </div>
      <p className="mt-4 font-zen font-black text-2xl">{ja}</p>
    </div>
  );
}

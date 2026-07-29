import { bgColorMap, type BrandColor } from "@/lib/utils";

type StatCardProps = {
  number: string;
  en: string;
  ja: string;
  color: Extract<BrandColor, "magenta" | "teal" | "sun">;
  note?: string;
};

export function StatCard({ number, en, ja, color, note }: StatCardProps) {
  return (
    <div className={`border-[4px] border-black rounded-3xl p-8 shadow-sticker text-center ${bgColorMap[color]}`}>
      <p className="font-anton text-number-lg text-black leading-none">{number}</p>
      <p className="mt-4 font-anton text-2xl uppercase">{en}</p>
      <p className="mt-1 font-zen font-black text-lg">{ja}</p>
      {note && <p className="mt-3 font-dm text-xs text-black/70">{note}</p>}
    </div>
  );
}

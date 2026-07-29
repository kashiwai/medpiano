import { bgColorMap, type BrandColor } from "@/lib/utils";
import { PillBadge } from "@/components/ui/PillBadge";

type ClientCardProps = {
  color: Extract<BrandColor, "magenta" | "teal" | "sun">;
  name: string;
  nameJa: string;
  category: string;
  categoryJa: string;
  desc: string;
};

export function ClientCard({ color, name, nameJa, category, categoryJa, desc }: ClientCardProps) {
  return (
    <div className="bg-cream border-[3px] border-black rounded-3xl overflow-hidden shadow-sticker-sm flex">
      <div className={`w-4 ${bgColorMap[color]} border-r-[3px] border-black`} />
      <div className="flex-1 p-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="font-anton text-3xl uppercase">{name}</h3>
          <PillBadge color={color} size="sm">
            {category}
          </PillBadge>
        </div>
        <p className="font-zen font-black text-lg">{nameJa}</p>
        <p className="text-sm text-black/70">{categoryJa}</p>
        <p className="mt-4 font-dm text-sm">{desc}</p>
      </div>
    </div>
  );
}

type TimelineNodeProps = {
  year: string;
  label: string;
  ja: string;
  active: boolean;
  highlight?: boolean;
};

export function TimelineNode({ year, label, ja, active, highlight }: TimelineNodeProps) {
  const nodeColor = highlight ? "bg-magenta" : active ? "bg-teal" : "bg-cream-light";

  return (
    <div className="flex flex-col items-center relative z-10">
      <div
        className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-[4px] border-black ${nodeColor} flex items-center justify-center shadow-sticker-sm`}
      >
        <span className="font-anton text-xl md:text-2xl">{year}</span>
      </div>
      <p className="mt-4 font-anton text-sm uppercase text-center">{label}</p>
      <p className="mt-1 font-zen font-black text-xs text-black/70 text-center">{ja}</p>
    </div>
  );
}

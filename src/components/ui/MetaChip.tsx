type MetaChipProps = {
  label: string;
  value: string;
};

export function MetaChip({ label, value }: MetaChipProps) {
  return (
    <div className="inline-flex items-baseline gap-2 border-[2px] border-black rounded-full px-4 py-2 bg-cream-light">
      <span className="font-anton text-xs uppercase text-black/60">{label}</span>
      <span className="font-zen font-black text-sm">{value}</span>
    </div>
  );
}

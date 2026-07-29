import { textColorMap, type BrandColor } from "@/lib/utils";

type BigNumberProps = {
  value: string;
  color?: Extract<BrandColor, "black" | "magenta" | "teal" | "sun">;
  align?: "left" | "center" | "right";
};

const alignMap: Record<NonNullable<BigNumberProps["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function BigNumber({ value, color = "black", align = "center" }: BigNumberProps) {
  return (
    <span className={`block font-anton text-number-mega leading-none ${textColorMap[color]} ${alignMap[align]}`}>
      {value}
    </span>
  );
}

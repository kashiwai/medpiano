type CornerShapeProps = {
  position: "tl" | "tr" | "bl" | "br";
  color: "magenta" | "teal" | "sun";
  shape?: "square" | "circle" | "oval";
  size?: "sm" | "md" | "lg";
};

const positionClassMap: Record<CornerShapeProps["position"], string> = {
  tl: "-top-8 -left-8",
  tr: "-top-8 -right-8",
  bl: "-bottom-8 -left-8",
  br: "-bottom-8 -right-8",
};

const sizeClassMap: Record<NonNullable<CornerShapeProps["size"]>, string> = {
  sm: "w-32 h-32",
  md: "w-48 h-48",
  lg: "w-64 h-64",
};

const bgClassMap: Record<CornerShapeProps["color"], string> = {
  magenta: "bg-magenta",
  teal: "bg-teal",
  sun: "bg-sun",
};

const rotateClassMap: Record<CornerShapeProps["position"], string> = {
  tl: "rotate-12",
  br: "rotate-12",
  tr: "-rotate-12",
  bl: "-rotate-12",
};

export function CornerShape({ position, color, shape = "square", size = "md" }: CornerShapeProps) {
  const shapeClass =
    shape === "circle" ? "rounded-full" : shape === "oval" ? "rounded-full aspect-[2/1]" : "rounded-3xl";

  return (
    <div
      className={`absolute ${positionClassMap[position]} ${sizeClassMap[size]} ${shapeClass} ${bgClassMap[color]} ${rotateClassMap[position]} -z-10 pointer-events-none`}
      aria-hidden="true"
    />
  );
}

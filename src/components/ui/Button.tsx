import { Link } from "@/i18n/routing";
import { bgColorMap, onColorTextMap, type BrandColor } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "filled" | "outline";
  color?: Extract<BrandColor, "magenta" | "teal" | "sun" | "black">;
  size?: "md" | "lg";
  external?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  children,
  href,
  onClick,
  variant = "filled",
  color = "magenta",
  size = "md",
  external = false,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 font-anton uppercase border-[3px] border-black rounded-full shadow-sticker-sm hover:rotate-[-2deg] transition-transform disabled:opacity-50";

  const sizeClass = size === "lg" ? "px-8 py-4 text-xl" : "px-6 py-3 text-base";

  const colorClass =
    variant === "filled" ? `${bgColorMap[color]} ${onColorTextMap[color]}` : "bg-transparent text-black hover:bg-black/5";

  const classes = `${base} ${sizeClass} ${colorClass} ${className}`;

  if (href) {
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

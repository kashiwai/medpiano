import { Anton, Archivo_Black, Zen_Kaku_Gothic_New, DM_Sans } from "next/font/google";

export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

export const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo",
  display: "swap",
});

export const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-zen",
  display: "swap",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-dm",
  display: "swap",
});

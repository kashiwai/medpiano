"use client";

import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const NAV_ITEMS = [
  { href: "/", key: "home" as const },
  { href: "/profile", key: "profile" as const },
  { href: "/works", key: "works" as const },
  { href: "/clients", key: "clients" as const },
  { href: "/news", key: "news" as const },
  { href: "/contact", key: "contact" as const },
];

export default function MobileMenu({ onClose }: { onClose: () => void }) {
  const tNav = useTranslations("Nav");
  const tMobile = useTranslations("MobileNav");

  // header の sticky + backdrop-blur が新しい containing block を作り、
  // 子要素の position: fixed が viewport 基準にならなくなるため、
  // document.body 直下に Portal で描画して回避する。
  // このコンポーネントはハンバーガークリック後にのみマウントされるため、
  // SSR中に document が存在しない問題は起きない。
  return createPortal(
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25 }}
      className="fixed inset-0 z-[100] bg-cream flex flex-col p-8"
    >
      <div className="flex justify-between items-center mb-16">
        <p className="font-anton text-3xl uppercase">MEDPIANO</p>
        <button
          onClick={onClose}
          className="w-12 h-12 bg-magenta border-[3px] border-black rounded-full flex items-center justify-center"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex flex-col gap-6">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose} className="group">
            <p className="font-anton text-5xl uppercase group-hover:text-magenta transition-colors">
              {tNav(item.key)}
            </p>
            <p className="font-zen font-black text-lg mt-1">{tMobile(item.key)}</p>
          </Link>
        ))}
      </nav>
    </motion.div>,
    document.body,
  );
}

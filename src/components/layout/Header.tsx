"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import MobileMenu from "@/components/layout/MobileMenu";

export default function Header() {
  const t = useTranslations("Nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b-2 border-black transition-all ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/icon.png"
            alt=""
            aria-hidden
            width={40}
            height={40}
            className="h-9 w-9 rounded-xl border-2 border-black object-cover md:h-10 md:w-10"
          />
          <span className="font-anton text-2xl uppercase tracking-tight md:text-3xl">
            MEDPIANO
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <NavLink href="/">{t("home")}</NavLink>
          <NavLink href="/profile">{t("profile")}</NavLink>
          <NavLink href="/works">{t("works")}</NavLink>
          <NavLink href="/clients">{t("clients")}</NavLink>
          <NavLink href="/news">{t("news")}</NavLink>
          <NavLink href="/contact" highlighted>
            {t("contact")}
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  href,
  children,
  highlighted,
}: {
  href: string;
  children: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`font-anton uppercase text-lg hover:text-magenta transition-colors ${
        highlighted
          ? "bg-magenta border-[3px] border-black rounded-full px-4 py-1 hover:rotate-[-2deg] transition-transform"
          : ""
      }`}
    >
      {children}
    </Link>
  );
}

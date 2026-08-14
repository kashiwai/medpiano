import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-cream py-16 md:py-24 px-6 md:px-12 mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Image
              src="/brand/logo-text.png"
              alt="MEDPIANO"
              width={653}
              height={206}
              className="h-auto w-full max-w-[200px]"
            />
            <p className="mt-4 font-dm text-sm text-cream/70 max-w-sm">{t("tagline")}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="bg-teal text-black text-xs font-anton uppercase px-3 py-1 rounded-full">
                {t("jasrac")}
              </span>
              <span className="bg-cream/10 text-cream text-xs font-anton uppercase px-3 py-1 rounded-full border border-cream/30">
                {t("since")}
              </span>
            </div>
          </div>

          <div>
            <p className="font-anton uppercase text-sm text-cream/50 mb-4">{t("site")}</p>
            <ul className="space-y-2">
              <FooterLink href="/">{tNav("home")}</FooterLink>
              <FooterLink href="/profile">{tNav("profile")}</FooterLink>
              <FooterLink href="/works">{tNav("works")}</FooterLink>
              <FooterLink href="/clients">{tNav("clients")}</FooterLink>
              <FooterLink href="/news">{tNav("news")}</FooterLink>
              <FooterLink href="/contact">{tNav("contact")}</FooterLink>
            </ul>
          </div>

          <div>
            <p className="font-anton uppercase text-sm text-cream/50 mb-4">{t("legal")}</p>
            <ul className="space-y-2">
              <FooterLink href="/privacy">{t("privacy")}</FooterLink>
              <FooterLink href="/terms">{t("terms")}</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cream/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-dm text-xs text-cream/50">
            © {year} MedPiano. {t("copyright")}
          </p>
          <p className="font-anton uppercase text-xs text-cream/50">{t("madeIn")}</p>
        </div>
        <div className="mt-2 flex justify-center gap-3">
          <Link href="/upload" className="text-[10px] text-cream/20 hover:text-cream/40">
            admin upload
          </Link>
          <Link href="/inquiries" className="text-[10px] text-cream/20 hover:text-cream/40">
            admin inquiries
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="font-dm hover:text-magenta transition-colors">
        {children}
      </Link>
    </li>
  );
}

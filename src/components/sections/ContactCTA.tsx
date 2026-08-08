import Image from "next/image";
import { useTranslations } from "next-intl";
import { Sparkle } from "@/components/doodles/Sparkle";
import { CurlyArrow } from "@/components/doodles/CurlyArrow";
import { Button } from "@/components/ui/Button";
import { PillBadge } from "@/components/ui/PillBadge";

export function ContactCTA() {
  const t = useTranslations("HomePage.cta");

  return (
    <section className="py-32 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative">
        <Sparkle className="absolute top-0 left-1/4 w-12 h-12 hidden md:block" />
        <Sparkle className="absolute bottom-0 right-1/4 w-8 h-8 hidden md:block" />
        <CurlyArrow className="absolute top-16 -right-8 w-20 h-20 hidden md:block" rotation={120} />

        <Image
          src="/brand/logo.png"
          alt="MedPiano — AI Music Creator"
          width={460}
          height={378}
          className="mx-auto mb-8 h-auto w-full max-w-[220px]"
        />

        <h2 className="font-anton text-hero uppercase leading-[0.9]">
          {t("title1")}
          <br />
          {t("title2")}
          <br />
          {t("title3")}
        </h2>
        <p className="mt-8 font-zen font-black text-2xl">{t("subtitle")}</p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button href="/contact" variant="filled" color="magenta" size="lg">
            {t("button")}
          </Button>
          <PillBadge color="teal">{t("jasrac")}</PillBadge>
        </div>
      </div>
    </section>
  );
}

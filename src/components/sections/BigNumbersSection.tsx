import { useTranslations } from "next-intl";
import { BigNumberBlock } from "@/components/ui/BigNumberBlock";

export function BigNumbersSection() {
  const t = useTranslations("HomePage.numbers");

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-cream-light">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        <BigNumberBlock number="3,000+" en="SONGS COMPOSED" ja={t("songs")} color="magenta" />
        <BigNumberBlock number="10+" en="YEARS IN THE SHADOWS" ja={t("years")} color="teal" />
        <BigNumberBlock number="47" en="PREFECTURES REACHED" ja={t("prefectures")} color="sun" />
      </div>
    </section>
  );
}

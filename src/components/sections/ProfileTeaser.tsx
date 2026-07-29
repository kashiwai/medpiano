import { useTranslations } from "next-intl";
import { MysteryCard } from "@/components/ui/MysteryCard";
import { Button } from "@/components/ui/Button";

export function ProfileTeaser() {
  const t = useTranslations("HomePage.mystery");

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-anton text-h1 uppercase">{t("title")}</h2>
          <p className="mt-4 font-zen font-black text-xl">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <MysteryCard color="magenta" en="AGE" ja={t("age")} />
          <MysteryCard color="teal" en="GENDER" ja={t("gender")} />
          <MysteryCard color="sun" en="FACE" ja={t("face")} />
        </div>

        <div className="text-center mt-16">
          <Button href="/profile" variant="outline">
            {t("cta")}
          </Button>
        </div>
      </div>
    </section>
  );
}

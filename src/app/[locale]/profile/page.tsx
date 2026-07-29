import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PillBadge } from "@/components/ui/PillBadge";
import { MysteryCard } from "@/components/ui/MysteryCard";
import { TimelineNode } from "@/components/ui/TimelineNode";
import { StatCard } from "@/components/ui/StatCard";
import { SpeedCard } from "@/components/ui/SpeedCard";
import { Button } from "@/components/ui/Button";
import { Sparkle } from "@/components/doodles/Sparkle";
import { QuoteMark } from "@/components/doodles/QuoteMark";
import { GrowthArrow } from "@/components/doodles/GrowthArrow";
import profileData from "@/data/profile.json";
import type { Locale, ProfileData } from "@/lib/types";

const profile = profileData as ProfileData;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return locale === "ja"
    ? {
        title: "PROFILE — 謎の作詞作曲家 MedPiano",
        description:
          "年齢不詳・性別不明。日本のポップシーンに10年ハマり続け、3,000曲以上を制作。純粋な情熱で音楽を作り続ける匿名クリエイター。",
      }
    : {
        title: "PROFILE — MedPiano, The Faceless Composer",
        description:
          "Unknown age, unknown gender. 10 years obsessed with the Japanese pop scene, 3,000+ songs composed. An anonymous creator driven by pure passion.",
      };
}

export default async function ProfilePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ProfilePage");

  return (
    <>
      {/* HERO */}
      <section className="relative py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <PillBadge color="magenta">{t("hero.badge")}</PillBadge>
            <h1 className="mt-6 font-anton text-hero uppercase leading-[0.9]">
              {t("hero.title1")}
              <br />
              {t("hero.title2")}
            </h1>
            <div className="mt-8 text-5xl font-anton flex justify-center gap-4">
              <span>?</span>
              <span>?</span>
              <span>?</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <MysteryCard
              color="magenta"
              en={t("hero.cards.age.label")}
              ja={t("hero.cards.age.ja")}
              desc={t("hero.cards.age.desc")}
            />
            <MysteryCard
              color="teal"
              en={t("hero.cards.gender.label")}
              ja={t("hero.cards.gender.ja")}
              desc={t("hero.cards.gender.desc")}
            />
            <MysteryCard
              color="sun"
              en={t("hero.cards.face.label")}
              ja={t("hero.cards.face.ja")}
              desc={t("hero.cards.face.desc")}
            />
          </div>

          <p className="mt-16 text-center font-zen font-black text-2xl md:text-3xl">{t("hero.quote")}</p>
          <p className="mt-2 text-center font-dm text-lg text-black/70">{t("hero.quoteEn")}</p>
        </div>
      </section>

      {/* PURE OBSESSION */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-black text-cream">
        <div className="max-w-4xl mx-auto text-center relative">
          <Sparkle className="absolute top-0 left-8 text-magenta w-10 h-10 hidden md:block" />
          <Sparkle className="absolute bottom-0 right-8 text-sun w-8 h-8 hidden md:block" />

          <div className="inline-block bg-magenta border-[3px] border-cream rounded-full px-6 py-2 mb-8">
            <span className="font-zen font-black text-lg text-black">{t("obsession.badge")}</span>
          </div>

          <h2 className="font-anton text-hero uppercase leading-[0.9]">
            {t("obsession.title1")}
            <br />
            {t("obsession.title2")}
          </h2>

          <div className="mt-12 space-y-4">
            <p className="font-zen font-black text-2xl md:text-4xl">{t("obsession.line1")}</p>
            <p className="font-zen font-black text-4xl md:text-6xl text-sun">{t("obsession.line2")}</p>
          </div>

          <p className="mt-12 font-dm text-xl italic">{t("obsession.quote")}</p>
          <p className="mt-2 font-zen font-black text-xl">{t("obsession.quoteJa")}</p>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <PillBadge color="teal">{t("timeline.badge")}</PillBadge>
            <h2 className="mt-4 font-anton text-h1 uppercase">{t("timeline.title")}</h2>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-black -translate-y-1/2 hidden md:block" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 relative">
              {profile.timeline.map((event) => (
                <TimelineNode
                  key={event.year}
                  year={event.year}
                  label={event.labelEn}
                  ja={event.labelJa}
                  active={event.active}
                  highlight={event.highlight}
                />
              ))}
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="max-w-2xl w-full">
              <GrowthArrow className="w-full h-auto text-black" />
              <p className="mt-6 text-center font-zen font-black text-xl">{t("timeline.growthJa")}</p>
              <p className="mt-1 text-center font-dm text-sm text-black/70">{t("timeline.growthEn")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-cream-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <PillBadge color="sun">{t("stats.badge")}</PillBadge>
            <h2 className="mt-4 font-anton text-h1 uppercase">{t("stats.title")}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {profile.stats.map((stat) => (
              <StatCard
                key={stat.en}
                number={stat.number}
                en={stat.en}
                ja={stat.ja}
                color={stat.color}
                note={stat.note}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SPEED */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <PillBadge color="magenta">{t("speed.badge")}</PillBadge>
            <h2 className="mt-4 font-anton text-h1 uppercase">
              {t("speed.title1")}
              <br />
              {t("speed.title2")}
            </h2>
            <p className="mt-4 font-zen font-black text-2xl">{t("speed.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <SpeedCard color="magenta" number="3" unit="DAYS" ja={t("speed.fastest")} />
            <SpeedCard color="teal" number="7" unit="DAYS" ja={t("speed.standard")} />
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block space-y-2">
              <p className="font-anton text-5xl uppercase">{t("speed.quality1")}</p>
              <p className="font-zen font-black text-3xl">{t("speed.qualityJa")}</p>
              <p className="font-anton text-5xl uppercase">{t("speed.quality2")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-32 px-6 md:px-12 bg-teal text-black relative">
        <div className="max-w-4xl mx-auto relative">
          <QuoteMark className="absolute -top-8 left-0 w-24 h-24 text-black/20" />

          <blockquote className="font-anton text-4xl md:text-6xl uppercase leading-tight">
            &ldquo;{t("manifesto.en1")}
            <br />
            {t("manifesto.en2")}
            <br />
            {t("manifesto.en3")}&rdquo;
          </blockquote>

          <p className="mt-12 font-zen font-black text-xl">
            {t("manifesto.ja1")}
            <br />
            {t("manifesto.ja2")}
          </p>

          <p className="mt-8 font-dm text-sm">— MedPiano</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-anton text-h1 uppercase">{t("cta.title")}</h2>
          <p className="mt-4 font-zen font-black text-xl">{t("cta.subtitle")}</p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/works" variant="filled" color="magenta" size="lg">
              {t("cta.primary")}
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              {t("cta.secondary")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

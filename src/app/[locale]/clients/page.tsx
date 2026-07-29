import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PillBadge } from "@/components/ui/PillBadge";
import { CategoryStat } from "@/components/ui/CategoryStat";
import { TalentCategoryCard } from "@/components/ui/TalentCategoryCard";
import { ClientCard } from "@/components/ui/ClientCard";
import { Button } from "@/components/ui/Button";
import { JapanMapSvg } from "@/components/doodles/JapanMapSvg";
import talentsData from "@/data/talents.json";
import type { Locale, TalentCategory } from "@/lib/types";

const talents = talentsData as TalentCategory[];

const PREFECTURES = ["北海道", "東京", "大阪", "京都", "福岡", "沖縄", "北陸", "東北"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return locale === "ja"
    ? {
        title: "CLIENTS — MedPiano の楽曲提供実績",
        description:
          "SONY Music、JRIグループ、焼肉気楽グループ、パチンコチェーン、47都道府県観光局、アーティスト・タレント・女優への楽曲提供実績。",
      }
    : {
        title: "CLIENTS — MedPiano's Track Record",
        description:
          "SONY Music, JRI Group, Kiraku Yakiniku Group, pachinko chains, all 47 prefectural tourism boards, and commissions for artists, talents, and actresses.",
      };
}

export default async function ClientsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ClientsPage");

  return (
    <>
      {/* HERO */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <PillBadge color="magenta">{t("hero.badge")}</PillBadge>
          <h1 className="mt-6 font-anton text-hero uppercase leading-[0.9]">
            {t("hero.title1")}
            <br />
            {t("hero.title2")}
          </h1>
          <p className="mt-8 font-zen font-black text-2xl">{t("hero.subtitle")}</p>
          <p className="mt-2 font-dm text-lg text-black/70">{t("hero.subtitleEn")}</p>
        </div>
      </section>

      {/* CATEGORY OVERVIEW */}
      <section className="py-16 px-6 md:px-12 bg-cream-light">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryStat color="magenta" number="17+" en="TALENTS" ja="アーティスト・タレント" />
          <CategoryStat color="teal" number="10+" en="CM BRANDS" ja="企業CM" />
          <CategoryStat color="sun" number="47" en="PREFECTURES" ja="都道府県観光局" />
          <CategoryStat color="black" number="1" en="MAJOR LABEL" ja="SONY Music" />
        </div>
      </section>

      {/* ARTIST COLLABS */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <PillBadge color="magenta">TALENT COLLABS</PillBadge>
            <h2 className="mt-4 font-anton text-h1 uppercase">
              SONGS FOR
              <br />
              THE STARS
            </h2>
            <p className="mt-4 font-zen font-black text-xl">ジャンルを超えて、17名以上に楽曲提供</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {talents.map((talent) => (
              <TalentCategoryCard
                key={talent.id}
                color={talent.color}
                number={talent.count.toString()}
                en={talent.en}
                ja={talent.ja}
                desc={talent.descEn}
                descJa={talent.descJa}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="inline-block bg-black text-cream px-6 py-3 rounded-full font-anton text-lg uppercase">
              Names disclosed under NDA
            </p>
            <p className="mt-3 font-zen font-black text-lg text-black/70">
              具体的な芸名はNDAのもとで開示いたします
            </p>
          </div>
        </div>
      </section>

      {/* CM CLIENTS */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-cream-light">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <PillBadge color="sun">CM TRACKS</PillBadge>
            <h2 className="mt-4 font-anton text-h1 uppercase">
              CM JINGLES
              <br />
              FOR 10+ BRANDS
            </h2>
            <p className="mt-4 font-zen font-black text-xl">耳に残るジングルを、日本のブランドへ</p>
          </div>

          <div className="space-y-6">
            <ClientCard
              color="magenta"
              name="JRI GROUP"
              nameJa="JRIグループ"
              category="Financial Services"
              categoryJa="金融サービス"
              desc="Corporate identity jingles for financial services group."
            />
            <ClientCard
              color="teal"
              name="KIRAKU YAKINIKU GROUP"
              nameJa="焼肉気楽グループ"
              category="Restaurant Chain"
              categoryJa="飲食チェーン"
              desc="Restaurant chain campaign music, TV & radio."
            />
            <ClientCard
              color="sun"
              name="PACHINKO CHAIN"
              nameJa="パチンコ店舗チェーン"
              category="Entertainment Venues"
              categoryJa="エンタメ施設"
              desc="Entertainment venue in-store music and campaign jingles."
            />

            <div className="bg-cream border-[3px] border-black rounded-3xl p-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <p className="font-anton text-2xl uppercase">+ 7 MORE BRANDS</p>
                <p className="font-zen font-black text-lg mt-1">その他 7社以上</p>
              </div>
              <p className="font-dm text-sm text-black/70 max-w-xs md:text-right">
                Details available upon request under NDA / 詳細はお問い合わせください
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SONY MUSIC COLLAB */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <PillBadge color="teal">MAJOR LABEL</PillBadge>
            <h2 className="mt-4 font-anton text-h1 uppercase">
              SONY MUSIC
              <br />
              COLLAB
            </h2>
            <p className="mt-4 font-zen font-black text-xl">映画音楽の実績</p>
          </div>

          <div className="bg-black text-cream border-[4px] border-black rounded-3xl p-8 md:p-16 shadow-sticker">
            <div className="space-y-6">
              <div>
                <p className="font-anton text-3xl uppercase text-sun">FILM INSERT SONGS</p>
                <p className="font-zen font-black text-xl mt-1">映画挿入歌</p>
                <p className="font-dm text-sm mt-2 text-cream/70">
                  Original songs placed within feature films in collaboration with SONY Music Entertainment
                  Japan.
                </p>
              </div>

              <div className="border-t border-cream/30 pt-6">
                <p className="font-anton text-3xl uppercase text-magenta">END CREDIT THEMES</p>
                <p className="font-zen font-black text-xl mt-1">エンディングテーマ</p>
                <p className="font-dm text-sm mt-2 text-cream/70">
                  Closing theme songs that carry the emotional weight of the film&apos;s final moments.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="bg-magenta text-black px-4 py-2 rounded-full font-zen font-black">
                オリジナル制作
              </span>
              <span className="bg-teal text-black px-4 py-2 rounded-full font-zen font-black">
                カスタム編曲
              </span>
            </div>
          </div>

          <p className="mt-12 text-center font-dm text-lg italic">
            &ldquo;From opening frame to closing credits.&rdquo;
          </p>
          <p className="mt-2 text-center font-zen font-black text-xl">オープニングからエンドロールまで。</p>
        </div>
      </section>

      {/* TOURISM */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-cream-light">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <PillBadge color="magenta">PREFECTURAL TOURISM</PillBadge>
            <h2 className="mt-4 font-anton text-h1 uppercase">
              SOUNDS OF
              <br />
              ALL JAPAN
            </h2>
            <p className="mt-4 font-zen font-black text-xl">47都道府県観光局イベント楽曲</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative flex justify-center">
              <JapanMapSvg className="w-full max-w-xs h-auto text-teal" />
            </div>

            <div>
              <div className="text-center mb-8">
                <p className="font-anton text-number-lg text-magenta leading-none">47</p>
                <p className="mt-4 font-anton text-2xl uppercase">PREFECTURES REACHED</p>
                <p className="mt-1 font-zen font-black text-xl">都道府県</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {PREFECTURES.map((pref) => (
                  <div key={pref} className="bg-cream border-[3px] border-black rounded-full px-4 py-2 text-center">
                    <span className="font-zen font-black">{pref}</span>
                  </div>
                ))}
              </div>

              <p className="mt-6 font-dm text-sm text-black/70">+ 39 more prefectures / ほか39都道府県</p>
            </div>
          </div>

          <p className="mt-16 text-center font-zen font-black text-2xl">
            街のジングルから、お祭りテーマまで。
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-anton text-hero uppercase leading-[0.9]">
            {t("cta.title1")}
            <br />
            {t("cta.title2")}
          </h2>
          <p className="mt-8 font-zen font-black text-2xl">{t("cta.subtitle")}</p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button href="/contact" variant="filled" color="magenta" size="lg">
              {t("cta.button")}
            </Button>
            <PillBadge color="teal" size="lg">
              {t("cta.jasrac")}
            </PillBadge>
          </div>
        </div>
      </section>
    </>
  );
}

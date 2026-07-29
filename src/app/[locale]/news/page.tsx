import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PillBadge } from "@/components/ui/PillBadge";
import { NewsCard } from "@/components/NewsCard";
import { Sparkle } from "@/components/doodles/Sparkle";
import { categoryColor, formatDate } from "@/lib/utils";
import newsData from "@/data/news.json";
import type { Locale, NewsItem } from "@/lib/types";

const news = newsData as NewsItem[];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return locale === "ja"
    ? {
        title: "NEWS — MedPiano 最新情報",
        description: "MV公開、楽曲リリース、コラボ告知など、MedPianoの最新情報をお届けします。",
      }
    : {
        title: "NEWS — Latest from MedPiano",
        description: "MV launches, track releases, and collaboration announcements from MedPiano.",
      };
}

export default async function NewsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("NewsPage");

  const sorted = [...news].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const featured = sorted.find((item) => item.featured) ?? sorted[0];
  const rest = sorted.filter((item) => item.id !== featured?.id);

  return (
    <>
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <PillBadge color="sun">{t("hero.badge")}</PillBadge>
          <h1 className="mt-6 font-anton text-hero uppercase leading-[0.9]">
            {t("hero.title1")}
            <br />
            {t("hero.title2")}
          </h1>
          <p className="mt-4 font-zen font-black text-xl">{t("hero.subtitle")}</p>
        </div>
      </section>

      {featured ? (
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <Link href={`/news/${featured.slug}`}>
              <article className="grid md:grid-cols-2 gap-8 bg-cream-light border-[4px] border-black rounded-3xl overflow-hidden shadow-sticker hover:rotate-[-0.5deg] transition-transform">
                <div className="aspect-video md:aspect-auto relative bg-teal min-h-[240px]">
                  {featured.thumbnail && (
                    <Image src={featured.thumbnail} alt={featured.titleEn} fill className="object-cover" />
                  )}
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex gap-2 mb-4">
                    <PillBadge color="magenta" size="sm">
                      {t("featuredBadge")}
                    </PillBadge>
                    <PillBadge color={categoryColor(featured.category)} size="sm">
                      {featured.category.toUpperCase()}
                    </PillBadge>
                  </div>
                  <time className="font-dm text-sm text-black/70">{formatDate(featured.publishedAt, locale)}</time>
                  <h2 className="mt-3 font-anton text-4xl md:text-5xl uppercase leading-tight">
                    {featured.titleEn}
                  </h2>
                  <p className="mt-3 font-zen font-black text-xl">{featured.titleJa}</p>
                  <p className="mt-4 font-dm text-black/80 line-clamp-3">{featured.excerpt}</p>
                  <p className="mt-6 font-anton text-lg uppercase">{t("readMore")}</p>
                </div>
              </article>
            </Link>
          </div>
        </section>
      ) : (
        <EmptyState comingSoon={t("comingSoon")} empty={t("empty")} />
      )}

      {rest.length > 0 && (
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-anton text-h2 uppercase mb-12">{t("moreStories")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((item) => (
                <NewsCard key={item.slug} news={item} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function EmptyState({ comingSoon, empty }: { comingSoon: string; empty: string }) {
  return (
    <div className="py-32 text-center px-6">
      <div className="inline-block bg-cream-light border-[3px] border-black rounded-3xl p-12">
        <Sparkle className="w-16 h-16 mx-auto text-magenta" />
        <p className="mt-6 font-anton text-2xl uppercase">{comingSoon}</p>
        <p className="mt-2 font-zen font-black text-lg">{empty}</p>
      </div>
    </div>
  );
}

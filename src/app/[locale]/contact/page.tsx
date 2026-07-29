import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PillBadge } from "@/components/ui/PillBadge";
import { InfoCard } from "@/components/ui/InfoCard";
import { ContactForm } from "@/components/ContactForm";
import { FAQItem } from "@/components/FAQItem";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return locale === "ja"
    ? {
        title: "CONTACT — MedPianoへのお問い合わせ",
        description: "CM楽曲、映画音楽、アーティスト楽曲提供、イベント楽曲のご相談はこちら。最短3日で楽曲納品可能。",
      }
    : {
        title: "CONTACT — Get in touch with MedPiano",
        description:
          "Inquiries for CM jingles, film scores, artist commissions, and event music. Delivery in as fast as 3 days.",
      };
}

const FAQ_ITEMS_JA = [
  {
    q: "最短でどのくらいで楽曲が納品できますか？",
    qEn: "How fast can you deliver a song?",
    a: "最短3日で完成品をお渡しします。標準納期は1週間です。急ぎのCM案件でも対応可能です。",
  },
  {
    q: "どんなジャンルに対応していますか？",
    qEn: "What genres do you cover?",
    a: "J-pop、R&B、ロック、EDM、劇伴、CMジングル、クラシック風まで幅広く対応します。3,000曲以上のアーカイブがあります。",
  },
  {
    q: "著作権はどうなっていますか？",
    qEn: "How are the rights managed?",
    a: "JASRAC登録済みです。作詞作曲権利は個別契約で決定します。買取・レンタル・ライセンス、いずれも対応可能。",
  },
  {
    q: "打ち合わせは対面でも可能ですか？",
    qEn: "Can we meet in person?",
    a: "オンライン（Zoom/Meet）が基本ですが、東京都内であれば対面打ち合わせも可能です。",
  },
  {
    q: "海外プロジェクトも対応可能ですか？",
    qEn: "Do you take international projects?",
    a: "はい、対応可能です。英語でのコミュニケーションも問題ありません。時差の関係でメールベースを推奨します。",
  },
];

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ContactPage");

  return (
    <>
      <section className="py-16 md:py-24 px-6 md:px-12">
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

      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Suspense>
              <ContactForm />
            </Suspense>
          </div>

          <aside className="space-y-6">
            <InfoCard color="magenta" title={t("info.responseTitle")} titleJa={t("info.responseTitleJa")}>
              <p className="font-dm">{t("info.responseEn")}</p>
              <p className="font-zen font-black">{t("info.responseJa")}</p>
            </InfoCard>

            <InfoCard color="teal" title={t("info.deliveryTitle")} titleJa={t("info.deliveryTitleJa")}>
              <p className="font-anton text-3xl">{t("info.deliveryValue")}</p>
              <p className="font-zen font-black text-sm mt-1">{t("info.deliveryJa")}</p>
            </InfoCard>

            <InfoCard color="sun" title={t("info.rightsTitle")} titleJa={t("info.rightsTitleJa")}>
              <p className="font-dm">{t("info.rightsEn")}</p>
              <p className="font-zen font-black">{t("info.rightsJa")}</p>
              <p className="font-dm text-xs mt-2 text-black/70">{t("info.rightsNote")}</p>
            </InfoCard>

            <InfoCard color="black" title={t("info.languagesTitle")} titleJa={t("info.languagesTitleJa")}>
              <p className="font-dm">{t("info.languagesEn")}</p>
              <p className="font-zen font-black">{t("info.languagesJa")}</p>
            </InfoCard>
          </aside>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-cream-light">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <PillBadge color="sun">{t("faq.badge")}</PillBadge>
            <h2 className="mt-4 font-anton text-h1 uppercase">{t("faq.title")}</h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS_JA.map((item) => (
              <FAQItem key={item.q} q={item.q} qEn={item.qEn} a={item.a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

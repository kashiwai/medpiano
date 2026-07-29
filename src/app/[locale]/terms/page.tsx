import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PillBadge } from "@/components/ui/PillBadge";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ja" ? "利用規約" : "Terms of Use",
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ja = locale === "ja";

  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <PillBadge color="magenta">LEGAL</PillBadge>
        <h1 className="mt-6 font-anton text-h1 uppercase">{ja ? "利用規約" : "Terms of Use"}</h1>
        <div className="mt-8 space-y-4 font-dm leading-relaxed">
          {ja ? (
            <>
              <p>
                本サイトに掲載されている全ての楽曲は、MedPianoによるオリジナル作品であり、JASRACに登録されています。
              </p>
              <p>
                楽曲の利用（CM・映画・イベント等での使用）をご希望の場合は、事前にお問い合わせフォームよりご相談ください。
                無断での複製・二次利用はお断りしています。
              </p>
              <p>本規約の内容は予告なく変更される場合があります。</p>
            </>
          ) : (
            <>
              <p>All tracks featured on this site are original works by MedPiano, registered with JASRAC.</p>
              <p>
                If you wish to license a track for CM, film, event, or other use, please get in touch via the
                contact form first. Unauthorized reproduction or secondary use is not permitted.
              </p>
              <p>These terms may be updated without prior notice.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

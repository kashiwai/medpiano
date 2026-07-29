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
    title: locale === "ja" ? "プライバシーポリシー" : "Privacy Policy",
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ja = locale === "ja";

  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <PillBadge color="teal">{ja ? "LEGAL" : "LEGAL"}</PillBadge>
        <h1 className="mt-6 font-anton text-h1 uppercase">{ja ? "プライバシーポリシー" : "Privacy Policy"}</h1>
        <div className="mt-8 space-y-4 font-dm leading-relaxed">
          {ja ? (
            <>
              <p>
                MedPiano（以下「当方」）は、お問い合わせフォームを通じて取得した氏名・メールアドレス等の個人情報を、
                お問い合わせへの対応および関連するご連絡の目的にのみ利用します。
              </p>
              <p>取得した情報を、ご本人の同意なく第三者へ提供することはありません。</p>
              <p>
                本ポリシーの内容は予告なく変更される場合があります。ご不明点はお問い合わせフォームよりご連絡ください。
              </p>
            </>
          ) : (
            <>
              <p>
                MedPiano (&quot;we&quot;) uses the name, email address, and other personal information collected
                through the contact form solely to respond to your inquiry and related communications.
              </p>
              <p>We do not share collected information with third parties without your consent.</p>
              <p>
                This policy may be updated without prior notice. Please reach out via the contact form with any
                questions.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

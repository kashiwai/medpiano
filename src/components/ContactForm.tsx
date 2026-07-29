"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { contactSchema, type ContactFormData } from "@/lib/schemas/contact";
import { FormField, inputStyles } from "@/components/ui/FormField";
import { MusicIcon } from "@/components/doodles/MusicIcon";
import { Sparkle } from "@/components/doodles/Sparkle";

export function ContactForm() {
  const t = useTranslations("ContactPage.form");
  const searchParams = useSearchParams();
  const referencedTrack = searchParams.get("track") ?? undefined;
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { referencedTrack },
  });

  async function onSubmit(data: ContactFormData) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Send failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <SuccessMessage />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {referencedTrack && (
        <div className="bg-sun border-[3px] border-black rounded-2xl p-4 flex items-center gap-3">
          <MusicIcon className="w-5 h-5 flex-shrink-0" />
          <p className="font-zen font-black">
            {t("referencedTrack")}: <span className="font-anton uppercase">{referencedTrack}</span>
          </p>
        </div>
      )}

      <input {...register("website")} type="text" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

      <div className="grid md:grid-cols-2 gap-6">
        <FormField label={t("name")} labelEn={t("nameEn")} required error={errors.name?.message}>
          <input {...register("name")} type="text" className={inputStyles} />
        </FormField>

        <FormField label={t("email")} labelEn={t("emailEn")} required error={errors.email?.message}>
          <input {...register("email")} type="email" className={inputStyles} />
        </FormField>
      </div>

      <FormField label={t("company")} labelEn={t("companyEn")} error={errors.company?.message}>
        <input {...register("company")} type="text" className={inputStyles} />
      </FormField>

      <FormField
        label={t("projectType")}
        labelEn={t("projectTypeEn")}
        required
        error={errors.projectType?.message}
      >
        <select {...register("projectType")} className={inputStyles} defaultValue="">
          <option value="" disabled>
            {t("projectTypeSelect")}
          </option>
          <option value="cm">{t("projectTypeCm")}</option>
          <option value="movie">{t("projectTypeMovie")}</option>
          <option value="artist">{t("projectTypeArtist")}</option>
          <option value="event">{t("projectTypeEvent")}</option>
          <option value="other">{t("projectTypeOther")}</option>
        </select>
      </FormField>

      <div className="grid md:grid-cols-2 gap-6">
        <FormField label={t("budget")} labelEn={t("budgetEn")} error={errors.budget?.message}>
          <select {...register("budget")} className={inputStyles} defaultValue="">
            <option value="">{t("budgetTbd")}</option>
            <option value="under-100k">{t("budget1")}</option>
            <option value="100k-500k">{t("budget2")}</option>
            <option value="500k-1m">{t("budget3")}</option>
            <option value="over-1m">{t("budget4")}</option>
            <option value="discuss">{t("budget5")}</option>
          </select>
        </FormField>

        <FormField label={t("timeline")} labelEn={t("timelineEn")} error={errors.timeline?.message}>
          <select {...register("timeline")} className={inputStyles} defaultValue="">
            <option value="">{t("timelineTbd")}</option>
            <option value="3days">{t("timeline1")}</option>
            <option value="1week">{t("timeline2")}</option>
            <option value="2weeks">{t("timeline3")}</option>
            <option value="1month">{t("timeline4")}</option>
            <option value="flexible">{t("timeline5")}</option>
          </select>
        </FormField>
      </div>

      <FormField label={t("message")} labelEn={t("messageEn")} required error={errors.message?.message}>
        <textarea {...register("message")} rows={6} className={inputStyles} />
      </FormField>

      <div className="flex items-start gap-3">
        <input
          {...register("consent")}
          type="checkbox"
          id="consent"
          className="mt-1 w-5 h-5 border-[3px] border-black accent-magenta"
        />
        <label htmlFor="consent" className="text-sm font-dm">
          {t("consentPrefix")}
          <Link href="/privacy" className="underline">
            {t("consentLinkText")}
          </Link>
          {t("consentSuffix")}
        </label>
      </div>
      {errors.consent && <p className="text-magenta text-sm font-zen font-bold">{errors.consent.message}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-magenta text-black border-[4px] border-black rounded-full py-5 font-anton text-2xl uppercase shadow-sticker hover:rotate-[-1deg] transition-transform disabled:opacity-50"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>

      {status === "error" && <p className="text-magenta font-zen font-black">{t("errorText")}</p>}
    </form>
  );
}

function SuccessMessage() {
  const t = useTranslations("ContactPage.form");
  return (
    <div className="text-center py-16">
      <div className="inline-block bg-teal border-[4px] border-black rounded-3xl p-12 shadow-sticker">
        <Sparkle className="w-20 h-20 mx-auto text-cream mb-6" />
        <h2 className="font-anton text-4xl uppercase text-cream">
          {t("successTitle1")}
          <br />
          {t("successTitle2")}
        </h2>
        <p className="mt-6 font-zen font-black text-cream text-xl">{t("successJa")}</p>
        <p className="mt-2 font-dm text-cream">{t("successEn")}</p>
      </div>
    </div>
  );
}

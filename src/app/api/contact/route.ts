import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas/contact";
import { env } from "@/env";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // ハニーポット：埋まっていればボットとみなし、成功を装って何もしない
    if (data.website) {
      return NextResponse.json({ ok: true });
    }

    // メール送信が失敗しても問い合わせ内容を失わないよう、まずDBに保存する
    const [saved] = await getDb()
      .insert(inquiries)
      .values({
        name: data.name,
        email: data.email,
        company: data.company || null,
        projectType: data.projectType,
        budget: data.budget || null,
        timeline: data.timeline || null,
        message: data.message,
        referencedTrack: data.referencedTrack || null,
      })
      .returning({ id: inquiries.id });

    const resend = new Resend(env.RESEND_API_KEY);
    const adminLink = `${env.NEXT_PUBLIC_SITE_URL}/ja/inquiries?id=${saved.id}`;

    const html = `
      <h1>New MedPiano Contact</h1>
      <table style="font-family: sans-serif;">
        <tr><td><strong>Name:</strong></td><td>${escapeHtml(data.name)}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${escapeHtml(data.email)}</td></tr>
        <tr><td><strong>Company:</strong></td><td>${escapeHtml(data.company || "-")}</td></tr>
        <tr><td><strong>Project Type:</strong></td><td>${escapeHtml(data.projectType)}</td></tr>
        <tr><td><strong>Budget:</strong></td><td>${escapeHtml(data.budget || "-")}</td></tr>
        <tr><td><strong>Timeline:</strong></td><td>${escapeHtml(data.timeline || "-")}</td></tr>
        ${
          data.referencedTrack
            ? `<tr><td><strong>Referenced Track:</strong></td><td>${escapeHtml(data.referencedTrack)}</td></tr>`
            : ""
        }
      </table>
      <h2>Message:</h2>
      <p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>
      <p><a href="${adminLink}">管理画面でこの問い合わせを見る →</a></p>
    `;

    await resend.emails.send({
      from: "MedPiano Site <noreply@medpiano.com>",
      to: env.INQUIRY_ADMIN_EMAIL,
      replyTo: data.email,
      subject: `[MedPiano] ${data.projectType.toUpperCase()} inquiry from ${data.name}`,
      html,
    });

    await resend.emails.send({
      from: "MedPiano <noreply@medpiano.com>",
      to: data.email,
      subject: "お問い合わせありがとうございます / Thank you for your inquiry",
      html: autoReplyHtml(data.name),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function autoReplyHtml(name: string): string {
  return `
    <div style="font-family: sans-serif;">
      <p>${escapeHtml(name)} 様</p>
      <p>この度はMedPianoへお問い合わせいただき、誠にありがとうございます。24時間以内にご返信いたします。</p>
      <p>Thank you for reaching out to MedPiano. We'll get back to you within 24 hours.</p>
    </div>
  `;
}

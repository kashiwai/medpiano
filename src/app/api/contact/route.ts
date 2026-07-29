import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas/contact";
import { env } from "@/env";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // ハニーポット：埋まっていればボットとみなし、成功を装って何もしない
    if (data.website) {
      return NextResponse.json({ ok: true });
    }

    const resend = new Resend(env.RESEND_API_KEY);

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
    `;

    await resend.emails.send({
      from: "MedPiano Site <noreply@medpiano.com>",
      to: env.CONTACT_TO_EMAIL,
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

import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";

function checkPassword(password: string | null | undefined) {
  return Boolean(process.env.UPLOAD_PASSWORD) && password === process.env.UPLOAD_PASSWORD;
}

export async function GET(request: Request) {
  const password = new URL(request.url).searchParams.get("password");
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "パスワードが違います。" }, { status: 401 });
  }

  const items = await getDb().select().from(inquiries).orderBy(desc(inquiries.createdAt));
  return NextResponse.json({ items });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status, password } = body as { id?: string; status?: string; password?: string };

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "パスワードが違います。" }, { status: 401 });
  }
  if (!id || !status || !["new", "read", "responded", "archived"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await getDb().update(inquiries).set({ status }).where(eq(inquiries.id, id));
  return NextResponse.json({ ok: true });
}

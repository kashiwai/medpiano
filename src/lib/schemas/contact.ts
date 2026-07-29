import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "名前を入力してください").max(100),
  email: z.string().email("有効なメールアドレスを入力してください"),
  company: z.string().max(100).optional(),
  projectType: z.enum(["cm", "movie", "artist", "event", "other"]),
  budget: z.enum(["under-100k", "100k-500k", "500k-1m", "over-1m", "discuss"]).optional(),
  timeline: z.enum(["3days", "1week", "2weeks", "1month", "flexible"]).optional(),
  message: z.string().min(10, "10文字以上入力してください").max(1000),
  referencedTrack: z.string().optional(),
  consent: z.literal(true, { message: "プライバシーポリシーへの同意が必要です" }),
  // ハニーポット：ボットが埋めてしまう隠しフィールド
  website: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

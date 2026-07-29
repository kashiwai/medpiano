import { z } from "zod";

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  CONTACT_TO_EMAIL: z.string().email(),
  NEXT_PUBLIC_R2_PUBLIC_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

export const env = envSchema.parse({
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
